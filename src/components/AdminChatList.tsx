import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllChatsForAdmin } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Clock, User, Circle, RefreshCw } from "lucide-react";

interface Chat {
  id: string;
  request_id: string;
  created_at: string;
  updated_at: string;
  request: {
    id: string;
    title: string;
    user_id: string;
    status: string;
    created_at: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar_url: string | null;
    };
  };
  last_message: {
    text: string;
    content?: string;
    created_at: string;
  } | null;
  last_message_at: string;
}

const AdminChatList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const loadChats = async () => {
    try {
      setLoading(true);
      const allChats = await getAllChatsForAdmin();
      setChats(allChats);

      // For now, assume all chats with recent messages are "unread"
      // You can enhance this by tracking read status per admin user
      const recentChats = allChats.filter(
        (chat) =>
          chat.last_message &&
          new Date(chat.last_message.created_at) >
            new Date(Date.now() - 24 * 60 * 60 * 1000),
      );
      setUnreadCount(recentChats.length);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "super-admin")) {
      loadChats();
    }
  }, [user]);

  // Subscribe to new messages for real-time updates
  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "super-admin")) return;

    const messageSubscription = supabase
      .channel("admin-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("New message for admin:", payload);
          // Reload chats to get updated last message
          loadChats();
        },
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
  }, [user]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  if (!user || (user.role !== "admin" && user.role !== "super-admin")) {
    return null;
  }

  return (
    <Card className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-festival-pink rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-black">Client Chats</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <Button
          onClick={loadChats}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-2 border-black"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 animate-pulse rounded border-2 border-gray-300"
            />
          ))}
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="font-medium">No active chats yet</p>
          <p className="text-sm">
            Chats will appear here when clients start conversations
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat?request=${chat.request_id}`}
              className="block"
            >
              <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-festival-pink hover:bg-festival-cream/20 transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {chat.request.user.avatar_url ? (
                      <img
                        src={chat.request.user.avatar_url}
                        alt={chat.request.user.name}
                        className="w-10 h-10 rounded-full border-2 border-black object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {chat.request.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-black truncate">
                        {chat.request.user.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(chat.last_message_at)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-1 font-medium">
                      {chat.request.title}
                    </p>

                    {chat.last_message ? (
                      <p className="text-sm text-gray-600 truncate">
                        {chat.last_message.content || chat.last_message.text}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No messages yet
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-1">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      {chat.request.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AdminChatList;
