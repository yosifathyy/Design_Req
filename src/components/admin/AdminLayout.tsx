import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, LogOut, Zap, Shield, Home } from "lucide-react";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const layoutRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!layoutRef.current) return;

    gsap.fromTo(
      layoutRef.current.querySelector(".admin-content"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
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
          <div className="w-24 h-24 mx-auto mb-4">
            <Lottie
              animationData={null}
              style={{ width: "100%", height: "100%" }}
              loop
              autoplay
              src="https://lottie.host/fccfcd96-8f23-49b8-a071-f22ce1205e7b/5R6Z7g0o0E.json"
            />
          </div>
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
        {/* Main Content Area */}
        <main className="admin-content flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
