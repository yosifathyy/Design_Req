import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminPermissions } from "@/lib/admin-data";
import {
  Shield,
  Settings,
  Users,
  FileText,
  BarChart3,
  CreditCard,
} from "lucide-react";

const PermissionsManagement: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "users":
        return <Users className="w-5 h-5" />;
      case "projects":
        return <FileText className="w-5 h-5" />;
      case "invoices":
        return <CreditCard className="w-5 h-5" />;
      case "analytics":
        return <BarChart3 className="w-5 h-5" />;
      case "system":
        return <Settings className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "users":
        return "from-festival-orange to-festival-coral";
      case "projects":
        return "from-festival-pink to-festival-magenta";
      case "invoices":
        return "from-festival-yellow to-festival-amber";
      case "analytics":
        return "from-blue-400 to-blue-500";
      case "system":
        return "from-purple-400 to-purple-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const permissionsByCategory = adminPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, typeof adminPermissions>,
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-black mb-2">
          PERMISSIONS MANAGEMENT
        </h1>
        <p className="text-xl text-black/70 font-medium">
          Configure role-based access controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(permissionsByCategory).map(
          ([category, permissions]) => (
            <Card
              key={category}
              className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white"
            >
              <div
                className={`p-4 border-b-4 border-black bg-gradient-to-r ${getCategoryColor(category)}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black rounded border-2 border-black">
                    {getIconForCategory(category)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">
                      {category.toUpperCase()}
                    </h3>
                    <Badge className="bg-black text-white border-2 border-white">
                      {permissions.length} permissions
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="p-3 bg-festival-cream border-2 border-black"
                  >
                    <h4 className="font-bold text-black text-sm mb-1">
                      {permission.name}
                    </h4>
                    <p className="text-xs text-black/70">
                      {permission.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ),
        )}
      </div>
    </div>
  );
};

export default PermissionsManagement;
