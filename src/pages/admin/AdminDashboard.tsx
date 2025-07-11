import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Users,
  FolderKanban,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Eye,
  ArrowRight,
  RefreshCw,
  Loader2,
  Plus,
  BarChart3,
  DollarSign,
  Activity,
  CheckCircle,
  AlertTriangle,
  Globe,
  Server,
  Calendar,
  Clock,
  Zap,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalChats: number;
  totalMessages: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
  recentUsers: any[];
  recentProjects: any[];
  recentActivity: any[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Quick action cards for navigation
  const quickActions = [
    {
      title: "User Management",
      description: "Manage users and permissions",
      icon: <Users className="w-6 h-6" />,
      path: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "Projects",
      description: "View and manage all projects",
      icon: <FolderKanban className="w-6 h-6" />,
      path: "/admin/projects",
      color: "bg-purple-500",
    },
    {
      title: "Chat Management",
      description: "Monitor conversations",
      icon: <MessageSquare className="w-6 h-6" />,
      path: "/admin/chat",
      color: "bg-green-500",
    },
    {
      title: "Invoices",
      description: "Financial management",
      icon: <CreditCard className="w-6 h-6" />,
      path: "/admin/invoices",
      color: "bg-orange-500",
    },
    {
      title: "Analytics",
      description: "Advanced reporting",
      icon: <BarChart3 className="w-6 h-6" />,
      path: "/admin/analytics",
      color: "bg-indigo-500",
    },
    {
      title: "System Settings",
      description: "Configure the platform",
      icon: <Server className="w-6 h-6" />,
      path: "/admin/settings",
      color: "bg-gray-600",
    },
  ];

  const loadDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      console.log("🚀 Loading admin dashboard data...");

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
          .select("*")
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

      // Extract data safely
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

      // Calculate real statistics
      const activeUsers = users.filter(
        (u) => u.status === "active" || !u.status,
      ).length;
      const activeProjects = projects.filter(
        (p) => p.status === "in-progress" || p.status === "submitted",
      ).length;
      const completedProjects = projects.filter(
        (p) => p.status === "completed" || p.status === "delivered",
      ).length;
      const totalRevenue = invoices
        .filter((i) => i.status === "paid")
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);
      const pendingInvoices = invoices.filter(
        (i) => i.status === "pending",
      ).length;

      // Create recent activity from various sources
      const recentActivity = [
        ...messages.slice(0, 5).map((msg) => ({
          id: `msg-${msg.id}`,
          type: "message",
          description: `New message from ${msg.sender?.name || "User"}`,
          timestamp: msg.created_at,
          icon: MessageSquare,
        })),
        ...projects.slice(0, 3).map((project) => ({
          id: `project-${project.id}`,
          type: "project",
          description: `Project "${project.title}" updated`,
          timestamp: project.updated_at || project.created_at,
          icon: FolderKanban,
        })),
        ...users.slice(0, 2).map((user) => ({
          id: `user-${user.id}`,
          type: "user",
          description: `New user registered: ${user.name || user.email}`,
          timestamp: user.created_at,
          icon: Users,
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 8);

      const dashboardStats: DashboardStats = {
        totalUsers: users.length,
        activeUsers,
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalChats: chats.length,
        totalMessages: messages.length,
        totalInvoices: invoices.length,
        totalRevenue,
        pendingInvoices,
        recentUsers: users.slice(0, 5),
        recentProjects: projects.slice(0, 5),
        recentActivity,
      };

      setStats(dashboardStats);

      if (!showLoader) {
        toast.success("🎉 Dashboard refreshed!");
      }

      console.log("✅ Dashboard loaded:", dashboardStats);
    } catch (err: any) {
      console.error("❌ Dashboard load failed:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-festival-orange" />
          <p className="text-lg font-black text-black">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-black text-black mb-4">
          NO DATA AVAILABLE
        </h2>
        <Button
          onClick={() => loadDashboardData()}
          className="bg-festival-orange"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          RETRY
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black mb-2">
            Welcome back, {user?.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-lg text-black/70 font-bold">
            Here's what's happening with your platform today.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 font-black"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          REFRESH
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-blue-400 to-blue-500 p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-black text-white">
                {stats.totalUsers}
              </p>
              <p className="text-sm font-bold text-white/90">Total Users</p>
              <p className="text-xs text-white/80">
                {stats.activeUsers} active
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-purple-400 to-purple-500 p-4">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-black text-white">
                {stats.totalProjects}
              </p>
              <p className="text-sm font-bold text-white/90">Projects</p>
              <p className="text-xs text-white/80">
                {stats.activeProjects} active
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-green-400 to-green-500 p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-black text-white">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm font-bold text-white/90">Revenue</p>
              <p className="text-xs text-white/80">
                {stats.pendingInvoices} pending
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-orange-400 to-orange-500 p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-black text-white">
                {stats.totalMessages}
              </p>
              <p className="text-sm font-bold text-white/90">Messages</p>
              <p className="text-xs text-white/80">{stats.totalChats} chats</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white p-6">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-festival-orange" />
            QUICK ACTIONS
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.path}
                onClick={() => navigate(action.path)}
                variant="outline"
                className="h-auto p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <div className="text-center">
                  <div
                    className={`mx-auto mb-2 p-2 ${action.color} text-white border-2 border-black w-fit`}
                  >
                    {action.icon}
                  </div>
                  <p className="font-black text-black text-sm">
                    {action.title}
                  </p>
                  <p className="text-xs text-black/70">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white p-6">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-festival-pink" />
            RECENT ACTIVITY
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-2 bg-festival-cream/50 border-2 border-black"
                  >
                    <Icon className="w-4 h-4 text-festival-orange flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-black">
                        {activity.description}
                      </p>
                      <p className="text-xs text-black/60">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-black/50 py-4">
                No recent activity
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white p-6">
        <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-green-500" />
          SYSTEM STATUS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-500">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-black text-green-800">Database Online</p>
              <p className="text-sm text-green-600">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-500">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-black text-blue-800">API Status</p>
              <p className="text-sm text-blue-600">Running smoothly</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-500">
            <Activity className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-black text-orange-800">Performance</p>
              <p className="text-sm text-orange-600">Excellent</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
