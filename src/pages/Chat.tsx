import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { getDesignRequestById } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import SupabaseConnectionTest from "@/components/SupabaseConnectionTest";
import QuickConnectionTest from "@/components/QuickConnectionTest";
import ChatConnectionFixer from "@/components/ChatConnectionFixer";
import ChatErrorDebugger from "@/components/ChatErrorDebugger";
import ErrorDisplay from "@/components/ErrorDisplay";
import UserSyncFix from "@/components/UserSyncFix";
import UserCreationDebugger from "@/components/UserCreationDebugger";
import RLSFixGuide from "@/components/RLSFixGuide";
import UserIDMismatchFixer from "@/components/UserIDMismatchFixer";
import DatabaseDiagnostic from "@/components/DatabaseDiagnostic";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Loader2,
  Circle,
  AlertCircle,
} from "lucide-react";

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get project ID from URL query params
  const projectId = new URLSearchParams(location.search).get("request");

  // Chat state
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Use the realtime chat hook
  const {
    messages,
    loading: messagesLoading,
    error,
    sendMessage: sendChatMessage,
  } = useRealtimeChat(projectId);

  // Retry function for connection issues
  const retryConnection = () => {
    console.log("Retrying chat connection...");
    setRetryKey((prev) => prev + 1);
    // Force re-render of chat hook
    window.location.reload();
  };

  // Load project details
  const [projectError, setProjectError] = useState<string | null>(null);

  // Function to mark messages as read when chat is opened
  const markChatAsRead = async (chatId: string) => {
    if (!user || !chatId) return;

    try {
      // Use the Supabase function to mark chat as read
      const { error } = await supabase.rpc("mark_chat_as_read", {
        p_chat_id: chatId,
        p_user_id: user.id,
      });

      if (error) {
        console.error(`Error marking chat ${chatId} as read:`, error);
        // Fallback to direct update if function doesn't exist
        await supabase
          .from("chat_participants")
          .update({ last_read_at: new Date().toISOString() })
          .eq("chat_id", chatId)
          .eq("user_id", user.id);
      }

      console.log("✅ Marked chat as read:", chatId);
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  };

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (!projectId) return;

      try {
        setProjectLoading(true);
        setProjectError(null);
        const requestData = await getDesignRequestById(projectId);
        setProjectDetails(requestData);
      } catch (error: any) {
        console.error("Error loading project:", error);
        setProjectError(error.message || "Unknown error loading project");
      } finally {
        setProjectLoading(false);
      }
    };

    if (projectId) {
      loadProjectDetails();
    }
  }, [projectId]);

  // Auto-scroll to bottom when new messages arrive and mark as read
  useEffect(() => {
    if (messages.length > 0 && messagesRef.current) {
      const scrollElement = messagesRef.current;
      const isScrolledToBottom =
        scrollElement.scrollHeight - scrollElement.clientHeight <=
        scrollElement.scrollTop + 100;

      // Only auto-scroll if user is already near the bottom
      if (isScrolledToBottom) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 50);
      }

      // Mark messages as read when they're loaded/viewed
      if (projectId) {
        // Get the chat ID from the useRealtimeChat hook if possible
        // For now, we'll trigger mark as read when messages are loaded
        const chatId = messages[0]?.chat_id;
        if (chatId) {
          markChatAsRead(chatId);
        }
      }
    }
  }, [messages.length, projectId]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current && !messagesLoading) {
      inputRef.current.focus();
    }
  }, [messagesLoading]);

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
        // Force scroll to bottom after sending
        setTimeout(() => {
          if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
          }
        }, 50);
      } else {
        console.error("Failed to send message - check error state for details");
        // The error details are already in the error state from useRealtimeChat
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      // Extract detailed error information for debugging
      if (error?.message) {
        console.error("Error message:", error.message);
      }
      if (error?.details) {
        console.error("Error details:", error.details);
      }
      if (error?.hint) {
        console.error("Error hint:", error.hint);
      }
      if (error?.code) {
        console.error("Error code:", error.code);
      }
      // Log the full error object structure
      console.error(
        "Full error object:",
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      );
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
    <div className="h-screen bg-festival-cream flex flex-col">
      {/* Show project error with diagnostics */}
      {projectError && (
        <div className="p-4 space-y-4">
          <ErrorDisplay error={projectError} title="Project Loading Error" />
          <DatabaseDiagnostic />
        </div>
      )}

      {/* Show connection fixer if there's a problem loading messages */}
      {error && error.includes("Failed to fetch") && (
        <div className="p-4">
          <ChatConnectionFixer onRetry={retryConnection} />
        </div>
      )}

      {/* Show detailed diagnostics for other errors */}
      {error && !error.includes("Failed to fetch") && (
        <div className="p-4 space-y-4">
          <ErrorDisplay error={error} title="Chat Message Error" />

          <DatabaseDiagnostic />

          {/* Show UserSyncFix for user-related errors */}
          {(error.includes("foreign key") ||
            error.includes("not present in table") ||
            error.includes("User account mismatch") ||
            error.includes("sender_id")) && (
            <>
              <UserIDMismatchFixer />
              <RLSFixGuide />
              <UserSyncFix />
              <UserCreationDebugger />
            </>
          )}

          <ChatErrorDebugger projectId={projectId} error={error} />
          <QuickConnectionTest />
          <SupabaseConnectionTest />
        </div>
      )}

      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-4 border-b-4 border-black bg-white shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/design-dashboard")}
              variant="outline"
              size="sm"
              className="border-2 border-black hover:bg-festival-orange/20"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">
                  {projectDetails?.title || "Project Chat"}
                </h2>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <span className="text-xs text-black/70">
                    {projectDetails?.designer?.name
                      ? `Designer: ${projectDetails.designer.name}`
                      : "Waiting for designer"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable chat window */}
      <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full">
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-festival-cream/50"
          style={{ scrollBehavior: "smooth" }}
        >
          {messagesLoading && messages.length === 0 ? (
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
              <MessageCircle className="w-12 h-12 mb-3" />
              <p className="text-base font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isFromMe = msg.sender_id === user?.id;
              const isFirstInGroup =
                index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isFromMe ? "justify-end" : "justify-start"} ${
                    isFirstInGroup ? "mt-4" : "mt-1"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex ${isFromMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}
                  >
                    {/* Avatar for others */}
                    {!isFromMe && isFirstInGroup && (
                      <div className="w-8 h-8 bg-festival-pink border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-black">
                          {msg.sender?.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                    {!isFromMe && !isFirstInGroup && <div className="w-8" />}

                    {/* Message bubble */}
                    <div
                      className={`relative px-4 py-2 rounded-2xl shadow-lg ${
                        isFromMe
                          ? "bg-festival-orange border-2 border-black text-black rounded-br-md"
                          : "bg-white border-2 border-black text-black rounded-bl-md"
                      } ${isFirstInGroup ? "mt-0" : ""}`}
                    >
                      {/* Sender name for group chats */}
                      {!isFromMe && isFirstInGroup && (
                        <div className="text-xs font-semibold text-festival-magenta mb-1">
                          {msg.sender?.name || "Unknown User"}
                        </div>
                      )}

                      {/* Message text */}
                      <div className="text-sm leading-relaxed break-words">
                        {msg.text}
                      </div>

                      {/* Timestamp */}
                      <div
                        className={`text-xs mt-1 ${isFromMe ? "text-black/70" : "text-black/60"}`}
                      >
                        {formatTime(msg.created_at)}
                      </div>

                      {/* Message tail */}
                      <div
                        className={`absolute w-0 h-0 ${
                          isFromMe
                            ? "right-[-8px] bottom-2 border-l-[8px] border-l-festival-orange border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
                            : "left-[-8px] bottom-2 border-r-[8px] border-r-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t-2 border-black bg-white">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={sending || !projectId}
                className="border-2 border-black bg-white h-11 text-black placeholder:text-black/60 rounded-full px-4 focus:ring-2 focus:ring-festival-orange focus:border-festival-orange"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending || !projectId}
              size="sm"
              className={`h-11 w-11 rounded-full p-0 border-2 border-black shadow-lg transition-all ${
                message.trim() && !sending
                  ? "bg-festival-orange hover:bg-festival-coral hover:scale-110"
                  : "bg-gray-300"
              }`}
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
