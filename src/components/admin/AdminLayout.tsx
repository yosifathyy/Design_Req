import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Zap,
  Shield,
  Loader2,
} from "lucide-react";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser] = useState(mockAdminUsers[0]); // Simulate logged-in admin user

  const navigate = useNavigate();
  const layoutRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const unreadAlerts = mockSystemAlerts.filter((alert) => !alert.isRead).length;

  useEffect(() => {
    if (!layoutRef.current || !headerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
    );

    tl.fromTo(
      layoutRef.current.querySelector(".admin-content"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2",
    );
  }, []);

  const handleLogout = () => {
    // Add logout animation
    gsap.to(layoutRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        navigate("/login");
      },
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super-admin":
        return "bg-festival-magenta";
      case "admin":
        return "bg-festival-orange";
      case "designer":
        return "bg-festival-pink";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super-admin":
        return <Shield className="w-3 h-3" />;
      case "admin":
        return <Settings className="w-3 h-3" />;
      case "designer":
        return <Zap className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  return (
    <div
      ref={layoutRef}
      className="h-screen bg-festival-cream flex overflow-hidden"
    >
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={currentUser.role}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          ref={headerRef}
          className="bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] p-4"
        >
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, projects, invoices..."
                className="w-full pl-12 pr-4 py-2 border-4 border-black bg-festival-cream text-black placeholder-black/50 font-medium focus:outline-none focus:ring-2 focus:ring-festival-orange"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* System Status */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 border-2 border-black rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-black">
                  All Systems Operational
                </span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button
                  onClick={() => setShowNotifications(!showNotifications)}
                  variant="outline"
                  size="sm"
                  className="relative border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  <Bell className="w-4 h-4" />
                  {unreadAlerts > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-festival-orange text-black border-2 border-black w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {unreadAlerts}
                    </Badge>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
                    <div className="p-4 border-b-2 border-black">
                      <h3 className="font-bold text-black">System Alerts</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockSystemAlerts.slice(0, 5).map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 border-b border-black/10 hover:bg-festival-cream cursor-pointer ${
                            !alert.isRead ? "bg-festival-yellow/20" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                alert.type === "error"
                                  ? "bg-red-500"
                                  : alert.type === "warning"
                                    ? "bg-yellow-500"
                                    : alert.type === "success"
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-black">
                                {alert.title}
                              </h4>
                              <p className="text-xs text-black/70">
                                {alert.message}
                              </p>
                              <span className="text-xs text-black/50">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t-2 border-black">
                      <Button
                        onClick={() => navigate("/admin/alerts")}
                        variant="outline"
                        size="sm"
                        className="w-full border-2 border-black"
                      >
                        View All Alerts
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3 px-3 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-8 h-8 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-black">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">
                      {currentUser.name}
                    </span>
                    <Badge
                      className={`${getRoleColor(currentUser.role)} text-white border-2 border-black text-xs flex items-center gap-1`}
                    >
                      {getRoleIcon(currentUser.role)}
                      {currentUser.role.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-black/60">
                    Last login:{" "}
                    {new Date(currentUser.lastLogin).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="admin-content flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};
