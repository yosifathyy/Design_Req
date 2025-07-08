import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllChatsForAdmin } from "@/lib/api";
import { respondToChat } from "@/lib/admin-api";
import { useRealTimeChat, useRealTimeChatList } from "@/hooks/useRealTimeChat";
import {
  MessageCircle,
  Search,
  Filter,
  Clock,
  User,
  Send,
  RefreshCw,
} from "lucide-react";

const AdminChat: React.FC = () => {
  const navigate = useNavigate();
  const { id: chatId } = useParams<{ id?: string }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Real-time chat hooks
  const {
    messages,
    loading: loadingMessages,
    refreshMessages,
  } = useRealTimeChat(selectedChat?.id || null);
  const { lastUpdate, triggerRefresh } = useRealTimeChatList();

  // Load chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        const chatsData = await getAllChatsForAdmin();
        setChats(chatsData);

        // Auto-select chat if ID is provided in URL
        if (chatId && chatsData.length > 0) {
          // First try to find chat by ID
          let targetChat = chatsData.find((chat: any) => chat.id === chatId);

          // If not found, try to find by request_id (project ID)
          if (!targetChat) {
            targetChat = chatsData.find(
              (chat: any) => chat.request_id === chatId,
            );
          }

          if (targetChat) {
            setSelectedChat(targetChat);
          }
        }
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [chatId]);

  // Load messages for selected chat
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) {
        setMessages([]);
        return;
      }

      try {
        setLoadingMessages(true);
        const messagesData = await getMessages(selectedChat.id);
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await respondToChat(selectedChat.id, newMessage, "current-admin-id");
      setNewMessage("");
      // Reload messages
      const updatedMessages = await getMessages(selectedChat.id);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.request?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.request?.user?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {chatId && (
            <Button
              onClick={() => navigate("/admin/chat")}
              variant="outline"
              className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              ← All Chats
            </Button>
          )}
          <div>
            <h1 className="text-4xl font-display font-bold text-black mb-2">
              {chatId && selectedChat
                ? `CHAT: ${selectedChat.request?.title || "Project Chat"}`
                : "CHAT HUB"}
            </h1>
            <p className="text-xl text-black/70 font-medium">
              {chatId && selectedChat
                ? `Client: ${selectedChat.request?.user?.name || "Unknown"}`
                : "Unified communication center for all projects"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate("/admin/chat/create")}
          className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-4 border-black"
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-4 border-b-4 border-black">
              <h3 className="font-bold text-black">Active Conversations</h3>
            </div>
            <div className="space-y-2 p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-festival-orange" />
                  <p className="text-sm text-black/70">Loading chats...</p>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-black/30" />
                  <p className="text-sm text-black/70">
                    {searchQuery
                      ? "No chats match your search"
                      : "No active chats"}
                  </p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      // Update URL to reflect selected chat
                      navigate(`/admin/chat/${chat.id}`, { replace: true });
                    }}
                    className={`p-3 border-2 border-black cursor-pointer hover:bg-festival-orange/20 transition-colors ${
                      selectedChat?.id === chat.id
                        ? "bg-festival-orange/30"
                        : "bg-festival-cream"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm text-black line-clamp-1">
                        {chat.request?.title || "Untitled Project"}
                      </h4>
                      {chat.unread_count > 0 && (
                        <Badge className="bg-festival-orange text-black border-2 border-black">
                          {chat.unread_count}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <User className="w-3 h-3" />
                        <span className="text-black/70">
                          {chat.request?.user?.name || "Unknown User"}
                        </span>
                      </div>
                      <p className="text-xs text-black/60 line-clamp-2">
                        {chat.last_message?.content || "No messages yet"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-black/50">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(
                            chat.last_message_at || chat.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white h-96 flex flex-col">
            <div className="p-4 border-b-4 border-black">
              <h3 className="font-bold text-black">
                {selectedChat
                  ? selectedChat.request?.title || "Chat"
                  : "Select a conversation to start chatting"}
              </h3>
              {selectedChat && (
                <p className="text-sm text-black/70">
                  Client: {selectedChat.request?.user?.name || "Unknown"}
                </p>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {!selectedChat ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-black/30 mx-auto mb-4" />
                    <p className="text-black/50">
                      Choose a conversation from the list to view messages
                    </p>
                  </div>
                </div>
              ) : loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-festival-orange" />
                    <p className="text-sm text-black/70">Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-black/30 mx-auto mb-2" />
                    <p className="text-black/50">No messages yet</p>
                    <p className="text-xs text-black/40">
                      Start the conversation below
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender?.role === "admin" ||
                        message.sender?.role === "super-admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded border-2 border-black ${
                          message.sender?.role === "admin" ||
                          message.sender?.role === "super-admin"
                            ? "bg-festival-orange text-black"
                            : "bg-white text-black"
                        }`}
                      >
                        <p className="text-sm">
                          {message.text || message.content}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {message.sender?.name || "Unknown"}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t-4 border-black">
              <div className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-4 border-black"
                  disabled={!selectedChat}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!selectedChat || !newMessage.trim()}
                  className="border-4 border-black bg-festival-orange hover:bg-festival-coral"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
