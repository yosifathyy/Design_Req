import React, { useEffect, useState } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import AdminDashboardFixer from "@/components/AdminDashboardFixer";
import {
  Users,
  FolderKanban,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Shield,
  Eye,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalChats: number;
  totalMessages: number;
  totalInvoices: number;
  recentUsers: any[];
  recentProjects: any[];
  recentMessages: any[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    profile?.role === "admin" ||
    profile?.role === "super-admin" ||
    user?.email === "admin@demo.com";

  const loadDashboardData = async () => {
    if (!user || !isAdmin) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading admin dashboard for:", user.email);

      // Load all data in parallel
      const [
        usersResult,
        projectsResult,
        chatsResult,
        messagesResult,
        invoicesResult,
      ] = await Promise.allSettled([
        supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("design_requests")
          .select(
            `
            *,
            user:users!user_id(name, email),
            designer:users!designer_id(name, email)
          `,
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("chats")
          .select(
            `
            *,
            request:design_requests!request_id(title)
          `,
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("messages")
          .select(
            `
            *,
            sender:users!sender_id(name, email)
          `,
          )
          .order("created_at", { ascending: false })
          .limit(20),

        supabase
          .from("invoices")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      // Extract data from results
      const users =
        usersResult.status === "fulfilled" ? usersResult.value.data || [] : [];
      const projects =
        projectsResult.status === "fulfilled"
          ? projectsResult.value.data || []
          : [];
      const chats =
        chatsResult.status === "fulfilled" ? chatsResult.value.data || [] : [];
      const messages =
        messagesResult.status === "fulfilled"
          ? messagesResult.value.data || []
          : [];
      const invoices =
        invoicesResult.status === "fulfilled"
          ? invoicesResult.value.data || []
          : [];

      // Log any errors
      [
        usersResult,
        projectsResult,
        chatsResult,
        messagesResult,
        invoicesResult,
      ].forEach((result, index) => {
        const names = ["users", "projects", "chats", "messages", "invoices"];
        if (result.status === "rejected") {
          console.error(`❌ ${names[index]} failed:`, result.reason);
        } else {
          console.log(
            `✅ ${names[index]}:`,
            result.value.data?.length || 0,
            "items",
          );
        }
      });

      const dashboardStats: DashboardStats = {
        totalUsers: users.length,
        totalProjects: projects.length,
        totalChats: chats.length,
        totalMessages: messages.length,
        totalInvoices: invoices.length,
        recentUsers: users.slice(0, 5),
        recentProjects: projects.slice(0, 5),
        recentMessages: messages.slice(0, 10),
      };

      setStats(dashboardStats);
      console.log("✅ Dashboard data loaded successfully:", dashboardStats);
    } catch (err: any) {
      console.error("❌ Failed to load dashboard:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, isAdmin]);

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      console.log("❌ Non-admin user detected, redirecting...");
      navigate("/design-dashboard");
    }
  }, [user, isAdmin, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="border-4 border-red-500 bg-red-50 p-8 max-w-md">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600 mb-4">Admin privileges required.</p>
            <Button
              onClick={() => navigate("/design-dashboard")}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
          <Badge className="bg-green-500 text-white">
            Welcome {user.email}
          </Badge>
        </div>
        <AdminDashboardFixer />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-festival-orange" />
            <span className="text-lg">Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
        <AdminDashboardFixer />
        <Card className="border-4 border-red-500 bg-red-50 p-6">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Dashboard Error
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={loadDashboardData}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
        <AdminDashboardFixer />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
          <p className="text-xl text-black/70">
            Welcome back, {user.email}! 👋
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-500 text-white">ADMIN ACCESS</Badge>
          <Button
            onClick={loadDashboardData}
            variant="outline"
            size="sm"
            className="border-2 border-black"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-4 border-black bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/70">Total Users</p>
              <p className="text-3xl font-bold text-black">
                {stats.totalUsers}
              </p>
            </div>
            <Users className="w-8 h-8 text-black" />
          </div>
          <Button
            onClick={() => navigate("/admin/users")}
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-black hover:bg-black/10"
          >
            Manage Users <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="border-4 border-black bg-gradient-to-br from-festival-pink to-festival-magenta p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/70">Projects</p>
              <p className="text-3xl font-bold text-black">
                {stats.totalProjects}
              </p>
            </div>
            <FolderKanban className="w-8 h-8 text-black" />
          </div>
          <Button
            onClick={() => navigate("/admin/projects")}
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-black hover:bg-black/10"
          >
            View Projects <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="border-4 border-black bg-gradient-to-br from-festival-blue to-festival-purple p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/70">Chat Rooms</p>
              <p className="text-3xl font-bold text-black">
                {stats.totalChats}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-black" />
          </div>
          <Button
            onClick={() => navigate("/admin/chat")}
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-black hover:bg-black/10"
          >
            View Chats <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="border-4 border-black bg-gradient-to-br from-festival-yellow to-festival-orange p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/70">Messages</p>
              <p className="text-3xl font-bold text-black">
                {stats.totalMessages}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-black" />
          </div>
          <Button
            onClick={() => navigate("/admin/chat")}
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-black hover:bg-black/10"
          >
            Monitor <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="border-4 border-black bg-gradient-to-br from-festival-green to-festival-teal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/70">Invoices</p>
              <p className="text-3xl font-bold text-black">
                {stats.totalInvoices}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-black" />
          </div>
          <Button
            onClick={() => navigate("/admin/invoices")}
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-black hover:bg-black/10"
          >
            View Invoices <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="border-4 border-black bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Users
            </h3>
            <Button
              onClick={() => navigate("/admin/users")}
              variant="outline"
              size="sm"
              className="border-2 border-black"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-festival-cream rounded border-2 border-black"
                >
                  <div>
                    <p className="font-medium text-black">
                      {user.name || user.email}
                    </p>
                    <p className="text-sm text-black/70">{user.email}</p>
                  </div>
                  <Badge
                    className={
                      user.role === "admin" ? "bg-red-500" : "bg-blue-500"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-black/50 text-center py-4">No users found</p>
            )}
          </div>
        </Card>

        {/* Recent Projects */}
        <Card className="border-4 border-black bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
              <FolderKanban className="w-5 h-5" />
              Recent Projects
            </h3>
            <Button
              onClick={() => navigate("/admin/projects")}
              variant="outline"
              size="sm"
              className="border-2 border-black"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentProjects.length > 0 ? (
              stats.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-festival-cream rounded border-2 border-black"
                >
                  <div>
                    <p className="font-medium text-black">{project.title}</p>
                    <p className="text-sm text-black/70">
                      Client: {project.user?.name || project.user?.email}
                    </p>
                  </div>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-black/50 text-center py-4">
                No projects found
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card className="border-4 border-black bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-black flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Messages ({stats.totalMessages} total)
          </h3>
          <Button
            onClick={() => navigate("/admin/chat")}
            variant="outline"
            size="sm"
            className="border-2 border-black"
          >
            Monitor All Chats
          </Button>
        </div>
        <div className="space-y-3">
          {stats.recentMessages.length > 0 ? (
            stats.recentMessages.map((message) => (
              <div
                key={message.id}
                className="p-3 bg-festival-cream rounded border-2 border-black"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-black">
                      {message.sender?.name ||
                        message.sender?.email ||
                        "Unknown User"}
                    </p>
                    <p className="text-sm text-black/80 mt-1">
                      {message.text?.substring(0, 100)}
                      {message.text?.length > 100 ? "..." : ""}
                    </p>
                  </div>
                  <p className="text-xs text-black/50 ml-2">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black/50 text-center py-8">No messages found</p>
          )}
        </div>
      </Card>

      {/* Admin Data Debug */}
      <AdminDashboardFixer />
    </div>
  );
};

export default AdminDashboard;
