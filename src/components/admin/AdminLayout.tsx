
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
  const [signingOut, setSigningOut] = useState(false);

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const layoutRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  const isAdmin =
    user?.email === "admin@demo.com" ||
    profile?.role === "admin" ||
    profile?.role === "super-admin";

  const currentUser = {
    name: profile?.name || user?.email || "Admin User",
    role: profile?.role || "admin",
    lastLogin: profile?.last_login || new Date().toISOString(),
  };

  const unreadAlerts = 0; // Simplified for now

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

  const handleLogout = async () => {
    if (signingOut) return;

    try {
      setSigningOut(true);
      
      // Add logout animation
      if (layoutRef.current) {
        gsap.to(layoutRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      // Actually sign out the user
      await signOut();
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin panel",
      });

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setSigningOut(false);
      
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });

      // Reset layout opacity if sign out failed
      if (layoutRef.current) {
        gsap.to(layoutRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      console.log(
        "❌ Non-admin user trying to access admin area, redirecting...",
      );
      navigate("/design-dashboard");
    }
  }, [authLoading, user, isAdmin, navigate]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-festival-cream">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-festival-orange" />
          <p className="text-lg font-medium text-black">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-festival-cream">
        <div className="text-center max-w-md p-8 bg-white border-4 border-red-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600 mb-6">
            Admin privileges required to access this area.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/admin-setup")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Setup Admin Account
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-2 border-gray-300"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              <Button
                variant="outline"
                size="sm"
                className="relative border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                onClick={() => navigate("/admin/alerts")}
              >
                <Bell className="w-4 h-4" />
                {unreadAlerts > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-festival-orange text-black border-2 border-black w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {unreadAlerts}
                  </Badge>
                )}
              </Button>

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
                  disabled={signingOut}
                  variant="outline"
                  size="sm"
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  {signingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
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
    </div>
  );
};
