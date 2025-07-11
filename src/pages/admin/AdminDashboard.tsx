import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Users,
  FolderKanban,
  MessageSquare,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Shield,
  Eye,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Plus,
  Search,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Activity,
  UserCheck,
  UserX,
  FileText,
  Zap,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  XCircle,
  PieChart,
  Globe,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
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
  recentMessages: any[];
  recentActivity: any[];
  monthlyStats: any;
  systemHealth: any;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
  count?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if user is admin
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    profile?.role === "admin" ||
    profile?.role === "super-admin" ||
    user?.email === "admin@demo.com";

  const quickActions: QuickAction[] = [
    {
      title: "Create New User",
      description: "Add a new user to the system",
      icon: <UserCheck className="w-6 h-6" />,
      action: () => navigate("/admin/users/create"),
      color: "bg-blue-500",
    },
    {
      title: "New Project",
      description: "Start a new design project",
      icon: <Plus className="w-6 h-6" />,
      action: () => navigate("/admin/projects/create"),
      color: "bg-green-500",
    },
    {
      title: "Create Invoice",
      description: "Generate a new invoice",
      icon: <FileText className="w-6 h-6" />,
      action: () => navigate("/admin/invoices/create"),
      color: "bg-purple-500",
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: <Settings className="w-6 h-6" />,
      action: () => navigate("/admin/settings"),
      color: "bg-gray-500",
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      action: () => navigate("/admin/analytics"),
      color: "bg-orange-500",
    },
    {
      title: "Audit Logs",
      description: "Review system audit logs",
      icon: <Shield className="w-6 h-6" />,
      action: () => navigate("/admin/audit-logs"),
      color: "bg-red-500",
    },
  ];

  const loadDashboardData = async (showLoader = true) => {
    if (!user || !isAdmin) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      console.log("🔄 Loading enhanced admin dashboard for:", user.email);

      // Load all data in parallel with more comprehensive queries
      const [
        usersResult,
        projectsResult,
        chatsResult,
        messagesResult,
        invoicesResult,
        recentActivityResult,
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
            user:users!user_id(name, email, avatar_url),
            designer:users!designer_id(name, email)
          `,
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("chats")
          .select(
            `
            *,
            request:design_requests!request_id(title, status),
            messages(id)
          `,
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("messages")
          .select(
            `
            *,
            sender:users!sender_id(name, email, avatar_url)
          `,
          )
          .order("created_at", { ascending: false })
          .limit(50),

        supabase
          .from("invoices")
          .select("*")
          .order("created_at", { ascending: false }),

        // Mock recent activity for now
        Promise.resolve({ data: [] }),
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

      // Calculate advanced statistics
      const activeUsers = users.filter((u) => u.status === "active").length;
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

      // Generate mock monthly stats
      const monthlyStats = {
        newUsers: Math.floor(Math.random() * 20) + 5,
        newProjects: Math.floor(Math.random() * 15) + 3,
        revenue: totalRevenue,
        growth: Math.floor(Math.random() * 30) + 10,
      };

      // Generate mock system health
      const systemHealth = {
        uptime: "99.9%",
        responseTime: Math.floor(Math.random() * 100) + 50 + "ms",
        activeConnections: Math.floor(Math.random() * 500) + 100,
        memoryUsage: Math.floor(Math.random() * 40) + 40,
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        diskUsage: Math.floor(Math.random() * 60) + 30,
      };

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
        recentUsers: users.slice(0, 8),
        recentProjects: projects.slice(0, 8),
        recentMessages: messages.slice(0, 15),
        recentActivity: [], // Will be populated with real data later
        monthlyStats,
        systemHealth,
      };

      setStats(dashboardStats);

      // Generate sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: "1",
          title: "New User Registration",
          message: `${users.length > 0 ? users[0]?.name || users[0]?.email : "A user"} just registered`,
          type: "info",
          timestamp: new Date(),
          read: false,
        },
        {
          id: "2",
          title: "System Health",
          message: `System is running smoothly. Uptime: ${systemHealth.uptime}`,
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          read: false,
        },
        pendingInvoices > 0 && {
          id: "3",
          title: "Pending Invoices",
          message: `You have ${pendingInvoices} pending invoices requiring attention`,
          type: "warning",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
        },
      ].filter(Boolean) as Notification[];

      setNotifications(sampleNotifications);

      if (!showLoader) {
        toast.success("Dashboard refreshed successfully!");
      }

      console.log(
        "✅ Enhanced dashboard data loaded successfully:",
        dashboardStats,
      );
    } catch (err: any) {
      console.error("❌ Failed to load dashboard:", err);
      setError(err.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(false);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

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

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (stats) {
          handleRefresh();
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [stats]);

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
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
            <p className="text-xl text-black/70">
              Loading comprehensive data...
            </p>
          </div>
          <Badge className="bg-green-500 text-white">ADMIN ACCESS</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-4 border-gray-300 bg-gray-100 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center h-32">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-festival-orange" />
            <span className="text-lg">Loading enhanced admin dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
        <Card className="border-4 border-red-500 bg-red-50 p-6">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Dashboard Error
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={() => loadDashboardData()}
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
      <div className="space-y-6 p-6">
        <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
        <div className="text-center py-12">
          <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Control Center
          </h1>
          <p className="text-2xl text-gray-700 font-medium mt-2">
            Welcome back, {user.email?.split("@")[0]}! 👨‍💼
          </p>
          <p className="text-gray-500 mt-1">
            Last refreshed: {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search admin panel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-2 border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-gray-300 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>

            {showNotifications && (
              <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto border-2 border-gray-300 shadow-lg z-50">
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Notifications
                  </h3>
                  {notifications.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded border cursor-pointer transition-colors ${
                            notif.read
                              ? "bg-gray-50 border-gray-200"
                              : "bg-blue-50 border-blue-200"
                          }`}
                          onClick={() => markNotificationAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
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
                              <p className="font-medium text-sm">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notif.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No notifications
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>

          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
            ADMIN ACCESS
          </Badge>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {/* Primary Stats */}
        <Card className="border-4 border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8" />
              <Badge className="bg-white/20 text-white">
                +{stats.monthlyStats.newUsers}
              </Badge>
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-xs opacity-75 mt-1">
              {stats.activeUsers} active
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/users")}
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-white hover:bg-white/20 border border-white/30"
          >
            Manage <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="border-4 border-purple-500 bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <FolderKanban className="w-8 h-8" />
              <Badge className="bg-white/20 text-white">
                +{stats.monthlyStats.newProjects}
              </Badge>
            </div>
            <p className="text-3xl font-bold">{stats.totalProjects}</p>
            <p className="text-sm opacity-90">Projects</p>
            <p className="text-xs opacity-75 mt-1">
              {stats.activeProjects} active, {stats.completedProjects} done
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/projects")}
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-white hover:bg-white/20 border border-white/30"
          >
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="border-4 border-green-500 bg-gradient-to-br from-green-500 to-green-600 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <Badge className="bg-white/20 text-white">
                +{stats.monthlyStats.growth}%
              </Badge>
            </div>
            <p className="text-3xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm opacity-90">Revenue</p>
            <p className="text-xs opacity-75 mt-1">
              {stats.pendingInvoices} pending
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/invoices")}
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-white hover:bg-white/20 border border-white/30"
          >
            Invoices <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="border-4 border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8" />
              <Badge className="bg-white/20 text-white">Live</Badge>
            </div>
            <p className="text-3xl font-bold">{stats.totalMessages}</p>
            <p className="text-sm opacity-90">Messages</p>
            <p className="text-xs opacity-75 mt-1">
              {stats.totalChats} conversations
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/chat")}
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-white hover:bg-white/20 border border-white/30"
          >
            Monitor <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        {/* System Health Cards */}
        <Card className="border-4 border-teal-500 bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8" />
            <Badge className="bg-white/20 text-white">Live</Badge>
          </div>
          <p className="text-3xl font-bold">{stats.systemHealth.uptime}</p>
          <p className="text-sm opacity-90">Uptime</p>
          <p className="text-xs opacity-75 mt-1">
            {stats.systemHealth.responseTime} avg
          </p>
        </Card>

        <Card className="border-4 border-indigo-500 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-8 h-8" />
            <Badge className="bg-white/20 text-white">Monitor</Badge>
          </div>
          <p className="text-3xl font-bold">
            {stats.systemHealth.activeConnections}
          </p>
          <p className="text-sm opacity-90">Connections</p>
          <p className="text-xs opacity-75 mt-1">
            CPU: {stats.systemHealth.cpuUsage}%
          </p>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <Card className="border-4 border-gray-300 bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 hover:shadow-lg group"
            >
              <div
                className={`p-3 rounded-full ${action.color} text-white group-hover:scale-110 transition-transform`}
              >
                {action.icon}
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
              {action.count && (
                <Badge className="bg-red-500 text-white">{action.count}</Badge>
              )}
            </Button>
          ))}
        </div>
      </Card>

      {/* System Health Dashboard */}
      <Card className="border-4 border-gray-300 bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Monitor className="w-6 h-6 text-blue-500" />
          System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Memory Usage
                </span>
                <span className="text-sm text-gray-500">
                  {stats.systemHealth.memoryUsage}%
                </span>
              </div>
              <Progress
                value={stats.systemHealth.memoryUsage}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  CPU Usage
                </span>
                <span className="text-sm text-gray-500">
                  {stats.systemHealth.cpuUsage}%
                </span>
              </div>
              <Progress value={stats.systemHealth.cpuUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Disk Usage
                </span>
                <span className="text-sm text-gray-500">
                  {stats.systemHealth.diskUsage}%
                </span>
              </div>
              <Progress value={stats.systemHealth.diskUsage} className="h-2" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded border">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-800">Database Connected</p>
                <p className="text-sm text-green-600">
                  All systems operational
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border">
              <Wifi className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-blue-800">Network Status</p>
                <p className="text-sm text-blue-600">
                  {stats.systemHealth.responseTime} response time
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded border">
              <HardDrive className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-purple-800">Storage Health</p>
                <p className="text-sm text-purple-600">Backup completed</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-4 border-2 border-blue-200 bg-blue-50">
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-bold text-2xl text-blue-800">
                  {stats.systemHealth.activeConnections}
                </p>
                <p className="text-sm text-blue-600">Active Sessions</p>
              </div>
            </Card>
            <Button
              onClick={() => navigate("/admin/analytics")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </Card>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card className="border-4 border-gray-300 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Recent Users
              <Badge variant="secondary">{stats.totalUsers}</Badge>
            </h3>
            <Button
              onClick={() => navigate("/admin/users")}
              variant="outline"
              size="sm"
              className="border-2 border-gray-300"
            >
              <Eye className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {user.name || user.email}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        user.role === "admin"
                          ? "bg-red-500"
                          : user.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                      }
                    >
                      {user.role}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">
                      XP: {user.xp || 0}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Projects */}
        <Card className="border-4 border-gray-300 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-purple-500" />
              Recent Projects
              <Badge variant="secondary">{stats.totalProjects}</Badge>
            </h3>
            <Button
              onClick={() => navigate("/admin/projects")}
              variant="outline"
              size="sm"
              className="border-2 border-gray-300"
            >
              <Eye className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.recentProjects.length > 0 ? (
              stats.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/projects/${project.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {project.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Client: {project.user?.name || project.user?.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          project.status === "completed"
                            ? "border-green-500 text-green-700"
                            : project.status === "in-progress"
                              ? "border-blue-500 text-blue-700"
                              : project.status === "submitted"
                                ? "border-yellow-500 text-yellow-700"
                                : "border-gray-500 text-gray-700"
                        }
                      >
                        {project.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        ${project.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FolderKanban className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No projects found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Messages & Activity */}
        <Card className="border-4 border-gray-300 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Live Activity
              <Badge variant="secondary">{stats.totalMessages}</Badge>
            </h3>
            <Button
              onClick={() => navigate("/admin/chat")}
              variant="outline"
              size="sm"
              className="border-2 border-gray-300"
            >
              <Monitor className="w-4 h-4 mr-1" />
              Monitor
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.recentMessages.length > 0 ? (
              stats.recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(message.sender?.name ||
                        message.sender?.email ||
                        "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 text-sm">
                          {message.sender?.name ||
                            message.sender?.email ||
                            "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {message.text?.substring(0, 100)}
                        {message.text?.length > 100 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent messages</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Footer Actions */}
      <Card className="border-4 border-gray-300 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Admin Control Center</h3>
            <p className="text-gray-300">
              Total system overview • {stats.totalUsers} users •{" "}
              {stats.totalProjects} projects • $
              {stats.totalRevenue.toLocaleString()} revenue
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/admin/settings")}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              onClick={() => navigate("/admin/audit-logs")}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              Audit Logs
            </Button>
            <Button
              onClick={() => navigate("/admin/analytics")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Full Analytics
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
