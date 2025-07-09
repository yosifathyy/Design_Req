import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  kanbanApi,
  subscribeToKanbanUpdates,
  KanbanProject,
} from "@/lib/kanban-api";
import {
  Search,
  Plus,
  Filter,
  Clock,
  User,
  Calendar,
  DollarSign,
  MessageCircle,
  Eye,
  Edit,
  MoreVertical,
  Loader2,
  RefreshCw,
} from "lucide-react";

const ProjectKanban: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<KanbanProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as KanbanProject["priority"],
    budget: 1000,
  });

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const columns = [
    { id: "new", title: "New Requests", color: "from-blue-400 to-blue-500" },
    {
      id: "in-progress",
      title: "In Progress",
      color: "from-yellow-400 to-yellow-500",
    },
    {
      id: "needs-feedback",
      title: "Needs Feedback",
      color: "from-orange-400 to-orange-500",
    },
    {
      id: "revisions",
      title: "Revisions",
      color: "from-purple-400 to-purple-500",
    },
    {
      id: "completed",
      title: "Completed",
      color: "from-green-400 to-green-500",
    },
  ];

  // Load projects from Supabase
  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await kanbanApi.getAllProjects();
      setProjects(data);
      toast({
        title: "Projects loaded",
        description: `Loaded ${data.length} projects from database`,
      });
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "Failed to load projects from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const handleCreateProject = async () => {
    try {
      if (!newProject.title.trim()) {
        toast({
          title: "Title required",
          description: "Please enter a project title",
          variant: "destructive",
        });
        return;
      }

      const createdProject = await kanbanApi.createProject(newProject);
      setProjects((prev) => [createdProject, ...prev]);
      setIsCreateDialogOpen(false);
      setNewProject({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        budget: 1000,
      });

      toast({
        title: "Project created",
        description: `"${createdProject.title}" has been created successfully`,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadProjects();

    // Set up real-time subscription
    const unsubscribe = subscribeToKanbanUpdates((updatedProjects) => {
      setProjects(updatedProjects);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !boardRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    const columnElements = boardRef.current.children;
    tl.fromTo(
      columnElements,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.3",
    );
  }, [loading]);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getProjectsByStatus = (status: string) => {
    return filteredProjects.filter((project) => project.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-festival-pink bg-festival-pink/10";
      case "medium":
        return "border-festival-orange bg-festival-orange/10";
      case "low":
        return "border-festival-yellow bg-festival-yellow/10";
      default:
        return "border-gray-400 bg-gray-50";
    }
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return 30;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedItem(projectId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const oldProject = projects.find((p) => p.id === draggedItem);
    if (!oldProject || oldProject.status === newStatus) return;

    try {
      // Optimistic update
      setProjects((prev) =>
        prev.map((project) =>
          project.id === draggedItem
            ? { ...project, status: newStatus as KanbanProject["status"] }
            : project,
        ),
      );

      // Animate the card movement
      const draggedElement = document.querySelector(
        `[data-project-id="${draggedItem}"]`,
      );
      if (draggedElement) {
        gsap.to(draggedElement, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }

      // Update in database
      await kanbanApi.updateProjectStatus(
        draggedItem,
        newStatus as KanbanProject["status"],
      );

      toast({
        title: "Status updated",
        description: `Project moved to ${newStatus.replace("-", " ")}`,
      });
    } catch (error) {
      console.error("Error updating project status:", error);
      // Revert optimistic update
      setProjects((prev) =>
        prev.map((project) =>
          project.id === draggedItem
            ? { ...project, status: oldProject.status }
            : project,
        ),
      );

      toast({
        title: "Error updating status",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    }

    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-festival-orange" />
          <p className="text-lg font-medium text-black">
            Loading projects from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            PROJECT KANBAN
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Drag and drop to manage project workflow • {projects.length} total
            projects
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-12 h-12 border-4 border-black bg-white w-64"
            />
          </div>

          <Button
            onClick={loadProjects}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  Create New Project
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter project title..."
                    className="border-2 border-black"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Project description..."
                    className="border-2 border-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newProject.category}
                      onChange={(e) =>
                        setNewProject((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="e.g., web design, logo"
                      className="border-2 border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newProject.priority}
                      onValueChange={(value) =>
                        setNewProject((prev) => ({
                          ...prev,
                          priority: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className="border-2 border-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        budget: parseInt(e.target.value) || 1000,
                      }))
                    }
                    className="border-2 border-black"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-2 border-black"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    className="bg-festival-orange hover:bg-festival-amber border-2 border-black"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <div
        ref={boardRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 min-h-screen"
      >
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div
              className={`p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-r ${column.color} mb-4`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white text-lg">
                  {column.title}
                </h3>
                <Badge className="bg-black text-white border-2 border-white">
                  {getProjectsByStatus(column.id).length}
                </Badge>
              </div>
            </div>

            {/* Project Cards */}
            <div className="space-y-4 flex-1">
              {getProjectsByStatus(column.id).map((project) => {
                const daysUntilDue = getDaysUntilDue(project.dueDate);
                const isOverdue = daysUntilDue < 0;
                const isUrgent = daysUntilDue <= 2 && daysUntilDue >= 0;

                return (
                  <Card
                    key={project.id}
                    data-project-id={project.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project.id)}
                    className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-move hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ${getPriorityColor(project.priority)}`}
                  >
                    <div className="p-4">
                      {/* Project Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-black text-sm line-clamp-2 flex-1">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            onClick={() =>
                              navigate(`/admin/projects/${project.id}`)
                            }
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 border-2 border-black"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Client & Designer */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs">
                          <User className="w-3 h-3 text-black/60" />
                          <span className="text-black/70 font-medium">
                            {project.clientName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-festival-orange rounded-full" />
                          <span className="text-black/70 font-medium">
                            {project.designerName}
                          </span>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-black/60" />
                            <span
                              className={`font-medium ${
                                isOverdue
                                  ? "text-red-600"
                                  : isUrgent
                                    ? "text-orange-600"
                                    : "text-black/70"
                              }`}
                            >
                              {isOverdue
                                ? `${Math.abs(daysUntilDue)}d overdue`
                                : isUrgent
                                  ? `${daysUntilDue}d left`
                                  : `${daysUntilDue}d left`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-black/60" />
                            <span className="text-black/70 font-medium">
                              ${project.budget}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-black/20 border border-black rounded-none overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${
                              project.status === "new"
                                ? "from-blue-400 to-blue-500"
                                : project.status === "in-progress"
                                  ? "from-yellow-400 to-yellow-500"
                                  : project.status === "needs-feedback"
                                    ? "from-orange-400 to-orange-500"
                                    : project.status === "completed"
                                      ? "from-green-400 to-green-500"
                                      : "from-gray-400 to-gray-500"
                            } transition-all duration-300`}
                            style={{
                              width:
                                project.actualHours && project.estimatedHours
                                  ? `${Math.min((project.actualHours / project.estimatedHours) * 100, 100)}%`
                                  : project.status === "new"
                                    ? "10%"
                                    : project.status === "in-progress"
                                      ? "40%"
                                      : project.status === "needs-feedback"
                                        ? "75%"
                                        : project.status === "completed"
                                          ? "100%"
                                          : "60%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Priority Badge and Stats */}
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`text-xs font-bold border-2 border-black ${
                            project.priority === "urgent"
                              ? "bg-red-500 text-white"
                              : project.priority === "high"
                                ? "bg-festival-pink text-white"
                                : project.priority === "medium"
                                  ? "bg-festival-orange text-black"
                                  : "bg-festival-yellow text-black"
                          }`}
                        >
                          {project.priority.toUpperCase()}
                        </Badge>

                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="border-2 border-black text-xs"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {project.timeline.length}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-2 border-black text-xs"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {
                              project.tasks.filter(
                                (t) => t.status === "completed",
                              ).length
                            }
                            /{project.tasks.length}
                          </Badge>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className="text-xs border border-black/30"
                        >
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Add New Card Button */}
              <Card
                onClick={() => setIsCreateDialogOpen(true)}
                className="border-4 border-dashed border-black/30 bg-festival-cream/50 hover:bg-festival-cream hover:border-black transition-all duration-200 cursor-pointer"
              >
                <div className="p-6 text-center">
                  <Plus className="w-8 h-8 text-black/50 mx-auto mb-2" />
                  <p className="text-sm font-medium text-black/70">
                    Add Project
                  </p>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectKanban;
