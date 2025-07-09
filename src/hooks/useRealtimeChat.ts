import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface ChatMessage {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
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

      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users!sender_id(id, name, email, role, avatar_url)
        `,
        )
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        throw messagesError;
      }

      setMessages(messagesData || []);
    } catch (err: any) {
      console.error("Failed to load messages:", err);

      // Better error message extraction
      let errorMessage = "Failed to load messages";
      try {
        if (typeof err === "string") {
          errorMessage = err;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.error_description) {
          errorMessage = err.error_description;
        } else if (err?.details) {
          errorMessage = err.details;
        } else if (err?.hint) {
          errorMessage = err.hint;
        } else if (err?.code) {
          errorMessage = `Database error (${err.code}): ${err.message || "Unknown error"}`;
        } else {
          // Check if it's a network error
          if (err?.status === 0 || !navigator.onLine) {
            errorMessage =
              "Network error: Please check your internet connection";
          } else {
            const errorStr = JSON.stringify(
              err,
              Object.getOwnPropertyNames(err),
            );
            errorMessage =
              errorStr.length > 100
                ? "Complex error occurred. Check console for details."
                : errorStr;
          }
        }
      } catch (stringifyError) {
        console.error("Error processing error message:", stringifyError);
        errorMessage = "Error occurred but could not be displayed";
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
        const { error } = await supabase.from("messages").insert([
          {
            project_id: projectId,
            sender_id: user.id,
            message: message.trim(),
          },
        ]);

        if (error) {
          throw error;
        }

        return true;
      } catch (err: any) {
        console.error("Failed to send message:", err);
        setError(err.message || "Failed to send message");
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

    // Subscribe to new messages for this project
    const channel = supabase
      .channel(`project-${projectId}-messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          console.log("New message received:", payload);

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
