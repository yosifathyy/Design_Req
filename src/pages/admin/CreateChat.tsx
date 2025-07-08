import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getAdminUsers,
  getAdminProjects,
  createChat,
  sendMessage,
} from "@/lib/api";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  Users,
  FileText,
  Search,
  RefreshCw,
} from "lucide-react";

const CreateChat: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [chatTitle, setChatTitle] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Load users and projects
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, projectsData] = await Promise.all([
          getAdminUsers(),
          getAdminProjects(),
        ]);
        setUsers(usersData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const availableUsers = users.filter(
    (user) =>
      user.role !== "super-admin" &&
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one participant");
      return;
    }

    if (!selectedProject) {
      alert("Please select a project for this chat");
      return;
    }

    try {
      setCreating(true);

      // Create chat with participants
      const chat = await createChat(selectedProject, selectedUsers);

      // Send initial message if provided
      if (initialMessage.trim() && chat) {
        await sendMessage(chat.id, "current-admin-id", initialMessage);
      }

      // Show success animation
      const successEl = document.createElement("div");
      successEl.className =
        "fixed inset-0 flex items-center justify-center z-50 bg-black/50";
      successEl.innerHTML = `
        <div class="bg-white border-4 border-black p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div class="text-6xl mb-4">💬</div>
          <h3 class="text-2xl font-bold text-black mb-2">Chat Created!</h3>
          <p class="text-black/70">New conversation started successfully</p>
        </div>
      `;
      document.body.appendChild(successEl);

      setTimeout(() => {
        document.body.removeChild(successEl);
        navigate(chat ? `/admin/chat/${chat.id}` : "/admin/chat");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to create chat:", error);
      alert(`Failed to create chat: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin/chat")}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat Hub
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold text-black">
              CREATE NEW CHAT
            </h1>
            <p className="text-xl text-black/70 font-medium">
              Start a new conversation with team members
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chat Details */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
              <h3 className="text-xl font-bold text-black">Chat Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Related Project *
                </Label>
                <select
                  value={selectedProject}
                  onChange={(e) => {
                    setSelectedProject(e.target.value);
                    // Auto-generate chat title based on project
                    const project = projects.find(
                      (p) => p.id === e.target.value,
                    );
                    if (project && !chatTitle) {
                      setChatTitle(`Chat: ${project.title}`);
                    }
                  }}
                  className="w-full p-3 border-4 border-black bg-festival-cream"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} -{" "}
                      {project.client?.name || "Unknown Client"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-bold text-black">
                  Chat Title
                </Label>
                <Input
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  placeholder="Chat title (auto-generated from project)..."
                  className="border-4 border-black bg-festival-cream"
                />
              </div>

              {selectedProjectData && (
                <div className="p-4 bg-festival-cream border-2 border-black">
                  <h4 className="font-bold text-black mb-2">
                    {selectedProjectData.title}
                  </h4>
                  <div className="text-sm text-black/70">
                    <p>
                      Client:{" "}
                      {selectedProjectData.client?.name || "Unknown Client"}
                    </p>
                    <p>Status: {selectedProjectData.status}</p>
                    <p>
                      Designer:{" "}
                      {selectedProjectData.designer?.name || "Unassigned"}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-bold text-black">
                  Initial Message (Optional)
                </Label>
                <Textarea
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Type the first message to start the conversation..."
                  className="border-4 border-black bg-festival-cream"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Participant Selection */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Select Participants
                </h3>
                <div className="bg-black text-white px-3 py-1 rounded border-2 border-white">
                  {selectedUsers.length} selected
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="pl-12 border-4 border-black bg-festival-cream"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-festival-orange" />
                    <p className="text-sm text-black/70">Loading users...</p>
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 mx-auto mb-2 text-black/30" />
                    <p className="text-sm text-black/70">
                      {searchQuery
                        ? "No users match your search"
                        : "No users available"}
                    </p>
                  </div>
                ) : (
                  availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 border-2 border-black cursor-pointer transition-all duration-200 ${
                        selectedUsers.includes(user.id)
                          ? "bg-festival-orange"
                          : "bg-festival-cream hover:bg-festival-yellow/50"
                      }`}
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-black">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-black">{user.name}</p>
                          <p className="text-sm text-black/70">{user.email}</p>
                          <p className="text-xs text-black/50 uppercase">
                            {user.role}
                          </p>
                        </div>
                        {selectedUsers.includes(user.id) && (
                          <div className="w-6 h-6 bg-green-500 border-2 border-black rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedUsers.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border-2 border-black">
                  <p className="text-sm font-bold text-black mb-2">
                    Selected Participants:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return (
                        <span
                          key={userId}
                          className="px-2 py-1 bg-festival-orange border border-black text-xs font-medium rounded"
                        >
                          {user?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleCreateChat}
              disabled={selectedUsers.length === 0 || !chatTitle.trim()}
              className="text-xl font-display font-bold px-8 py-4 h-auto bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              CREATE CHAT
              <Send className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
