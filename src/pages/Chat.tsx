import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { getDesignRequestById } from "@/lib/api";
import SupabaseConnectionTest from "@/components/SupabaseConnectionTest";

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
        {/* Show error if there's a problem loading messages */}
        {error && (
          <div className="space-y-4">
            <div className="bg-red-50 border-4 border-red-500 p-4">
              <p className="text-red-800 font-medium">Chat Error</p>
              <p className="text-red-600 text-sm whitespace-pre-line">
                {error}
              </p>
            </div>
            <SupabaseConnectionTest />
          </div>
        )}
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
          {error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
              <p className="text-lg font-medium text-black mb-2">Chat Error</p>
              <p className="text-sm text-black/70 text-center max-w-md">
                {error}
              </p>
            </div>
          ) : messagesLoading || projectLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-festival-orange" />
                <p className="text-sm text-black/70">Loading messages...</p>
              </div>
            </div>
          ) : !projectId ? (
            <div className="flex flex-col items-center justify-center h-full text-black/50">
              <MessageCircle className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No Project Selected</p>
              <p className="text-sm">
                Please select a project to start chatting
              </p>
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
                className={`flex ${
                  msg.sender_id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    msg.sender_id === user?.id
                      ? "bg-gradient-to-br from-festival-orange to-festival-coral"
                      : "bg-gradient-to-br from-festival-pink to-festival-magenta"
                  } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className="font-medium text-black text-sm mb-1">
                    {msg.sender?.name || "Unknown User"}
                  </div>
                  <div className="text-black font-medium">{msg.text}</div>
                  <div className="text-xs text-black/70 mt-2">
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t-4 border-black bg-white">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  !projectId
                    ? "Please select a project to chat"
                    : error
                      ? "Chat unavailable"
                      : "Type your message..."
                }
                disabled={!projectId || !!error || sending}
                className="h-12 border-4 border-black bg-festival-cream text-lg font-medium"
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !projectId || !!error || sending}
              className="h-12 px-6 bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="text-xs text-black/60 mt-2 text-center">
            Press Enter to send • Instant messaging with Supabase Realtime
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
