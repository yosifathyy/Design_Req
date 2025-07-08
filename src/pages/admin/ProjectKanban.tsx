import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockAdminProjects, mockAdminUsers } from "@/lib/admin-data";
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
} from "lucide-react";

const ProjectKanban: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState(mockAdminProjects);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

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
  }, []);

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

  const getDaysUntilDue = (dueDate: string) => {
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

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedItem) return;

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

    setProjects((prev) =>
      prev.map((project) =>
        project.id === draggedItem
          ? { ...project, status: newStatus as any }
          : project,
      ),
    );

    setDraggedItem(null);
  };

  const getDesignerName = (designerId?: string) => {
    if (!designerId) return "Unassigned";
    const designer = mockAdminUsers.find((user) => user.id === designerId);
    return designer?.name || "Unknown";
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            PROJECT KANBAN
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Drag and drop to manage project workflow
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
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button
            onClick={() => navigate("/admin/projects/create")}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
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
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 border-2 border-black"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 border-2 border-black"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 border-2 border-black"
                          >
                            <MoreVertical className="w-3 h-3" />
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
                            {getDesignerName(project.designerId)}
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
                                  : "20%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Priority Badge */}
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
                          {project.timeline.length > 0 && (
                            <Badge
                              variant="outline"
                              className="border-2 border-black text-xs"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {project.timeline.length}
                            </Badge>
                          )}
                          {project.tasks.length > 0 && (
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
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Add New Card Button */}
              <Card className="border-4 border-dashed border-black/30 bg-festival-cream/50 hover:bg-festival-cream hover:border-black transition-all duration-200 cursor-pointer">
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
