import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { getDesignRequests } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Plus,
  Palette,
  PaintBucket,
  Brush,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  description?: string;
}

interface ProjectChatSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onCreateNewProject: () => void;
}

export const ProjectChatSelection: React.FC<ProjectChatSelectionProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onCreateNewProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const loadProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const projectsData = await getDesignRequests(user.id);
      setProjects(projectsData);
    } catch (err: any) {
      console.error("Error loading projects:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadProjects();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "submitted":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-300";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "low":
        return "text-green-600 bg-green-100 border-green-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "logo":
        return <PaintBucket className="w-6 h-6" />;
      case "web":
        return <Brush className="w-6 h-6" />;
      case "brand":
      case "branding":
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Palette className="w-6 h-6" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const activeProjects = projects.filter(
    (p) => p.status === "in-progress" || p.status === "submitted",
  );
  const completedProjects = projects.filter(
    (p) => p.status === "completed" || p.status === "delivered",
  );
  const draftProjects = projects.filter((p) => p.status === "draft");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-black flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-festival-orange" />
            Choose Project to Chat About
          </DialogTitle>
        </DialogHeader>

        <div ref={containerRef} className="space-y-6">
          {/* Create New Project Button */}
          <Card
            className="border-4 border-dashed border-festival-orange/50 hover:border-festival-orange bg-festival-orange/5 hover:bg-festival-orange/10 transition-all duration-200 cursor-pointer p-6 group"
            onClick={() => {
              onCreateNewProject();
              onClose();
            }}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-festival-orange/20 rounded-full flex items-center justify-center border-4 border-festival-orange/50 group-hover:border-festival-orange transition-all">
                <Plus className="w-8 h-8 text-festival-orange" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-black group-hover:text-festival-orange transition-colors">
                  Start New Project Chat
                </h3>
                <p className="text-black/60">
                  Create a new design project and start chatting
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-festival-orange/60 group-hover:text-festival-orange transition-colors" />
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-festival-orange mx-auto mb-4" />
              <p className="text-lg font-medium text-black">
                Loading your projects...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-bold text-red-600 mb-2">
                Error Loading Projects
              </p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button
                onClick={loadProjects}
                className="bg-festival-orange hover:bg-festival-coral border-2 border-black"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Active Projects */}
                {activeProjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      Active Projects ({activeProjects.length})
                    </h3>
                    <div className="grid gap-3">
                      {activeProjects.map((project) => (
                        <Card
                          key={project.id}
                          className="border-2 border-black/20 hover:border-festival-orange hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 p-4 cursor-pointer group"
                          onClick={() => {
                            onSelectProject(project.id);
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-festival-orange/20 rounded-xl flex items-center justify-center border-2 border-festival-orange/30 text-festival-orange">
                              {getCategoryIcon(project.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-black group-hover:text-festival-orange transition-colors truncate">
                                {project.title}
                              </h4>
                              <p className="text-sm text-black/60 line-clamp-1 mb-2">
                                {project.description || "No description"}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  className={`${getStatusColor(project.status)} border text-xs`}
                                >
                                  {project.status}
                                </Badge>
                                <Badge
                                  className={`${getPriorityColor(project.priority)} border text-xs`}
                                >
                                  {project.priority} priority
                                </Badge>
                                <span className="text-xs text-black/50">
                                  {formatDate(project.created_at)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-festival-orange transition-colors flex-shrink-0" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Projects */}
                {completedProjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Completed Projects ({completedProjects.length})
                    </h3>
                    <div className="grid gap-3">
                      {completedProjects.map((project) => (
                        <Card
                          key={project.id}
                          className="border-2 border-black/20 hover:border-festival-orange hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 p-4 cursor-pointer group"
                          onClick={() => {
                            onSelectProject(project.id);
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-300 text-green-600">
                              {getCategoryIcon(project.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-black group-hover:text-festival-orange transition-colors truncate">
                                {project.title}
                              </h4>
                              <p className="text-sm text-black/60 line-clamp-1 mb-2">
                                {project.description || "No description"}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  className={`${getStatusColor(project.status)} border text-xs`}
                                >
                                  {project.status}
                                </Badge>
                                <Badge
                                  className={`${getPriorityColor(project.priority)} border text-xs`}
                                >
                                  {project.priority} priority
                                </Badge>
                                <span className="text-xs text-black/50">
                                  {formatDate(project.created_at)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-festival-orange transition-colors flex-shrink-0" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Draft Projects */}
                {draftProjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-gray-500" />
                      Draft Projects ({draftProjects.length})
                    </h3>
                    <div className="grid gap-3">
                      {draftProjects.map((project) => (
                        <Card
                          key={project.id}
                          className="border-2 border-black/20 hover:border-festival-orange hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 p-4 cursor-pointer group opacity-75 hover:opacity-100"
                          onClick={() => {
                            onSelectProject(project.id);
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-300 text-gray-600">
                              {getCategoryIcon(project.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-black group-hover:text-festival-orange transition-colors truncate">
                                {project.title}
                              </h4>
                              <p className="text-sm text-black/60 line-clamp-1 mb-2">
                                {project.description || "No description"}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  className={`${getStatusColor(project.status)} border text-xs`}
                                >
                                  {project.status}
                                </Badge>
                                <Badge
                                  className={`${getPriorityColor(project.priority)} border text-xs`}
                                >
                                  {project.priority} priority
                                </Badge>
                                <span className="text-xs text-black/50">
                                  {formatDate(project.created_at)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-festival-orange transition-colors flex-shrink-0" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {projects.length === 0 && (
                  <div className="text-center py-12">
                    <Palette className="w-16 h-16 text-festival-orange/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black/60 mb-2">
                      No projects yet
                    </h3>
                    <p className="text-black/50 mb-6">
                      Create your first project to start chatting with a
                      designer!
                    </p>
                    <Button
                      onClick={() => {
                        onCreateNewProject();
                        onClose();
                      }}
                      className="bg-festival-orange hover:bg-festival-coral border-2 border-black font-bold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Project
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectChatSelection;
