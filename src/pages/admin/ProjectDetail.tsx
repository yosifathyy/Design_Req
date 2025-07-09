import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminProjects } from "@/lib/api";
import {
  ArrowLeft,
  Edit,
  User,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projects = await getAdminProjects();
        const foundProject = projects.find((p: any) => p.id === id);

        if (!foundProject) {
          setError("Project not found");
          return;
        }

        setProject(foundProject);
      } catch (err: any) {
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  useEffect(() => {
    if (!containerRef.current || loading) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "delivered":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-red-600";
      case "medium":
        return "from-yellow-500 to-orange-500";
      case "low":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-festival-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-black">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-4 border-red-500 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] bg-white p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-black mb-2">
            Project Not Found
          </h3>
          <p className="text-black/70 mb-6">
            {error || "The requested project could not be found."}
          </p>
          <Button
            onClick={() => navigate("/admin/projects")}
            className="bg-red-500 hover:bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin/projects")}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-black">
              {project.title}
            </h1>
            <p className="text-black/70">Project ID: {project.id}</p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
          className="bg-gradient-to-r from-festival-orange to-festival-coral border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <div className="flex items-center gap-3">
                {getStatusIcon(project.status)}
                <h3 className="text-xl font-bold text-black">
                  Project Overview
                </h3>
                <Badge
                  className={`${getStatusColor(project.status)} text-white border-2 border-black`}
                >
                  {project.status.replace("-", " ").toUpperCase()}
                </Badge>
                {project.priority && (
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${getPriorityColor(project.priority)}`}
                    title={`Priority: ${project.priority}`}
                  />
                )}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-black mb-2">Description</h4>
                <p className="text-black/70 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-black mb-2">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/60">Category:</span>
                      <span className="font-medium text-black">
                        {project.category || "General"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Priority:</span>
                      <span className="font-medium text-black">
                        {project.priority || "Medium"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Price:</span>
                      <span className="font-medium text-black">
                        ${project.price || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-black mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/60">Created:</span>
                      <span className="font-medium text-black">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Last Updated:</span>
                      <span className="font-medium text-black">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Files Section */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-xl font-bold text-black">Project Files</h3>
            </div>
            <div className="p-6">
              {project.files && project.files.length > 0 ? (
                <div className="space-y-3">
                  {project.files.map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-festival-cream border-2 border-black"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-black/60" />
                        <div>
                          <p className="font-medium text-black">{file.name}</p>
                          <p className="text-xs text-black/60">
                            {file.type} • {(file.size / 1024).toFixed(1)}KB
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => window.open(file.url, "_blank")}
                        variant="outline"
                        size="sm"
                        className="border-2 border-black"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-black/30" />
                  <p className="text-black/60">No files uploaded yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Project Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-lg font-bold text-black">Project Team</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-black/60 mb-2">Client</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-festival-pink border-2 border-black rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="font-medium text-black">
                      {project.client?.name || "Unknown Client"}
                    </p>
                    <p className="text-xs text-black/60">
                      {project.client?.email || "No email"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-black/60 mb-2">Designer</p>
                {project.designer ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        {project.designer.name}
                      </p>
                      <p className="text-xs text-black/60">
                        {project.designer.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-gray-300 rounded">
                    <div className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-gray-600">No designer assigned</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-lg font-bold text-black">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <Button
                onClick={() => navigate(`/admin/chat/${project.id}`)}
                variant="outline"
                className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Chat
              </Button>

              <Button
                onClick={() =>
                  navigate(`/admin/invoices/create?project=${project.id}`)
                }
                variant="outline"
                className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>

              <Button
                onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                className="w-full bg-gradient-to-r from-festival-orange to-festival-coral border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
