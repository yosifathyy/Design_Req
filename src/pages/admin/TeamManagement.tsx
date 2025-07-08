import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAdminUsers } from "@/lib/admin-data";
import { Users, Plus, Settings, Zap, Shield } from "lucide-react";

const TeamManagement: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  const teams = [
    {
      id: "design-team",
      name: "Design Team",
      description: "Creative professionals handling client projects",
      members: mockAdminUsers.filter((u) => u.role === "designer"),
      lead: mockAdminUsers.find((u) => u.role === "designer"),
    },
    {
      id: "admin-team",
      name: "Administrative Team",
      description: "System administrators and managers",
      members: mockAdminUsers.filter((u) =>
        ["admin", "super-admin"].includes(u.role),
      ),
      lead: mockAdminUsers.find((u) => u.role === "super-admin"),
    },
  ];

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            TEAM MANAGEMENT
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Organize and manage team structures
          </p>
        </div>
        <Button className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black">{team.name}</h3>
              <Badge className="bg-festival-orange text-black border-2 border-black">
                {team.members.length} members
              </Badge>
            </div>
            <p className="text-black/70 mb-4">{team.description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-festival-orange" />
                <span className="text-sm font-medium">
                  Lead: {team.lead?.name || "No lead assigned"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {team.members.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-festival-cream p-2 border-2 border-black"
                  >
                    <div className="w-6 h-6 bg-festival-orange rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="text-xs font-medium">{member.name}</span>
                  </div>
                ))}
                {team.members.length > 3 && (
                  <div className="bg-gray-200 p-2 border-2 border-black text-xs">
                    +{team.members.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;
