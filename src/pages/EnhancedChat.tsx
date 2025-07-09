import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { getDesignRequestById, getDesignRequests } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Loader2,
  Circle,
  AlertCircle,
  Paperclip,
  X,
  Image as ImageIcon,
  Download,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Camera,
  File,
  Maximize2,
  Minimize2,
  RotateCcw,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectInfo {
  id: string;
  title: string;
  status: string;
  category: string;
}

const EnhancedChat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get project ID from URL query params
  const projectId = new URLSearchParams(location.search).get("request");

  // Chat state
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Project navigation state
  const [userProjects, setUserProjects] = useState<ProjectInfo[]>([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  // Image viewer state
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Use the realtime chat hook
  const {
    messages,
    loading: messagesLoading,
    error,
    sendMessage: sendChatMessage,
  } = useRealtimeChat(projectId);

  // Load user projects for navigation
  useEffect(() => {
    const loadUserProjects = async () => {
      if (!user) return;

      try {
        const projects = await getDesignRequests(user.id);
        // Filter out invoices and only get actual projects
        const actualProjects = projects.filter((p) => p.category !== "invoice");
        setUserProjects(actualProjects);

        // Find current project index
        const currentIndex = actualProjects.findIndex(
          (p) => p.id === projectId,
        );
        if (currentIndex !== -1) {
          setCurrentProjectIndex(currentIndex);
        }
      } catch (error) {
        console.error("Error loading user projects:", error);
      }
    };

    loadUserProjects();
  }, [user, projectId]);

  // Auto-scroll to bottom on component mount and new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Load project details
  const [projectError, setProjectError] = useState<string | null>(null);

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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // File upload handler
  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !projectId || !user) return;

    setUploadingFile(true);

    try {
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
        const fileName = `${projectId}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("chat-files")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          const errorMessage =
            uploadError.message || uploadError.error || "Failed to upload file";
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

        await sendChatMessage(fileMessage);

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
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      const success = await sendChatMessage(message);

      if (success) {
        setMessage("");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
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

  // Project navigation functions
  const navigateToProject = (index: number) => {
    const project = userProjects[index];
    if (project) {
      navigate(`/chat?request=${project.id}`);
      setShowProjectSelector(false);
    }
  };

  const goToPreviousProject = () => {
    if (currentProjectIndex > 0) {
      navigateToProject(currentProjectIndex - 1);
    }
  };

  const goToNextProject = () => {
    if (currentProjectIndex < userProjects.length - 1) {
      navigateToProject(currentProjectIndex + 1);
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

  // Message rendering with enhanced features
  const renderMessage = (msg: any, index: number) => {
    const isFromMe = msg.sender_id === user?.id;
    const isFirstInGroup =
      index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
    const prevMsgDate =
      index > 0
        ? new Date(messages[index - 1].created_at).toDateString()
        : null;
    const currentMsgDate = new Date(msg.created_at).toDateString();
    const showDateDivider = prevMsgDate !== currentMsgDate;

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
      <React.Fragment key={msg.id}>
        {/* Date divider */}
        {showDateDivider && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center my-4"
          >
            <div className="bg-black/10 px-3 py-1 rounded-full text-xs font-medium text-black/70">
              {formatDate(msg.created_at)}
            </div>
          </motion.div>
        )}

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`flex ${isFromMe ? "justify-end" : "justify-start"} ${
            isFirstInGroup ? "mt-4" : "mt-1"
          }`}
        >
          <div
            className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex ${isFromMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}
          >
            {/* Avatar for others */}
            {!isFromMe && isFirstInGroup && (
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
            {!isFromMe && !isFirstInGroup && <div className="w-8" />}

            {/* Message bubble */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`relative px-4 py-2 rounded-2xl shadow-lg ${
                isFromMe
                  ? "bg-festival-orange border-2 border-black text-black rounded-br-md"
                  : "bg-white border-2 border-black text-black rounded-bl-md"
              }`}
            >
              {/* Sender name for group chats */}
              {!isFromMe && isFirstInGroup && (
                <div className="text-xs font-semibold text-festival-magenta mb-1">
                  {msg.sender?.name || "Designer"}
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
            </motion.div>
          </div>
        </motion.div>
      </React.Fragment>
    );
  };

  return (
    <div className="h-screen bg-festival-cream flex flex-col">
      {/* Header - Enhanced with project navigation */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 p-4 border-b-4 border-black bg-white shadow-lg"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/design-dashboard")}
              variant="outline"
              size="sm"
              className="border-2 border-black hover:bg-festival-orange/20"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 text-black" />
              </motion.div>
              <div>
                <h2 className="text-lg font-bold text-black">
                  {projectDetails?.title || "Project Chat"}
                </h2>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <span className="text-xs text-black/70">
                    Connected to chat
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Navigation */}
          {userProjects.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={goToPreviousProject}
                disabled={currentProjectIndex === 0}
                variant="outline"
                size="sm"
                className="border-2 border-black"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                variant="outline"
                size="sm"
                className="border-2 border-black"
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                {currentProjectIndex + 1} of {userProjects.length}
              </Button>

              <Button
                onClick={goToNextProject}
                disabled={currentProjectIndex === userProjects.length - 1}
                variant="outline"
                size="sm"
                className="border-2 border-black"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Project Selector Dropdown */}
        <AnimatePresence>
          {showProjectSelector && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-16 bg-white border-2 border-black rounded-lg shadow-lg z-50 max-w-sm"
            >
              <div className="p-3">
                <h3 className="font-bold text-sm mb-2">Switch Project</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {userProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigateToProject(index)}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        index === currentProjectIndex
                          ? "bg-festival-orange text-black"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-sm font-medium">{project.title}</div>
                      <div className="text-xs text-black/60">
                        <Badge className="text-xs">{project.status}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full">
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-festival-cream/50"
          style={{ scrollBehavior: "smooth" }}
        >
          {messagesLoading && messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-full"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-festival-orange" />
                <p className="text-sm text-black/70">Loading messages...</p>
              </div>
            </motion.div>
          ) : !projectId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-black/50"
            >
              <MessageCircle className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No Project Selected</p>
              <p className="text-sm">
                Please select a project to start chatting
              </p>
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-black/50"
            >
              <MessageCircle className="w-12 h-12 mb-3" />
              <p className="text-base font-medium">Start the conversation!</p>
              <p className="text-sm">Send a message or share a file</p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => renderMessage(msg, index))}
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
                disabled={uploadingFile || !projectId}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message... or attach a file"
                disabled={sending || !projectId}
                className="border-2 border-black bg-white h-11 text-black placeholder:text-black/60 rounded-full px-4 focus:ring-2 focus:ring-festival-orange focus:border-festival-orange"
              />
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sending || !projectId}
                size="sm"
                className={`h-11 w-11 rounded-full p-0 border-2 border-black shadow-lg transition-all ${
                  message.trim() && !sending
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

export default EnhancedChat;
