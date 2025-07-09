import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  getAdminProjects,
  updateProjectStatus,
  assignProjectToDesigner,
  getAdminUsers,
  updateDesignRequest,
} from "@/lib/api";
import {
  ArrowLeft,
  Save,
  User,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Settings,
  AlertCircle,
} from "lucide-react";

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    designer_id: "",
    price: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData, usersData] = await Promise.all([
          getAdminProjects(),
          getAdminUsers(),
        ]);

        const foundProject = projectsData.find((p: any) => p.id === id);
        if (!foundProject) {
          setError("Project not found");
          return;
        }

        setProject(foundProject);
        setUsers(
          usersData.filter(
            (u: any) => u.role === "designer" || u.role === "admin",
          ),
        );
        setFormData({
          title: foundProject.title || "",
          description: foundProject.description || "",
          status: foundProject.status || "",
          priority: foundProject.priority || "medium",
          designer_id: foundProject.designer_id || "",
          price: foundProject.price || 0,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
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

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare the updates object with all changed fields
      const updates: any = {};

      if (formData.title !== project.title) {
        updates.title = formData.title;
      }

      if (formData.description !== project.description) {
        updates.description = formData.description;
      }

      if (formData.status !== project.status) {
        updates.status = formData.status;
      }

      if (formData.priority !== project.priority) {
        updates.priority = formData.priority;
      }

      if (formData.designer_id !== project.designer_id) {
        updates.designer_id = formData.designer_id;
      }

      if (formData.price !== project.price) {
        updates.price = formData.price;
      }

      // Always update the updated_at timestamp
      updates.updated_at = new Date().toISOString();

      // Update the project with all changes at once
      if (Object.keys(updates).length > 1) {
        // More than just updated_at
        await updateDesignRequest(project.id, updates);
      }

      // Show success and redirect
      navigate("/admin/projects");
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

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
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-black">
              Edit Project
            </h1>
            <p className="text-black/70">Project ID: {project.id}</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-festival-orange to-festival-coral border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-4 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-xl font-bold text-black">Project Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-bold text-black">
                  Project Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="border-4 border-black bg-white"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-bold text-black"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border-4 border-black bg-white min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="status"
                    className="text-sm font-bold text-black"
                  >
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border-4 border-black bg-white font-medium"
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="priority"
                    className="text-sm font-bold text-black"
                  >
                    Priority
                  </Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border-4 border-black bg-white font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="designer"
                    className="text-sm font-bold text-black"
                  >
                    Assigned Designer
                  </Label>
                  <select
                    id="designer"
                    value={formData.designer_id}
                    onChange={(e) =>
                      setFormData({ ...formData, designer_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border-4 border-black bg-white font-medium"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="price"
                    className="text-sm font-bold text-black"
                  >
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="border-4 border-black bg-white"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Project Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-lg font-bold text-black">Project Info</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Status</span>
                <Badge
                  className={`${getStatusColor(project.status)} text-white border-2 border-black`}
                >
                  {project.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Priority</span>
                <div
                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${getPriorityColor(project.priority)}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Client</span>
                <span className="text-sm font-medium text-black">
                  {project.client?.name || "Unknown"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Designer</span>
                <span className="text-sm font-medium text-black">
                  {project.designer?.name || "Unassigned"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Created</span>
                <span className="text-sm text-black/70">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Updated</span>
                <span className="text-sm text-black/70">
                  {new Date(project.updated_at).toLocaleDateString()}
                </span>
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
