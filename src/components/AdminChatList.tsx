
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllChatsForAdmin } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Clock, User, Circle, RefreshCw, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

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
    text?: string;
    content: string;
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "super-admin")) {
    return null;
  }

  return (
    <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 text-festival-orange" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">Client Communications</h3>
            <p className="text-sm text-white/80">Manage all client conversations</p>
          </div>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white"
            >
              {unreadCount} new
            </motion.div>
          )}
        </div>

        <Button
          onClick={loadChats}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-festival-orange"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg border-2 border-gray-300"
              />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h4 className="font-bold text-lg mb-2">No Active Chats</h4>
            <p className="text-sm mb-4">
              Client conversations will appear here once they start chatting
            </p>
            <Button
              onClick={() => window.location.href = "/admin/chat"}
              className="bg-festival-orange hover:bg-festival-coral text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Go to Chat Hub
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {chats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Link
                  to={`/admin/chat/${chat.request_id}`}
                  className="block"
                >
                  <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-festival-orange hover:bg-festival-cream/30 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] bg-white">
                    <div className="flex items-start gap-4">
                      {/* Client Avatar */}
                      <div className="flex-shrink-0">
                        {chat.request.user.avatar_url ? (
                          <img
                            src={chat.request.user.avatar_url}
                            alt={chat.request.user.name}
                            className="w-12 h-12 rounded-full border-2 border-black object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-festival-orange to-festival-coral border-2 border-black rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {chat.request.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Chat Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-black truncate text-lg">
                              {chat.request.user.name}
                            </h4>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(chat.request.status)}`}>
                              {chat.request.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(chat.last_message_at)}
                          </div>
                        </div>

                        {/* Project Title */}
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-festival-orange" />
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {chat.request.title}
                          </p>
                        </div>

                        {/* Last Message */}
                        {chat.last_message ? (
                          <p className="text-sm text-gray-600 truncate mb-2">
                            <span className="font-medium">Latest: </span>
                            {chat.last_message.content || chat.last_message.text || ""}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic mb-2">
                            No messages yet - waiting for client
                          </p>
                        )}

                        {/* Action Indicator */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">
                              Ready to respond
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-festival-orange transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {chats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-4 border-t-2 border-gray-200"
          >
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.href = "/admin/chat"}
                className="flex-1 bg-festival-orange hover:bg-festival-coral text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                View All Chats
              </Button>
              <Button
                onClick={loadChats}
                variant="outline"
                className="border-2 border-festival-orange text-festival-orange hover:bg-festival-orange hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default AdminChatList;
