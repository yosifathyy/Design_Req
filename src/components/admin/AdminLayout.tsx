import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  LayoutDashboard,
  RefreshCw,
  Home,
} from "lucide-react";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "System Status",
      message: "All systems operational",
      type: "success" as const,
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "New User Registration",
      message: "2 new users registered today",
      type: "info" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
  ]);

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const layoutRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  const isAdmin =
    user?.email === "admin@demo.com" ||
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    profile?.role === "admin" ||
    profile?.role === "super-admin";

  const currentUser = {
    name: profile?.name || user?.email?.split("@")[0] || "Admin User",
    role: profile?.role || user?.role || "admin",
    lastLogin: profile?.last_login || new Date().toISOString(),
  };

  const unreadAlerts = notifications.filter((n) => !n.read).length;

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/dashboard") return "Dashboard";
    if (path.includes("/admin/users")) return "User Management";
    if (path.includes("/admin/projects")) return "Project Management";
    if (path.includes("/admin/chat")) return "Chat Management";
    if (path.includes("/admin/invoices")) return "Invoice Management";
    if (path.includes("/admin/analytics")) return "Analytics";
    if (path.includes("/admin/content")) return "Content Management";
    if (path.includes("/admin/settings")) return "System Settings";
    if (path.includes("/admin/alerts")) return "System Alerts";
    if (path.includes("/admin/audit")) return "Audit Logs";
    return "Admin Panel";
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Admin", href: "/admin" }];

    if (parts.length > 1) {
      let currentPath = "";
      for (let i = 1; i < parts.length; i++) {
        currentPath += `/${parts[i]}`;
        const fullPath = `/admin${currentPath}`;
        let label = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        if (parts[i] === "kanban") label = "Kanban Board";
        if (parts[i] === "create") label = "Create New";
        breadcrumbs.push({ label, href: fullPath });
      }
    }

    return breadcrumbs;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

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
  }, [location.pathname]);

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

  const handleQuickSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Quick navigation based on search
      const query = searchQuery.toLowerCase();
      if (query.includes("user")) navigate("/admin/users");
      else if (query.includes("project")) navigate("/admin/projects");
      else if (query.includes("chat")) navigate("/admin/chat");
      else if (query.includes("invoice")) navigate("/admin/invoices");
      else if (query.includes("analytic")) navigate("/admin/analytics");
      else if (query.includes("setting")) navigate("/admin/settings");
    }
  };

  // Auto-redirect to admin dashboard for admin users on login
  useEffect(() => {
    if (!authLoading && user && isAdmin && location.pathname === "/") {
      console.log("🚀 Admin user detected, redirecting to admin dashboard...");
      navigate("/admin");
    }
  }, [authLoading, user, isAdmin, navigate, location.pathname]);

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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-festival-cream via-festival-orange/20 to-festival-pink/20">
        <div className="text-center bg-white p-8 border-8 border-black shadow-[12px_12px_0px_0px_#000]">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-festival-orange" />
          <h2 className="text-2xl font-black text-black mb-2">LOADING ADMIN</h2>
          <p className="text-lg font-bold text-gray-700">
            Neubrutalism Admin Panel
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-500 to-purple-500">
        <div className="text-center max-w-md p-8 bg-white border-8 border-black shadow-[16px_16px_0px_0px_#000]">
          <Shield className="w-20 h-20 mx-auto mb-6 text-red-500" />
          <h2 className="text-3xl font-black text-black mb-4">
            ACCESS DENIED!
          </h2>
          <p className="text-lg font-bold text-gray-700 mb-6">
            ADMIN ONLY ZONE
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-red-500 hover:bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] text-lg font-black py-3"
            >
              <Home className="w-5 h-5 mr-2" />
              GO HOME
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
      className="h-screen bg-gradient-to-br from-festival-cream via-festival-orange/10 to-festival-pink/10 flex overflow-hidden"
    >
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={currentUser.role}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Enhanced Header */}
        <header
          ref={headerRef}
          className="bg-white border-b-8 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] p-4"
        >
          {/* Top Header Row */}
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Page Title & Breadcrumbs */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-black text-black mb-1">
                🚀 {getPageTitle().toUpperCase()}
              </h1>
              <nav className="flex items-center gap-2 text-sm">
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <span className="text-black/50">/</span>}
                    <button
                      onClick={() => navigate(crumb.href)}
                      className={`font-bold hover:text-festival-orange transition-colors ${
                        index === getBreadcrumbs().length - 1
                          ? "text-festival-orange"
                          : "text-black/70 hover:text-black"
                      }`}
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* System Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-green-100 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-black text-black text-sm">
                  ALL SYSTEMS ONLINE
                </span>
              </div>

              {/* Quick Actions */}
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                size="sm"
                className="border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 font-black"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                DASHBOARD
              </Button>
            </div>
          </div>

          {/* Search & Actions Row */}
          <div className="flex items-center gap-4">
            {/* Enhanced Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleQuickSearch}
                placeholder="Quick search... (users, projects, chat, etc.)"
                className="pl-12 h-12 border-4 border-black bg-white font-bold text-black placeholder:text-black/50 shadow-[4px_4px_0px_0px_#000] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="outline"
                size="sm"
                className="relative border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 font-black"
              >
                <Bell className="w-4 h-4" />
                {unreadAlerts > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-festival-orange text-black border-2 border-black w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-black">
                    {unreadAlerts}
                  </Badge>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-14 w-80 max-h-96 overflow-y-auto bg-white border-8 border-black shadow-[8px_8px_0px_0px_#000] z-50">
                  <div className="p-4">
                    <h3 className="font-black text-xl text-black mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      NOTIFICATIONS
                    </h3>
                    {notifications.length > 0 ? (
                      <div className="space-y-3">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 border-4 border-black cursor-pointer transition-all ${
                              notif.read
                                ? "bg-gray-100"
                                : "bg-festival-yellow/50 shadow-[4px_4px_0px_0px_#000]"
                            }`}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-3 h-3 border-2 border-black mt-2 ${
                                  notif.type === "error"
                                    ? "bg-red-500"
                                    : notif.type === "warning"
                                      ? "bg-yellow-500"
                                      : notif.type === "success"
                                        ? "bg-green-500"
                                        : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="flex-1">
                                <p className="font-black text-sm text-black">
                                  {notif.title}
                                </p>
                                <p className="text-xs font-bold text-gray-700 mt-1">
                                  {notif.message}
                                </p>
                                <p className="text-xs font-bold text-gray-500 mt-2">
                                  {notif.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4 font-bold">
                        NO NOTIFICATIONS
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000]">
              <div className="w-8 h-8 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                <span className="text-sm font-black text-black">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="font-black text-black text-sm">
                    {currentUser.name}
                  </span>
                  <Badge
                    className={`${getRoleColor(currentUser.role)} text-white border-2 border-black text-xs flex items-center gap-1 font-black`}
                  >
                    {getRoleIcon(currentUser.role)}
                    {currentUser.role.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                disabled={signingOut}
                variant="outline"
                size="sm"
                className="border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 p-2 font-black"
              >
                {signingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="admin-content flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
};
