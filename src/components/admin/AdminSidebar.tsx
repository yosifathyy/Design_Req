import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { mockSystemAlerts } from "@/lib/admin-data";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageSquare,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Palette,
} from "lucide-react";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: "super-admin" | "admin" | "designer";
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  userRole,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "projects",
    "users",
  ]);

  const unreadAlerts = mockSystemAlerts.filter((alert) => !alert.isRead).length;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      roles: ["super-admin", "admin", "designer"],
    },
    {
      id: "users",
      label: "Users & Teams",
      icon: Users,
      roles: ["super-admin", "admin"],
      children: [
        { label: "All Users", href: "/admin/users" },
        { label: "Team Management", href: "/admin/teams" },
        { label: "Permissions", href: "/admin/permissions" },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
      roles: ["super-admin", "admin", "designer"],
      children: [
        { label: "Kanban Board", href: "/admin/projects/kanban" },
        { label: "All Projects", href: "/admin/projects" },
        { label: "Assignments", href: "/admin/projects/assignments" },
      ],
    },
    {
      id: "chat",
      label: "Communication",
      icon: MessageSquare,
      href: "/admin/chat",
      roles: ["super-admin", "admin", "designer"],
      badge: "3",
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: CreditCard,
      roles: ["super-admin", "admin"],
      children: [
        { label: "All Invoices", href: "/admin/invoices" },
        { label: "Create Invoice", href: "/admin/invoices/create" },
        { label: "Payment Reports", href: "/admin/invoices/reports" },
      ],
    },
    {
      id: "content",
      label: "Content & CMS",
      icon: FileText,
      href: "/admin/content",
      roles: ["super-admin", "admin"],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      roles: ["super-admin", "admin"],
    },
    {
      id: "alerts",
      label: "System Alerts",
      icon: Bell,
      href: "/admin/alerts",
      roles: ["super-admin", "admin"],
      badge: unreadAlerts > 0 ? unreadAlerts.toString() : undefined,
    },
    {
      id: "audit",
      label: "Audit & Logs",
      icon: Shield,
      href: "/admin/audit",
      roles: ["super-admin"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      roles: ["super-admin", "admin"],
    },
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r-4 border-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] transition-all duration-300",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b-4 border-black bg-festival-cream">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-festival-orange border-4 border-black rounded">
                <Palette className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-black">
                  ADMIN PANEL
                </h2>
                <p className="text-xs text-black/70 uppercase tracking-wide">
                  Design Requests
                </p>
              </div>
            </div>
          )}
          <Button
            onClick={onToggleCollapse}
            variant="outline"
            size="sm"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            {isCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedSections.includes(item.id);
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 text-left border-4 border-transparent hover:border-black hover:bg-festival-cream transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <Icon className="w-5 h-5 text-black flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="font-bold text-black flex-1">
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge className="bg-festival-orange text-black border-2 border-black">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-black transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </>
                    )}
                  </button>

                  {!isCollapsed && isExpanded && (
                    <div className="ml-4 space-y-1">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={cn(
                            "flex items-center gap-3 p-2 text-sm border-4 border-transparent hover:border-black hover:bg-festival-cream transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1",
                            isActiveRoute(child.href) &&
                              "border-black bg-festival-orange shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                          )}
                        >
                          <div className="w-2 h-2 bg-black rounded-full" />
                          <span className="font-medium text-black">
                            {child.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.href!}
                className={cn(
                  "flex items-center gap-3 p-3 border-4 border-transparent hover:border-black hover:bg-festival-cream transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1",
                  isActiveRoute(item.href!) &&
                    "border-black bg-festival-orange shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                  isCollapsed && "justify-center",
                )}
              >
                <Icon className="w-5 h-5 text-black flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="font-bold text-black flex-1">
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge className="bg-festival-orange text-black border-2 border-black">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t-4 border-black bg-festival-cream">
        <Button
          onClick={async () => {
            try {
              await signOut();
              console.log("📝 Admin logged out successfully");
              navigate("/");
            } catch (error) {
              console.error("Logout error:", error);
            }
          }}
          variant="outline"
          className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 font-black"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && "LOGOUT"}
        </Button>
      </div>
    </div>
  );
};
