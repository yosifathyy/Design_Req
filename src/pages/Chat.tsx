import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { getDesignRequestById } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Send,
  ArrowLeft,
  Circle,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get project ID from URL query params
  const projectId = new URLSearchParams(location.search).get("request");

  // Use the new realtime chat hook
  const {
    messages,
    loading: messagesLoading,
    error,
    sendMessage: sendChatMessage,
  } = useRealtimeChat(projectId);

  // Load project details
  useEffect(() => {
    const loadProjectDetails = async () => {
      if (!projectId) return;

      try {
        setProjectLoading(true);
        const requestData = await getDesignRequestById(projectId);
        setProjectDetails(requestData);
      } catch (error: any) {
        console.error("Error loading project:", error);
      } finally {
        setProjectLoading(false);
      }
    };

    if (projectId) {
      loadProjectDetails();
    }
  }, [projectId]);

  // Animate new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messagesRef.current?.lastElementChild;
      if (lastMessage) {
        gsap.fromTo(
          lastMessage,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.2)",
          },
        );
      }
    }
  }, [messages.length]);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    // Animate messages on load
    if (messagesRef.current) {
      const messageElements = messagesRef.current.children;
      gsap.fromTo(
        messageElements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || ""))
      return <Image className="w-4 h-4" />;
    if (["mp4", "avi", "mov", "webm"].includes(extension || ""))
      return <Video className="w-4 h-4" />;
    if (["pdf"].includes(extension || ""))
      return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      text: message,
      senderId: mockUser.id,
      senderName: mockUser.name,
      senderType: "user" as const,
      timestamp: new Date().toISOString(),
    };

    // Add to UI immediately for better UX
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Send to backend
    if (chatId && user) {
      try {
        await sendMessage(chatId, user.id, message.trim());
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

    // Animate new message
    setTimeout(() => {
      const newMessageEl = messagesRef.current?.lastElementChild;
      if (newMessageEl) {
        gsap.fromTo(
          newMessageEl,
          { opacity: 0, x: 50, scale: 0.9 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.2)",
          },
        );
      }
    }, 50);

    // Only simulate designer response if we're in demo mode
    if (process.env.NODE_ENV === "development" && projectDetails?.designer_id) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const designerResponse = {
          id: (messages.length + 2).toString(),
          text: "Thanks for the feedback! I'll work on those changes right away. 👍",
          senderId: projectDetails.designer_id,
          senderName: "Designer",
          senderType: "designer" as const,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, designerResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      console.log(
        "Files selected:",
        fileArray.map((f) => f.name),
      );

      // Create new message with files
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: `Sent ${fileArray.length} file(s): ${fileArray.map((f) => f.name).join(", ")}`,
        senderId: mockUser.id,
        senderName: mockUser.name,
        senderType: "user" as const,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-festival-cream flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 max-w-4xl mx-auto w-full flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b-4 border-black bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/design-dashboard")}
                variant="outline"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-festival-orange border-4 border-black rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {projectDetails?.designer_id ? "D" : "?"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">
                    {projectDetails?.designer_id
                      ? "Designer"
                      : "Waiting for assignment"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-sm text-black/70">
                      {isTyping ? "Typing..." : "Online"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-black/70">
              Project: {projectDetails?.title || "Loading..."}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ height: "calc(100vh - 200px)" }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 border-4 border-festival-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-black/50">
              <MessageCircle className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">
                Start the conversation by sending a message
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    msg.senderType === "user"
                      ? "bg-gradient-to-br from-festival-orange to-festival-coral"
                      : "bg-gradient-to-br from-festival-cyan to-festival-yellow"
                  } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className="font-medium text-black text-sm mb-1">
                    {msg.senderName}
                  </div>
                  <div className="text-black font-medium">{msg.text}</div>

                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2 p-2 bg-white border-2 border-black rounded-none"
                        >
                          {getFileIcon(file.name)}
                          <span className="text-sm font-medium text-black flex-1 truncate">
                            {file.name}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 border-2 border-black"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-black/70 mt-2">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                  <span className="text-sm text-black/70">Sarah is typing</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t-4 border-black bg-white">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />

            <Button
              onClick={handleFileAttach}
              variant="outline"
              size="sm"
              className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="h-12 border-4 border-black pr-12 bg-festival-cream text-lg font-medium"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 border-2 border-black"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !chatId || !user}
              className="h-12 px-6 bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-xs text-black/60 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
