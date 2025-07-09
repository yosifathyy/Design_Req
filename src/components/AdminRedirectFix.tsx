import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const AdminRedirectFix: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    console.log("AdminRedirectFix - Current user:", user.email);
    console.log("AdminRedirectFix - User role:", user.role);
    console.log("AdminRedirectFix - Profile role:", profile?.role);
    console.log("AdminRedirectFix - Current path:", location.pathname);

    // Check if user is admin
    const isAdmin =
      user.role === "admin" ||
      user.role === "super-admin" ||
      profile?.role === "admin" ||
      profile?.role === "super-admin" ||
      user.email === "admin@demo.com";

    console.log("AdminRedirectFix - Is admin:", isAdmin);

    if (isAdmin) {
      // Admin users should be redirected to admin dashboard
      if (
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/design-dashboard" ||
        location.pathname === "/"
      ) {
        console.log("✅ Redirecting admin to /admin dashboard");
        navigate("/admin", { replace: true });
      }
    } else {
      // Regular users go to design dashboard
      if (
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/"
      ) {
        console.log("✅ Redirecting user to /design-dashboard");
        navigate("/design-dashboard", { replace: true });
      }
    }
  }, [user, profile, location.pathname, navigate]);

  // Show loading state during redirect
  if (user) {
    const isAdmin =
      user.role === "admin" ||
      user.role === "super-admin" ||
      profile?.role === "admin" ||
      profile?.role === "super-admin" ||
      user.email === "admin@demo.com";

    if (
      isAdmin &&
      (location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/design-dashboard" ||
        location.pathname === "/")
    ) {
      return (
        <div className="min-h-screen bg-festival-cream flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-festival-orange mx-auto mb-4"></div>
            <p className="text-lg font-medium text-black">
              Redirecting to Admin Dashboard...
            </p>
            <p className="text-sm text-black/70">Welcome, {user.email}</p>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default AdminRedirectFix;
