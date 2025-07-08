import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllChatsForAdmin, getMessages, respondToChat } from "@/lib/api";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        const chatsData = await getAllChatsForAdmin();
        setChats(chatsData);
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

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
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            CHAT HUB
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Unified communication center for all projects
          </p>
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
            placeholder="Search conversations..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
        <Button variant="outline" className="border-4 border-black">
          <Filter className="w-4 h-4 mr-2" />
          Filters
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
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-3 bg-festival-cream border-2 border-black cursor-pointer hover:bg-festival-orange/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-sm text-black line-clamp-1">
                      {chat.projectTitle}
                    </h4>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-festival-orange text-black border-2 border-black">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3 h-3" />
                      <span className="text-black/70">{chat.clientName}</span>
                    </div>
                    <p className="text-xs text-black/60 line-clamp-2">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-black/50">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(chat.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white h-96 flex flex-col">
            <div className="p-4 border-b-4 border-black">
              <h3 className="font-bold text-black">
                Select a conversation to start chatting
              </h3>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-black/30 mx-auto mb-4" />
                <p className="text-black/50">
                  Choose a conversation from the list to view messages
                </p>
              </div>
            </div>
            <div className="p-4 border-t-4 border-black">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  className="flex-1 border-4 border-black"
                  disabled
                />
                <Button disabled className="border-4 border-black">
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
