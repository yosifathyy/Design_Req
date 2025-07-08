import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockAdminProjects } from "@/lib/admin-data";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

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
          <Button variant="outline" className="border-4 border-black">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            placeholder="Search projects..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        {mockAdminProjects.map((project) => (
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
                  <Badge
                    className={`${getPriorityColor(project.priority)} text-white border-2 border-black`}
                  >
                    {project.priority.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Client: {project.clientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Designer: {project.designerName || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-black/60" />
                    <span className="text-black/70">
                      Budget: ${project.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-black/70">
                      Progress: {project.actualHours || 0}h /{" "}
                      {project.estimatedHours || 0}h
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
