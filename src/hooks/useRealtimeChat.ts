import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
  };
}

export interface ChatRoom {
  project_id: string;
  project_title: string;
  client_id: string;
  client_name: string;
  designer_id?: string;
  designer_name?: string;
  last_message?: ChatMessage;
  unread_count: number;
}

// Simplified chat system using just messages table with project_id
export const useRealtimeChat = (projectId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load messages for a project
  const loadMessages = useCallback(async () => {
    if (!projectId || !isSupabaseConfigured) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Test Supabase connection first
      if (!isSupabaseConfigured) {
        throw new Error(
          "Supabase is not configured. Please check your environment variables.",
        );
      }

      // Quick connection test
      console.log("Testing Supabase connection...");

      try {
        const { data: connectionTest, error: connectionError } = await supabase
          .from("users")
          .select("id")
          .limit(1);

        if (connectionError) {
          console.error("Supabase client failed:", connectionError);

          // Try direct API access as fallback
          console.log("Trying direct API access...");
          const directResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?select=id&limit=1`,
            {
              headers: {
                apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
            },
          );

          if (!directResponse.ok) {
            const errorText = await directResponse.text();
            throw new Error(
              `Direct API failed (${directResponse.status}): ${errorText}`,
            );
          }

          console.log(
            "Direct API access successful, but Supabase client has issues",
          );
        }
      } catch (fetchError: any) {
        console.error(
          "Both Supabase client and direct API failed:",
          fetchError,
        );
        throw new Error(`Connection completely failed: ${fetchError.message}`);
      }

      console.log("Supabase connection successful");

      // Use existing database schema: messages -> chats -> design_requests
      // First, find the chat for this project
      console.log("Looking for chat with project ID:", projectId);
      console.log("Current user:", user);

      try {
        const { data: chatsData, error: chatsError } = await supabase
          .from("chats")
          .select("id")
          .eq("request_id", projectId)
          .limit(1);

        if (chatsError) {
          console.error("Chats query failed:", chatsError);
          console.log("Trying direct API for chats...");

          // Try direct API call as fallback
          const directResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/chats?request_id=eq.${projectId}&select=id&limit=1`,
            {
              headers: {
                apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!directResponse.ok) {
            const errorText = await directResponse.text();
            throw new Error(
              `Both Supabase client and direct API failed for chats: ${errorText}`,
            );
          }

          const directData = await directResponse.json();
          console.log("Direct API success for chats:", directData);

          if (!directData || directData.length === 0) {
            console.log(
              "No chat found for project, will create one when sending message",
            );
            setMessages([]);
            return;
          }

          // Use direct API data and continue with messages
          const chatId = directData[0].id;
          console.log("Found chat via direct API:", chatId);
          await loadMessagesForChat(chatId);
          return;
        }

        if (!chatsData || chatsData.length === 0) {
          console.log(
            "No chat found for project, will create one when sending message",
          );
          setMessages([]);
          return;
        }

        const chatId = chatsData[0].id;
        console.log("Found chat:", chatId);
        await loadMessagesForChat(chatId);
      } catch (fetchError: any) {
        console.error("Complete failure finding chat:", fetchError);
        throw new Error(
          `Failed to find chat for project: ${fetchError.message}`,
        );
      }

      // Helper function to load messages for a specific chat
      const loadMessagesForChat = async (chatId: string) => {
        console.log("Loading messages for chat:", chatId);

        try {
          const { data: messagesData, error: messagesError } = await supabase
            .from("messages")
            .select(
              `
            id,
            chat_id,
            sender_id,
            text,
            created_at,
            sender:users!sender_id(id, name, email, role, avatar_url)
          `,
            )
            .eq("chat_id", chatId)
            .order("created_at", { ascending: true });

          if (messagesError) {
            console.error("Messages query failed:", messagesError);

            // Try direct API for messages
            const directResponse = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/messages?chat_id=eq.${chatId}&select=id,chat_id,sender_id,text,created_at&order=created_at.asc`,
              {
                headers: {
                  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                  "Content-Type": "application/json",
                },
              },
            );

            if (!directResponse.ok) {
              const errorText = await directResponse.text();
              throw new Error(
                `Failed to load messages via direct API: ${errorText}`,
              );
            }

            const directMessages = await directResponse.json();
            console.log("Loaded messages via direct API:", directMessages);
            setMessages(directMessages || []);
            return;
          }

          console.log("Loaded messages via Supabase client:", messagesData);
          setMessages(messagesData || []);
        } catch (error: any) {
          console.error("Failed to load messages for chat:", error);
          throw new Error(`Failed to load messages: ${error.message}`);
        }
      };
    } catch (err: any) {
      console.error("Failed to load messages - Full error:", err);
      console.error("Error name:", err?.name);
      console.error("Error message:", err?.message);
      console.error("Network status:", navigator.onLine);

      let errorMessage = "Failed to load messages";

      // Handle network/connection errors specifically
      if (
        err?.name === "TypeError" &&
        err?.message?.includes("Failed to fetch")
      ) {
        errorMessage =
          "Network connection failed. Please check:\n" +
          "• Your internet connection\n" +
          "• Supabase server status\n" +
          "• If your Supabase URL is correct";
      } else if (err?.message?.includes("Invalid API key")) {
        errorMessage =
          "Invalid Supabase API key. Please check your configuration.";
      } else if (err?.message?.includes("Connection failed")) {
        errorMessage = err.message;
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      } else if (err instanceof Error) {
        errorMessage = `Connection error: ${err.message}`;
      } else if (err?.message) {
        errorMessage = `Load error: ${err.message}`;
      } else if (err?.details) {
        errorMessage = `Database error: ${err.details}`;
      } else if (err?.code) {
        errorMessage = `Error ${err.code}: ${err.message || err.details || "Unknown database issue"}`;
      } else {
        // Fallback for unknown errors
        console.error(
          "Unknown error structure:",
          JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
        );
        errorMessage =
          "Unexpected connection error. Check console for details.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Send a message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!projectId || !user || !message.trim() || !isSupabaseConfigured) {
        return false;
      }

      try {
        // First, get or create the chat for this project
        let { data: chatsData, error: chatsError } = await supabase
          .from("chats")
          .select("id")
          .eq("request_id", projectId)
          .limit(1);

        if (chatsError) {
          throw new Error(`Failed to find chat: ${chatsError.message}`);
        }

        let chatId: string;

        if (!chatsData || chatsData.length === 0) {
          // Create a new chat for this project
          const { data: newChatData, error: createChatError } = await supabase
            .from("chats")
            .insert([
              {
                request_id: projectId,
                created_by: user.id,
              },
            ])
            .select()
            .single();

          if (createChatError) {
            throw new Error(
              `Failed to create chat: ${createChatError.message}`,
            );
          }

          chatId = newChatData.id;
        } else {
          chatId = chatsData[0].id;
        }

        // Now send the message
        const messageData = {
          chat_id: chatId,
          sender_id: user.id,
          text: message.trim(),
        };

        console.log("Attempting to insert message:", messageData);
        console.log("Target chat ID:", chatId);
        console.log("User ID:", user.id);

        const { error } = await supabase.from("messages").insert([messageData]);

        if (error) {
          throw error;
        }

        return true;
      } catch (err: any) {
        console.error("Failed to send message - Full error:", err);
        console.error("Error type:", typeof err);
        console.error("Error properties:", Object.keys(err || {}));

        // Extract meaningful error information
        let errorMessage = "Failed to send message";

        if (err?.message) {
          errorMessage = `Send error: ${err.message}`;

          // Check for specific database issues
          if (err.message.includes('relation "messages" does not exist')) {
            errorMessage = "Messages table doesn't exist in database";
          } else if (
            err.message.includes("column") &&
            err.message.includes("does not exist")
          ) {
            errorMessage = `Database column error: ${err.message}`;
          } else if (
            err.message.includes("permission denied") ||
            err.message.includes("row-level security")
          ) {
            errorMessage =
              "Permission denied - you may not have access to send messages";
          } else if (err.message.includes("foreign key")) {
            errorMessage = "Invalid reference - chat or user not found";
          }
        } else if (err?.details) {
          errorMessage = `Send error: ${err.details}`;
        } else if (err?.hint) {
          errorMessage = `Send error: ${err.hint}`;
        } else if (err?.code) {
          errorMessage = `Database error ${err.code}: ${err.message || err.details || "Unknown issue"}`;
        } else {
          // Log full error for debugging
          console.error(
            "Unhandled error structure:",
            JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
          );
          errorMessage = `Unexpected error: ${JSON.stringify(err).substring(0, 100)}...`;
        }

        setError(errorMessage);
        return false;
      }
    },
    [projectId, user],
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!projectId || !isSupabaseConfigured) {
      return;
    }

    // Load initial messages
    loadMessages();

    // For real-time, we need to subscribe to messages table and filter by chat_id
    // Since we can't easily filter by project through chats, we'll subscribe to all messages
    // and filter client-side (not ideal but works for now)
    const channel = supabase
      .channel(`project-${projectId}-messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          console.log("New message received:", payload);

          // Check if this message belongs to our project's chat
          const { data: chatData } = await supabase
            .from("chats")
            .select("request_id")
            .eq("id", payload.new.chat_id)
            .single();

          if (chatData?.request_id !== projectId) {
            return; // Not for our project
          }

          // Get sender info
          const { data: sender } = await supabase
            .from("users")
            .select("id, name, email, role, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          const newMessage: ChatMessage = {
            ...payload.new,
            sender: sender || {
              id: payload.new.sender_id,
              name: "Unknown User",
              email: "",
              role: "user",
            },
          };

          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((msg) => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, loadMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: loadMessages,
  };
};

// Hook for getting all chat rooms (for admin dashboard)
export const useRealtimeChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadChatRooms = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      return;
    }

    try {
      setLoading(true);

      // Get all projects with their latest messages
      const { data: projects } = await supabase
        .from("design_requests")
        .select(
          `
          id,
          title,
          user_id,
          designer_id,
          client:users!user_id(id, name, email),
          designer:users!designer_id(id, name, email)
        `,
        )
        .order("updated_at", { ascending: false });

      if (!projects) {
        setChatRooms([]);
        return;
      }

      // Get latest message for each project
      const chatRoomsData = await Promise.all(
        projects.map(async (project) => {
          const { data: latestMessage } = await supabase
            .from("messages")
            .select(
              `
              *,
              sender:users!sender_id(id, name, email, role)
            `,
            )
            .eq("project_id", project.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Count unread messages (for the current user)
          const { count: unreadCount } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("project_id", project.id)
            .neq("sender_id", user.id)
            .gt("created_at", user.last_seen || "1970-01-01");

          return {
            project_id: project.id,
            project_title: project.title,
            client_id: project.user_id,
            client_name: project.client?.name || "Unknown Client",
            designer_id: project.designer_id,
            designer_name: project.designer?.name,
            last_message: latestMessage,
            unread_count: unreadCount || 0,
          };
        }),
      );

      // Filter to only show rooms with messages or where user is involved
      const relevantRooms = chatRoomsData.filter(
        (room) =>
          room.last_message ||
          room.client_id === user.id ||
          room.designer_id === user.id ||
          user.role === "admin" ||
          user.role === "super-admin",
      );

      setChatRooms(relevantRooms);
    } catch (err: any) {
      console.error("Failed to load chat rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Subscribe to message changes to update chat rooms
  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      return;
    }

    loadChatRooms();

    // Subscribe to all message changes to update room list
    const channel = supabase
      .channel("chat-rooms-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          // Refresh chat rooms when any message changes
          loadChatRooms();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadChatRooms]);

  return {
    chatRooms,
    loading,
    refreshChatRooms: loadChatRooms,
  };
};

// Hook for getting unread message count
export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      return;
    }

    const getUnreadCount = async () => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .neq("sender_id", user.id)
        .gt("created_at", user.last_seen || "1970-01-01");

      setUnreadCount(count || 0);
    };

    getUnreadCount();

    // Subscribe to new messages to update count
    const channel = supabase
      .channel("unread-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          getUnreadCount();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return unreadCount;
};
