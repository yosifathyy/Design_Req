import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAdminProjects, mockAdminUsers } from "@/lib/admin-data";
import { UserCheck, Clock, Zap, AlertTriangle } from "lucide-react";

const ProjectAssignments: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  const designers = mockAdminUsers.filter((user) => user.role === "designer");
  const unassignedProjects = mockAdminProjects.filter((p) => !p.designerId);
  const assignedProjects = mockAdminProjects.filter((p) => p.designerId);

  return (
    <div ref={containerRef} className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-black mb-2">
          PROJECT ASSIGNMENTS
        </h1>
        <p className="text-xl text-black/70 font-medium">
          Manage designer workloads and project assignments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {unassignedProjects.length}
              </p>
              <p className="text-sm font-medium text-black/80">
                Unassigned Projects
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-pink to-festival-magenta p-6">
          <div className="flex items-center gap-4">
            <Zap className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-display font-bold text-white">
                {designers.length}
              </p>
              <p className="text-sm font-medium text-white/80">
                Active Designers
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-green-400 to-green-500 p-6">
          <div className="flex items-center gap-4">
            <UserCheck className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {assignedProjects.length}
              </p>
              <p className="text-sm font-medium text-black/80">
                Assigned Projects
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Designer Workloads */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black">
            <h3 className="text-xl font-bold text-black">Designer Workloads</h3>
          </div>
          <div className="p-6 space-y-4">
            {designers.map((designer) => {
              const assignedCount = assignedProjects.filter(
                (p) => p.designerId === designer.id,
              ).length;
              const workloadPercentage = (assignedCount / 5) * 100; // Assuming max 5 projects per designer

              return (
                <div key={designer.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {designer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="font-medium text-black">
                        {designer.name}
                      </span>
                    </div>
                    <Badge className="bg-festival-cream text-black border-2 border-black">
                      {assignedCount} projects
                    </Badge>
                  </div>
                  <div className="w-full h-3 bg-black/20 border-2 border-black rounded-none overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        workloadPercentage > 80
                          ? "bg-red-500"
                          : workloadPercentage > 60
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Unassigned Projects */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black">
            <h3 className="text-xl font-bold text-black">
              Unassigned Projects
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {unassignedProjects.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-black/70">All projects are assigned!</p>
              </div>
            ) : (
              unassignedProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-festival-cream border-2 border-black"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-black mb-1">
                        {project.title}
                      </h4>
                      <p className="text-sm text-black/70">
                        Client: {project.clientName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-black/60" />
                        <span className="text-xs text-black/60">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-festival-orange border-2 border-black"
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectAssignments;
