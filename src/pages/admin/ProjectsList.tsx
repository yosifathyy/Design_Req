import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminProjects } from "@/lib/api";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  User,
  RefreshCw,
  Plus,
} from "lucide-react";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getAdminProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.designer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const refreshProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getAdminProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to refresh projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "needs-feedback":
        return "bg-orange-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-festival-pink";
      case "medium":
        return "bg-festival-orange";
      case "low":
        return "bg-festival-yellow";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            ALL PROJECTS
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Complete project overview and management
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={refreshProjects}
            variant="outline"
            className="border-4 border-black"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => navigate("/admin/projects/create")}
            className="bg-gradient-to-r from-festival-orange to-festival-coral border-4 border-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, clients, designers..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border-4 border-black bg-white font-medium"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-festival-orange" />
            <p className="text-lg font-medium text-black">Loading projects...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold text-black mb-2">
            {searchQuery || statusFilter !== "all" ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-black/70 mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"
            }
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button
              onClick={() => navigate("/admin/projects/create")}
              className="bg-gradient-to-r from-festival-orange to-festival-coral border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Project
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-black">
                    {project.title}
                  </h3>
                  <Badge
                    className={`${getStatusColor(project.status)} text-white border-2 border-black`}
                  >
                    {project.status.replace("-", " ").toUpperCase()}
                  </Badge>
                  {project.priority && (
                    <Badge
                      className={`${getPriorityColor(project.priority)} text-white border-2 border-black`}
                    >
                      {project.priority.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Client: {project.client?.name || "Unknown Client"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Designer: {project.designer?.name || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Price: ${project.price || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-black/70">
                      Status: {project.status?.replace("-", " ")?.toUpperCase() || "UNKNOWN"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/admin/projects/${project.id}`)}
                  variant="outline"
                  size="sm"
                  className="border-4 border-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                  variant="outline"
                  size="sm"
                  className="border-4 border-black"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;