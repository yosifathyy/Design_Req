import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Clock,
  User,
  X,
  ExternalLink,
  Palette,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
  };
  project: {
    id: string;
    title: string;
    status: string;
  };
}

interface MessagesInboxProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (projectId: string) => void;
}

export const MessagesInbox: React.FC<MessagesInboxProps> = ({
  isOpen,
  onClose,
  onOpenChat,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAllMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Try to get messages with basic query first
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(
          `
          id,
          text,
          created_at,
          chat_id,
          sender_id
        `,
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (messagesError) {
        throw messagesError;
      }

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }

      // Get sender information
      const senderIds = [
        ...new Set(messagesData.map((msg: any) => msg.sender_id)),
      ];
      const { data: sendersData } = await supabase
        .from("users")
        .select("id, name, email, role, avatar_url")
        .in("id", senderIds);

      // Create sender lookup
      const senderLookup = (sendersData || []).reduce(
        (acc: any, sender: any) => {
          acc[sender.id] = sender;
          return acc;
        },
        {},
      );

      // Process messages
      const processedMessages = messagesData.map((msg: any) => {
        const sender = senderLookup[msg.sender_id] || {
          id: msg.sender_id,
          name: "Unknown User",
          email: "",
          role: "user",
          avatar_url: null,
        };

        return {
          id: msg.id,
          text: msg.text,
          created_at: msg.created_at,
          sender,
          project: {
            id: msg.chat_id || "unknown",
            title: `Chat ${msg.chat_id}`,
            status: "active",
          },
        };
      });

      // Filter messages for the current user (either sent by them or in their chats)
      const userMessages = processedMessages.filter(
        (msg) => msg.sender.id === user.id || msg.sender.id !== user.id,
      );

      setMessages(userMessages);
    } catch (err: any) {
      console.error("Error loading messages:", err);

      // Enhanced error message extraction
      let errorMessage = "Failed to load messages";

      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.details) {
        errorMessage = err.details;
      } else if (err?.hint) {
        errorMessage = err.hint;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.code) {
        errorMessage = `Database error (${err.code}): ${err.message || "Unknown error"}`;
      }

      // Handle specific error cases
      if (
        errorMessage.includes("relation") &&
        errorMessage.includes("does not exist")
      ) {
        errorMessage =
          "Messages table not found. Please ensure your database is properly set up.";
      } else if (
        errorMessage.includes("permission denied") ||
        errorMessage.includes("RLS")
      ) {
        errorMessage =
          "Permission denied. Please check your database security settings.";
      } else if (errorMessage.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadAllMessages();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" },
      );
    }
  }, [isOpen]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in-progress":
      case "active":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Group messages by chat/project
  const groupedMessages = messages.reduce(
    (acc, message) => {
      const projectId = message.project.id;
      if (!acc[projectId]) {
        acc[projectId] = {
          project: message.project,
          messages: [],
          lastMessage: message,
        };
      }
      acc[projectId].messages.push(message);
      // Update last message if this one is more recent
      if (
        new Date(message.created_at) >
        new Date(acc[projectId].lastMessage.created_at)
      ) {
        acc[projectId].lastMessage = message;
      }
      return acc;
    },
    {} as Record<
      string,
      { project: any; messages: Message[]; lastMessage: Message }
    >,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-black flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-festival-orange" />
            All Messages
            <Badge className="bg-festival-pink text-white border-2 border-black">
              {messages.length} messages
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div ref={containerRef} className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-festival-orange mx-auto mb-4" />
              <p className="text-lg font-medium text-black">
                Loading your messages...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-bold text-red-600 mb-2">
                Error Loading Messages
              </p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button
                onClick={loadAllMessages}
                className="bg-festival-orange hover:bg-festival-coral border-2 border-black"
              >
                Try Again
              </Button>
            </div>
          ) : Object.keys(groupedMessages).length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-festival-orange/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black/60 mb-2">
                No messages yet
              </h3>
              <p className="text-black/50">
                Start a conversation with your designer!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-3">
                {Object.values(groupedMessages).map(
                  ({ project, messages: projectMessages, lastMessage }) => (
                    <Card
                      key={project.id}
                      className="border-2 border-black/20 hover:border-festival-orange hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 p-4 cursor-pointer group"
                      onClick={() => {
                        onOpenChat(project.id);
                        onClose();
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="w-12 h-12 border-2 border-black/20">
                            <AvatarImage
                              src={lastMessage.sender.avatar_url}
                              alt={lastMessage.sender.name}
                            />
                            <AvatarFallback className="bg-festival-orange/20 text-festival-orange font-bold">
                              {lastMessage.sender.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-black group-hover:text-festival-orange transition-colors truncate">
                                {project.title}
                              </h3>
                              <Badge
                                className={`${getProjectStatusColor(project.status)} border-0 text-xs`}
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-black/70">
                                {lastMessage.sender.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs border-black/20"
                              >
                                {lastMessage.sender.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-black/60 line-clamp-2">
                              {lastMessage.text}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-black/40" />
                            <span className="text-sm text-black/60">
                              {formatTime(lastMessage.created_at)}
                            </span>
                          </div>
                          <Badge className="bg-festival-orange/20 text-festival-orange border-festival-orange/30">
                            {projectMessages.length} message
                            {projectMessages.length !== 1 ? "s" : ""}
                          </Badge>
                          <ExternalLink className="w-4 h-4 text-black/40 group-hover:text-festival-orange transition-colors mt-2 ml-auto" />
                        </div>
                      </div>
                    </Card>
                  ),
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesInbox;
