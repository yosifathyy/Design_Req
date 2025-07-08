import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getMessages } from "@/lib/api";

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
    avatar_url: string | null;
    role: string;
  };
}

export const useRealTimeChat = (chatId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const messagesData = await getMessages(chatId);
      setMessages(messagesData);
    } catch (err: any) {
      console.error("Failed to load messages:", err);
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!chatId || !isSupabaseConfigured) {
      return;
    }

    // Load initial messages
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          console.log("New message received:", payload);

          // Fetch sender information for the new message
          try {
            const { data: sender } = await supabase
              .from("users")
              .select("id, name, email, avatar_url, role")
              .eq("id", payload.new.sender_id)
              .single();

            const newMessage: ChatMessage = {
              ...payload.new,
              sender: sender || {
                id: payload.new.sender_id,
                name: "Unknown User",
                email: "",
                avatar_url: null,
                role: "user",
              },
            };

            setMessages((prev) => [...prev, newMessage]);
          } catch (error) {
            console.error("Failed to fetch sender info:", error);
            // Add message without sender info
            setMessages((prev) => [...prev, payload.new]);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log("Message updated:", payload);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log("Message deleted:", payload);
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.old.id),
          );
        },
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, loadMessages]);

  // Refresh messages manually
  const refreshMessages = useCallback(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    error,
    refreshMessages,
  };
};

// Hook for real-time chat list updates
export const useRealTimeChatList = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Set up real-time subscription for chat list
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const channel = supabase
      .channel("chat-list-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Chat list update triggered by message:", payload);
          setLastUpdate(new Date());
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        (payload) => {
          console.log("Chat list update triggered by chat change:", payload);
          setLastUpdate(new Date());
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    lastUpdate,
    triggerRefresh: () => setLastUpdate(new Date()),
  };
};
