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

  // Container animation
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
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

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      const success = await sendChatMessage(message);

      if (success) {
        setMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
                  <MessageCircle className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">
                    {projectDetails?.title || "Project Chat"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-sm text-black/70">
                      {projectDetails?.designer?.name
                        ? `Designer: ${projectDetails.designer.name}`
                        : "Waiting for designer assignment"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {projectDetails && (
              <div className="text-sm text-black/70">
                Client: {projectDetails.client?.name || "Unknown"}
              </div>
            )}
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
