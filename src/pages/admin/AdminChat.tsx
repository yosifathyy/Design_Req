
import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import StorageSetupHelper from "@/components/StorageSetupHelper";
import { supabase } from "@/lib/supabase";

import { useRealtimeChatRooms, useRealtimeChat } from "@/hooks/useRealtimeChat";
import {
  MessageCircle,
  Search,
  Clock,
  User,
  Send,
  RefreshCw,
  ArrowLeft,
  Paperclip,
  X,
  Image as ImageIcon,
  Download,
  Maximize2,
  File,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminChat: React.FC = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams<{ id?: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projectId || null,
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showStorageSetup, setShowStorageSetup] = useState(false);

  // Image viewer state
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Use the new realtime hooks
  const {
    chatRooms,
    loading: roomsLoading,
    refreshChatRooms,
  } = useRealtimeChatRooms();
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
  } = useRealtimeChat(selectedProjectId);

  // Auto-select project from URL
  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);

  // Auto-scroll to bottom on new messages and when chat is selected
  useEffect(() => {
    if (messagesRef.current && selectedProjectId) {
      const scrollElement = messagesRef.current;
      const scrollToBottom = () => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      };
      
      // Small delay to ensure messages are rendered
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, selectedProjectId]);

  // Focus input when chat is selected
  useEffect(() => {
    if (inputRef.current && selectedProjectId && !messagesLoading) {
      inputRef.current.focus();
    }
  }, [selectedProjectId, messagesLoading]);

  useEffect(() => {
    if (!containerRef.current || roomsLoading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [roomsLoading]);

  // File upload handler
  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !selectedProjectId) return;

    setUploadingFile(true);

    try {
      console.log("🔄 Starting file upload process...");

      for (const file of Array.from(files)) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select a file smaller than 10MB",
            variant: "destructive",
          });
          continue;
        }

        // Upload to Supabase storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${selectedProjectId}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("chat-files")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);

          // Check if it's a bucket not found error
          if (
            uploadError.message?.includes("Bucket not found") ||
            uploadError.message?.includes("bucket does not exist")
          ) {
            console.log("Bucket doesn't exist, showing setup helper");
            setShowStorageSetup(true);
            return;
          }

          const errorMessage =
            uploadError.message || "Failed to upload file";
          toast({
            title: "Upload failed",
            description: `${errorMessage}. Please try again.`,
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("chat-files").getPublicUrl(fileName);

        // Send message with file
        const fileMessage = file.type.startsWith("image/")
          ? `📷 **Image:** ${file.name}\n![${file.name}](${publicUrl})`
          : `📎 **File:** ${file.name}\n[Download](${publicUrl})`;

        await sendMessage(fileMessage);

        toast({
          title: "File uploaded",
          description: `${file.name} has been shared`,
        });
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error?.message ||
        error?.error ||
        "An error occurred while uploading the file";
      toast({
        title: "Upload error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const success = await sendMessage(newMessage);
      if (success) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
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

  // Image viewer functions
  const openImageViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setSelectedImage(null);
  };

  // Enhanced message rendering with images and files
  const renderMessage = (msg: any, index: number) => {
    const isFromAdmin = msg.sender?.role === "admin" || msg.sender?.role === "super-admin";
    const isFirstInGroup =
      index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;

    // Parse message for images and files
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    let messageContent = msg.text;
    const images: Array<{ alt: string; url: string }> = [];
    const links: Array<{ text: string; url: string }> = [];

    // Extract images
    let imageMatch;
    while ((imageMatch = imageRegex.exec(msg.text)) !== null) {
      images.push({ alt: imageMatch[1], url: imageMatch[2] });
      messageContent = messageContent.replace(imageMatch[0], "");
    }

    // Extract links
    let linkMatch;
    while ((linkMatch = linkRegex.exec(msg.text)) !== null) {
      links.push({ text: linkMatch[1], url: linkMatch[2] });
      messageContent = messageContent.replace(linkMatch[0], "");
    }

    // Clean up message content
    messageContent = messageContent.replace(/📷 \*\*Image:\*\* [^\n]+\n?/g, "");
    messageContent = messageContent.replace(/📎 \*\*File:\*\* [^\n]+\n?/g, "");
    messageContent = messageContent.trim();

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex ${isFromAdmin ? "justify-end" : "justify-start"} ${
          isFirstInGroup ? "mt-4" : "mt-1"
        }`}
      >
        <div
          className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex ${isFromAdmin ? "flex-row-reverse" : "flex-row"} items-end gap-2`}
        >
          {/* Avatar for client messages */}
          {!isFromAdmin && isFirstInGroup && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 bg-festival-pink border-2 border-black rounded-full flex items-center justify-center flex-shrink-0"
            >
              <span className="text-xs font-bold text-black">
                {msg.sender?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </motion.div>
          )}
          {!isFromAdmin && !isFirstInGroup && <div className="w-8" />}

          {/* Message bubble */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative px-4 py-2 rounded-2xl shadow-lg ${
              isFromAdmin
                ? "bg-festival-orange border-2 border-black text-black rounded-br-md"
                : "bg-white border-2 border-black text-black rounded-bl-md"
            }`}
          >
            {/* Sender name for client messages */}
            {!isFromAdmin && isFirstInGroup && (
              <div className="text-xs font-semibold text-festival-magenta mb-1">
                {msg.sender?.name || "Client"}
              </div>
            )}

            {/* Images */}
            {images.length > 0 && (
              <div className="space-y-2 mb-2">
                {images.map((img, imgIndex) => (
                  <motion.div
                    key={imgIndex}
                    whileHover={{ scale: 1.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => openImageViewer(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="max-w-full h-auto rounded-lg border border-black/20"
                      style={{ maxHeight: "200px" }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Files/Links */}
            {links.length > 0 && (
              <div className="space-y-2 mb-2">
                {links.map((link, linkIndex) => (
                  <motion.a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 p-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
                  >
                    <File className="w-4 h-4 text-festival-orange" />
                    <span className="text-sm font-medium">{link.text}</span>
                    <Download className="w-3 h-3 text-black/50" />
                  </motion.a>
                ))}
              </div>
            )}

            {/* Message text */}
            {messageContent && (
              <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {messageContent}
              </div>
            )}

            {/* Timestamp */}
            <div
              className={`text-xs mt-1 ${isFromAdmin ? "text-black/70" : "text-black/60"}`}
            >
              {new Date(msg.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const filteredChats = chatRooms.filter(
    (chat) =>
      chat.project_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.client_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div ref={containerRef} className="h-screen bg-festival-cream flex flex-col">
      {/* Storage Setup Helper */}
      <AnimatePresence>
        {showStorageSetup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-white border-b-2 border-black"
          >
            <div className="max-w-6xl mx-auto">
              <StorageSetupHelper />
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => setShowStorageSetup(false)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 p-4 border-b-4 border-black bg-white shadow-lg"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            {selectedProjectId && (
              <Button
                onClick={() => navigate("/admin/chat")}
                variant="outline"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                All Chats
              </Button>
            )}
            <div>
              <h1 className="text-4xl font-display font-bold text-black mb-2">
                {selectedProjectId ? `PROJECT CHAT` : "ADMIN CHAT HUB"}
              </h1>
              <p className="text-xl text-black/70 font-medium">
                {selectedProjectId
                  ? `Managing project: ${selectedProjectId}`
                  : "Unified communication center for all client projects"}
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

        <div className="flex gap-4 mt-4 max-w-6xl mx-auto">
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
            onClick={refreshChatRooms}
            variant="outline"
            className="border-4 border-black"
            disabled={roomsLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${roomsLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">
        {/* Chat List */}
        <div className="w-80 flex-shrink-0 border-r-4 border-black bg-gradient-to-b from-white to-festival-cream/30">
          <div className="p-4 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
            <h3 className="font-bold text-black">Active Conversations</h3>
            <p className="text-xs text-black/70 mt-1">Click to view project chats</p>
          </div>
          <div className="h-full overflow-y-auto p-4 space-y-2">
            {roomsLoading ? (
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
                <motion.div
                  key={chat.project_id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedProjectId(chat.project_id);
                    navigate(`/admin/chat/${chat.project_id}`, {
                      replace: true,
                    });
                  }}
                  className={`p-4 border-2 border-black cursor-pointer hover:bg-festival-orange/20 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                    selectedProjectId === chat.project_id
                      ? "bg-gradient-to-r from-festival-orange to-festival-coral text-white border-festival-orange"
                      : "bg-white hover:bg-festival-cream"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-sm text-black line-clamp-1">
                      {chat.project_title || "Untitled Project"}
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
                        {chat.client_name || "Unknown User"}
                      </span>
                    </div>
                    <p className="text-xs text-black/60 line-clamp-2">
                      {chat.last_message?.text || "No messages yet"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-black/50">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(
                          typeof chat.last_message === 'string' ? chat.last_message : new Date().toISOString(),
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-white via-festival-cream/20 to-festival-cream/50">
          <div className="flex-shrink-0 p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
            <h3 className="font-bold text-white text-xl">
              {selectedProjectId
                ? "💬 Project Chat"
                : "👋 Select a conversation to start chatting"}
            </h3>
            {selectedProjectId && (
              <p className="text-sm text-white/90 mt-1">
                🎯 Project ID: {selectedProjectId}
              </p>
            )}
          </div>
          
          {/* Messages Area */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ scrollBehavior: "smooth" }}
          >
            {!selectedProjectId ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-black/30 mx-auto mb-4" />
                  <p className="text-black/50">
                    Choose a conversation from the list to view messages
                  </p>
                </div>
              </div>
            ) : messagesLoading ? (
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
              <AnimatePresence initial={false}>
                {messages.map((message, index) => renderMessage(message, index))}
              </AnimatePresence>
            )}
          </div>

          {/* Enhanced Input Area */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-shrink-0 p-4 border-t-2 border-black bg-white"
          >
            <div className="flex items-center gap-3">
              {/* File upload button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile || !selectedProjectId}
                  variant="outline"
                  size="sm"
                  className="border-2 border-black hover:bg-festival-pink/20 h-11 w-11 p-0"
                >
                  {uploadingFile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>

              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message... or attach a file"
                  disabled={sending || !selectedProjectId}
                  className="border-2 border-black bg-white h-11 text-black placeholder:text-black/60 rounded-full px-4 focus:ring-2 focus:ring-festival-orange focus:border-festival-orange"
                />
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending || !selectedProjectId}
                  size="sm"
                  className={`h-11 w-11 rounded-full p-0 border-2 border-black shadow-lg transition-all ${
                    newMessage.trim() && !sending
                      ? "bg-festival-orange hover:bg-festival-coral"
                      : "bg-gray-300"
                  }`}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            />
          </motion.div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {imageViewerOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImageViewer}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full size view"
                className="max-w-full max-h-full object-contain"
              />

              <Button
                onClick={closeImageViewer}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white border-2 border-black"
              >
                <X className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => window.open(selectedImage, "_blank")}
                variant="outline"
                size="sm"
                className="absolute bottom-4 right-4 bg-white border-2 border-black"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminChat;
