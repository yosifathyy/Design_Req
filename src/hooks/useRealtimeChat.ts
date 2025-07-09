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

// Simplified chat system using existing database schema: messages -> chats -> design_requests
export const useRealtimeChat = (projectId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load messages for a project
  const loadMessages = useCallback(async () => {
    if (!projectId || !isSupabaseConfigured) {
      setMessages([]);
      setLoading(false);
      return;
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
          const errorMessage =
            messagesError?.message ||
            messagesError?.details ||
            messagesError?.hint ||
            (typeof messagesError === "string"
              ? messagesError
              : JSON.stringify(
                  messagesError,
                  Object.getOwnPropertyNames(messagesError),
                ));
          console.error("Messages query failed:", errorMessage);

          // If it's a network error, try simplified query
          if (
            errorMessage.includes("Failed to fetch") ||
            errorMessage.includes("NetworkError")
          ) {
            console.log("Network error detected, trying simplified query...");

            const { data: simpleMessages, error: simpleError } = await supabase
              .from("messages")
              .select("id, chat_id, sender_id, text, created_at")
              .eq("chat_id", chatId)
              .order("created_at", { ascending: true });

            if (!simpleError && simpleMessages) {
              console.log("✅ Simplified query worked:", simpleMessages);
              setMessages(simpleMessages || []);
              return;
            }
          }

          throw new Error(`Failed to load messages: ${errorMessage}`);
        }

        console.log("Loaded messages via Supabase client:", messagesData);
        setMessages(messagesData || []);

        // TODO: Mark this chat as read when messages are loaded
        // Mark this chat as read when messages are loaded
        if (user && chatId) {
          try {
            // Use the Supabase function to mark chat as read
            const { error } = await supabase.rpc("mark_chat_as_read", {
              p_chat_id: chatId,
              p_user_id: user.id,
            });

            if (error) {
              console.error(`Error marking chat ${chatId} as read:`, error);
              // Fallback to direct update if function doesn't exist
              await supabase
                .from("chat_participants")
                .update({ last_read_at: new Date().toISOString() })
                .eq("chat_id", chatId)
                .eq("user_id", user.id);
            }

            console.log("✅ Marked chat as read:", chatId);
          } catch (error) {
            console.error("Error marking chat as read:", error);
          }
        }
      } catch (error: any) {
        console.error("Failed to load messages for chat:", error);
        setMessages([]);
        throw new Error(`Failed to load messages: ${error.message}`);
      }
    };

    try {
      setLoading(true);
      setError(null);

      // Test Supabase connection first
      if (!isSupabaseConfigured) {
        throw new Error(
          "Supabase is not configured. Please check your environment variables.",
        );
      }

      console.log("Testing Supabase connection...");

      try {
        const { data: connectionTest, error: connectionError } = await supabase
          .from("users")
          .select("id")
          .limit(1);

        if (connectionError) {
          const errorMessage =
            connectionError?.message ||
            connectionError?.details ||
            connectionError?.hint ||
            (typeof connectionError === "string"
              ? connectionError
              : JSON.stringify(
                  connectionError,
                  Object.getOwnPropertyNames(connectionError),
                ));
          console.error("Supabase client failed:", errorMessage);

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
          throw new Error(
            `Failed to find chat for project: ${chatsError.message}`,
          );
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
  }, [projectId, user]);

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
                created_at: new Date().toISOString(),
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

        const { data: insertedMessage, error } = await supabase
          .from("messages")
          .insert([messageData])
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
          .single();

        if (error) {
          throw error;
        }

        // Immediately add the message to local state for instant feedback
        if (insertedMessage) {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((msg) => msg.id === insertedMessage.id)) {
              return prev;
            }
            return [...prev, insertedMessage].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
            );
          });
        }

        return true;
      } catch (err: any) {
        console.error("Failed to send message - Full error:", err);
        console.error("Error type:", typeof err);
        console.error("Error properties:", Object.keys(err || {}));

        // Log each property separately for debugging
        console.error("Error.code:", err?.code);
        console.error("Error.message:", err?.message);
        console.error("Error.details:", err?.details);
        console.error("Error.hint:", err?.hint);

        // Extract meaningful error information with better property checking
        let errorMessage = "Failed to send message";

        // First check for the most specific error information
        if (err?.message && typeof err.message === "string") {
          errorMessage = err.message;

          // Check for specific database issues
          if (err.message.includes('relation "messages" does not exist')) {
            errorMessage =
              "❌ Messages table doesn't exist in database. Please set up database tables.";
          } else if (err.message.includes('relation "chats" does not exist')) {
            errorMessage =
              "❌ Chats table doesn't exist in database. Please set up database tables.";
          } else if (
            err.message.includes("column") &&
            err.message.includes("does not exist")
          ) {
            errorMessage = `❌ Database schema error: ${err.message}`;
          } else if (
            err.message.includes("permission denied") ||
            err.message.includes("row-level security") ||
            err.message.includes("RLS")
          ) {
            errorMessage =
              "❌ Permission denied - Row Level Security is blocking access. Please disable RLS.";
          } else if (err.message.includes("foreign key")) {
            // Check if it's specifically a user foreign key issue
            if (
              err.message.includes("sender_id") &&
              err.message.includes("users")
            ) {
              // Attempt automatic user creation
              console.log("Attempting automatic user creation...");
              try {
                // First check if user exists by email
                const { data: existingUser, error: checkError } = await supabase
                  .from("users")
                  .select("*")
                  .eq("email", user.email)
                  .single();

                if (existingUser && !checkError) {
                  console.log(
                    "User exists with different ID, deleting old record...",
                  );

                  // Try to delete the old record first
                  const { error: deleteError } = await supabase
                    .from("users")
                    .delete()
                    .eq("email", user.email);

                  if (deleteError) {
                    console.error(
                      "Could not delete existing user record:",
                      deleteError,
                    );
                    throw new Error(
                      `Could not delete existing user: ${deleteError.message}`,
                    );
                  }
                  console.log("Old user record deleted successfully");
                }

                const userData = {
                  id: user.id,
                  email: user.email,
                  name:
                    user.user_metadata?.name ||
                    user.email?.split("@")[0] ||
                    "User",
                  role: user.email === "admin@demo.com" ? "admin" : "user",
                  status: "active",
                  xp: 0,
                  level: 1,
                  avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                  created_at: new Date().toISOString(),
                  last_login: new Date().toISOString(),
                };

                const { error: createError } = await supabase
                  .from("users")
                  .insert([userData]);

                if (createError) {
                  const errorDetails = {
                    message: createError.message,
                    details: createError.details,
                    hint: createError.hint,
                    code: createError.code,
                  };
                  console.error(
                    "Auto-creation failed in message send:",
                    errorDetails,
                  );
                  console.error(
                    "Full message auto-create error:",
                    JSON.stringify(
                      createError,
                      Object.getOwnPropertyNames(createError),
                      2,
                    ),
                  );
                } else {
                  console.log(
                    "User record created automatically, retrying message...",
                  );
                  // Retry sending the message
                  const { data: retryMessage, error: retryError } =
                    await supabase
                      .from("messages")
                      .insert([
                        {
                          chat_id: chatId,
                          sender_id: user.id,
                          text: message.trim(),
                        },
                      ])
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
                      .single();

                  if (!retryError && retryMessage) {
                    console.log(
                      "Message sent successfully after user creation",
                    );
                    setMessages((prev) => {
                      if (prev.some((msg) => msg.id === retryMessage.id)) {
                        return prev;
                      }
                      return [...prev, retryMessage].sort(
                        (a, b) =>
                          new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime(),
                      );
                    });
                    return true; // Exit early on success
                  }
                }
              } catch (autoCreateError: any) {
                const errorDetails = {
                  message: autoCreateError?.message,
                  details: autoCreateError?.details,
                  hint: autoCreateError?.hint,
                  code: autoCreateError?.code,
                };
                console.error(
                  "Automatic user creation exception:",
                  errorDetails,
                );
                console.error(
                  "Full auto-create exception:",
                  JSON.stringify(
                    autoCreateError,
                    Object.getOwnPropertyNames(autoCreateError),
                    2,
                  ),
                );
              }

              errorMessage =
                "❌ User account mismatch - Attempted auto-fix. If this persists, use the 'Fix User Record' button.";
            } else {
              errorMessage =
                "❌ Invalid reference - chat or user not found. Check project/user IDs.";
            }
          } else if (err.message.includes("violates not-null constraint")) {
            errorMessage =
              "❌ Missing required field - check that all message data is provided.";
          } else {
            errorMessage = `❌ Database error: ${err.message}`;
          }
        } else if (err?.details && typeof err.details === "string") {
          errorMessage = `❌ Database details: ${err.details}`;
        } else if (err?.hint && typeof err.hint === "string") {
          errorMessage = `❌ Database hint: ${err.hint}`;
        } else if (err?.code) {
          // Handle PostgreSQL error codes
          let codeDescription = "";
          switch (err.code) {
            case "42P01":
              codeDescription = "Table does not exist";
              break;
            case "42703":
              codeDescription = "Column does not exist";
              break;
            case "23503":
              // Check if it's a user foreign key violation
              if (
                err.details?.includes("sender_id") &&
                err.details?.includes("users")
              ) {
                codeDescription =
                  "User account mismatch - Fix your user record";
              } else {
                codeDescription = "Foreign key violation";
              }
              break;
            case "23502":
              codeDescription = "Not null violation";
              break;
            case "42501":
              codeDescription = "Insufficient privilege";
              break;
            default:
              codeDescription = "Database error";
          }
          errorMessage = `❌ ${codeDescription} (${err.code}): ${err.message || err.details || "Unknown issue"}`;
        } else {
          // Last resort - try to extract any useful information
          console.error(
            "Unhandled error structure:",
            JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
          );

          // Try to get any string representation
          let errorStr = "";
          if (err && typeof err === "object") {
            errorStr = err.toString();
            if (errorStr === "[object Object]") {
              // If toString doesn't help, try to extract any property that's a string
              const stringProps = Object.entries(err).filter(
                ([key, value]) => typeof value === "string" && value.length > 0,
              );
              if (stringProps.length > 0) {
                errorStr = stringProps
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ");
              } else {
                errorStr = JSON.stringify(err, null, 2);
              }
            }
          } else {
            errorStr = String(err);
          }

          errorMessage = `❌ Unexpected error: ${errorStr.substring(0, 200)}${errorStr.length > 200 ? "..." : ""}`;
        }

        console.error("Final error message:", errorMessage);
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

    // Set up real-time subscription for messages
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
          console.log("Real-time message received:", payload);

          try {
            // Get the complete message with sender info
            const { data: fullMessage, error } = await supabase
              .from("messages")
              .select(
                `
                *,
                sender:users!sender_id(id, name, email, role, avatar_url)
              `,
              )
              .eq("id", payload.new.id)
              .single();

            if (error || !fullMessage) {
              console.error("Failed to get full message:", error);
              return;
            }

            // Check if this message belongs to our project
            const { data: chatData } = await supabase
              .from("chats")
              .select("request_id")
              .eq("id", fullMessage.chat_id)
              .single();

            if (chatData?.request_id !== projectId) {
              return; // Not for our project
            }

            // Add to local state
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((msg) => msg.id === fullMessage.id)) {
                return prev;
              }
              return [...prev, fullMessage].sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime(),
              );
            });
          } catch (error) {
            console.error("Error processing real-time message:", error);
          }
        },
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
      });

    return () => {
      console.log("Cleaning up real-time subscription");
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
      setChatRooms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(
        "Loading chat rooms for user:",
        user.email,
        "role:",
        user.role,
      );

      // Check if user is admin
      const isAdmin =
        user.role === "admin" ||
        user.role === "super-admin" ||
        user.email === "admin@demo.com";

      if (!isAdmin) {
        console.log("User is not admin, returning empty chat rooms");
        setChatRooms([]);
        setLoading(false);
        return;
      }

      console.log("User is admin, fetching all projects...");

      // Get all projects (admin can see all)
      const { data: projects, error: projectsError } = await supabase
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

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        setChatRooms([]);
        setLoading(false);
        return;
      }

      if (!projects || projects.length === 0) {
        console.log("No projects found");
        setChatRooms([]);
        setLoading(false);
        return;
      }

      console.log("Found projects:", projects.length);

      // For each project, get the associated chat and latest message
      const chatRoomsData = await Promise.all(
        projects.map(async (project) => {
          try {
            // First, find the chat for this project
            const { data: chats } = await supabase
              .from("chats")
              .select("id")
              .eq("request_id", project.id);

            let latestMessage = null;
            let unreadCount = 0;

            if (chats && chats.length > 0) {
              const chatId = chats[0].id;

              // Get latest message for this chat
              const { data: messageData } = await supabase
                .from("messages")
                .select(
                  `
                  *,
                  sender:users!sender_id(id, name, email, role)
                `,
                )
                .eq("chat_id", chatId)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

              latestMessage = messageData;

              // Count total messages in this chat (admin sees all as "unread" for overview)
              const { count } = await supabase
                .from("messages")
                .select("*", { count: "exact", head: true })
                .eq("chat_id", chatId);

              unreadCount = count || 0;
            }

            return {
              project_id: project.id,
              project_title: project.title || "Untitled Project",
              client_id: project.user_id,
              client_name: project.client?.name || "Unknown Client",
              designer_id: project.designer_id,
              designer_name: project.designer?.name || null,
              last_message: latestMessage,
              unread_count: unreadCount,
            } as ChatRoom;
          } catch (error) {
            console.error("Error processing project:", project.id, error);
            return {
              project_id: project.id,
              project_title: project.title || "Untitled Project",
              client_id: project.user_id,
              client_name: project.client?.name || "Unknown Client",
              designer_id: project.designer_id,
              designer_name: project.designer?.name || null,
              last_message: null,
              unread_count: 0,
            } as ChatRoom;
          }
        }),
      );

      console.log("Processed chat rooms:", chatRoomsData.length);
      setChatRooms(chatRoomsData.filter(Boolean));
    } catch (error: any) {
      console.error("Failed to load chat rooms:", error);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshChatRooms = () => {
    loadChatRooms();
  };

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  return {
    chatRooms,
    loading,
    refreshChatRooms,
  };
};

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Function to manually refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setUnreadCount(0);
      return;
    }

    console.log("🔄 Manually refreshing unread count...");

    try {
      const { data: userChats, error: chatsError } = await supabase
        .from("chat_participants")
        .select("chat_id, last_read_at")
        .eq("user_id", user.id);

      if (chatsError) {
        const errorMessage =
          chatsError?.message ||
          chatsError?.details ||
          chatsError?.hint ||
          JSON.stringify(chatsError);
        console.error("Error fetching user chats:", errorMessage);
        setUnreadCount(0);
        return;
      }

      if (!userChats || userChats.length === 0) {
        setUnreadCount(0);
        return;
      }

      let totalUnread = 0;
      for (const chat of userChats) {
        try {
          const lastReadAt = chat.last_read_at || "1970-01-01T00:00:00Z";

          const { count, error: messagesError } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("chat_id", chat.chat_id)
            .neq("sender_id", user.id)
            .gt("created_at", lastReadAt);

          if (messagesError) {
            const errorMessage =
              messagesError?.message ||
              messagesError?.details ||
              messagesError?.hint ||
              JSON.stringify(messagesError);

            // Handle specific network errors
            if (
              errorMessage.includes("Failed to fetch") ||
              errorMessage.includes("TypeError: Failed to fetch")
            ) {
              console.warn(
                `Network error in manual refresh for chat ${chat.chat_id}, skipping this chat`,
              );
              continue;
            }

            console.error(
              `Error in manual refresh for chat ${chat.chat_id}:`,
              errorMessage,
            );
            continue;
          }

          totalUnread += count || 0;
        } catch (fetchError: any) {
          // Handle any uncaught fetch/network errors at the individual chat level
          if (
            fetchError?.name === "TypeError" &&
            fetchError?.message?.includes("Failed to fetch")
          ) {
            console.warn(
              `Network connection failed for chat ${chat.chat_id} during manual refresh, skipping. Error: ${fetchError.message}`,
            );
          } else {
            console.error(
              `Unexpected error in manual refresh for chat ${chat.chat_id}:`,
              fetchError?.message || fetchError,
            );
          }
          continue;
        }
      }

      setUnreadCount(totalUnread);
    } catch (error: any) {
      console.error("Error refreshing unread count:", error);
      setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured, setting unread count to 0");
      setUnreadCount(0);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        console.log("🔄 Loading unread count for user:", user.id);

        // Get all chats the user is involved in via chat_participants with last_read_at
        const { data: userChats, error: chatsError } = await supabase
          .from("chat_participants")
          .select("chat_id, last_read_at")
          .eq("user_id", user.id);

        if (chatsError) {
          const errorMessage =
            chatsError?.message ||
            chatsError?.details ||
            chatsError?.hint ||
            JSON.stringify(chatsError);
          console.error("Error fetching user chats:", errorMessage);

          // If chat_participants table doesn't exist, try to get chats directly
          if (
            errorMessage.includes('relation "chat_participants" does not exist')
          ) {
            console.warn(
              "chat_participants table doesn't exist, trying direct chat lookup",
            );
            try {
              // Fallback: look for chats where the user might be involved
              const { data: fallbackChats, error: fallbackError } =
                await supabase.from("chats").select("id").limit(10); // Limit to avoid too many results

              if (!fallbackError && fallbackChats) {
                console.log(
                  "Using fallback chat lookup, found",
                  fallbackChats.length,
                  "chats",
                );
                // For fallback, we'll just count all messages not from the user
                const chatIds = fallbackChats.map((chat) => chat.id);
                if (chatIds.length > 0) {
                  const { count } = await supabase
                    .from("messages")
                    .select("*", { count: "exact", head: true })
                    .in("chat_id", chatIds)
                    .neq("sender_id", user.id);

                  setUnreadCount(count || 0);
                  return;
                }
              }
            } catch (fallbackError) {
              console.error("Fallback chat lookup also failed:", fallbackError);
            }
          }

          setUnreadCount(0);
          return;
        }

        console.log("👥 User chats found:", userChats?.length || 0);

        if (!userChats || userChats.length === 0) {
          console.log("📭 No chats found for user, setting unread count to 0");
          setUnreadCount(0);
          return;
        }

        let totalUnread = 0;

        // For each chat, count messages that are unread (created after last_read_at)
        for (const chat of userChats) {
          try {
            const lastReadAt = chat.last_read_at || "1970-01-01T00:00:00Z";

            const { count, error: messagesError } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("chat_id", chat.chat_id)
              .neq("sender_id", user.id) // Not from current user
              .gt("created_at", lastReadAt); // Created after last read

            if (messagesError) {
              const errorMessage =
                messagesError?.message ||
                messagesError?.details ||
                messagesError?.hint ||
                JSON.stringify(messagesError);

              // Handle specific network errors
              if (
                errorMessage.includes("Failed to fetch") ||
                errorMessage.includes("TypeError: Failed to fetch")
              ) {
                console.warn(
                  `Network error counting unread messages for chat ${chat.chat_id}, skipping this chat`,
                );
                continue;
              }

              console.error(
                `Error counting unread messages for chat ${chat.chat_id}:`,
                errorMessage,
              );
              continue;
            }

            console.log(
              `💬 Chat ${chat.chat_id}: ${count} unread messages (since ${lastReadAt})`,
            );
            totalUnread += count || 0;
          } catch (fetchError: any) {
            // Handle any uncaught fetch/network errors at the individual chat level
            if (
              fetchError?.name === "TypeError" &&
              fetchError?.message?.includes("Failed to fetch")
            ) {
              console.warn(
                `Network connection failed for chat ${chat.chat_id}, skipping. Error: ${fetchError.message}`,
              );
            } else {
              console.error(
                `Unexpected error counting unread messages for chat ${chat.chat_id}:`,
                fetchError?.message || fetchError,
              );
            }
            continue;
          }
        }

        console.log("📊 Total unread messages count:", totalUnread);
        setUnreadCount(totalUnread);
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.details ||
          error?.hint ||
          JSON.stringify(error);
        console.error("Failed to load unread count:", errorMessage);
        setUnreadCount(0);
      }
    };

    loadUnreadCount();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`unread-messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("🔔 New message received in unread counter:", payload);
          // Only update if the message is not from the current user
          if (payload.new && payload.new.sender_id !== user.id) {
            console.log(
              "📊 Updating unread count due to new message from:",
              payload.new.sender_id,
            );
            // Increment the count immediately for responsiveness
            setUnreadCount((prev) => prev + 1);
            // Also reload to ensure accuracy
            setTimeout(() => loadUnreadCount(), 500);
          } else {
            console.log(
              "👤 Message from current user, not updating unread count",
            );
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        () => {
          console.log("📝 Message updated, reloading unread count");
          loadUnreadCount();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
        },
        () => {
          console.log("🗑️ Message deleted, reloading unread count");
          loadUnreadCount();
        },
      )

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_participants",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log(
            "👁️ Chat participant updated (read status changed):",
            payload,
          );
          // When last_read_at is updated, reload the unread count
          if (
            payload.new &&
            payload.new.last_read_at !== payload.old?.last_read_at
          ) {
            console.log("📖 Messages marked as read, updating unread count");
            loadUnreadCount();
          }
        },
      )
      .subscribe((status) => {
        console.log("📡 Unread count subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to unread messages updates");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Error subscribing to unread messages updates");
        }
      });

    return () => {
      console.log("Cleaning up unread count subscription");
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { unreadCount, refreshUnreadCount };
};
