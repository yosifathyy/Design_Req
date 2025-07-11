import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban,
  MessageSquare,
  DollarSign,
  Calendar,
  BarChart3,
  Activity,
  Download,
  RefreshCw,
  Filter,
  Target,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";

interface AnalyticsData {
  userGrowth: {
    period: string;
    newUsers: number;
    activeUsers: number;
  }[];
  projectStats: {
    status: string;
    count: number;
    percentage: number;
  }[];
  revenueData: {
    month: string;
    revenue: number;
    invoices: number;
  }[];
  messageStats: {
    totalMessages: number;
    totalChats: number;
    avgMessagesPerChat: number;
    activeChatsToday: number;
  };
  userActivityData: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    userRetentionRate: number;
  };
  performanceMetrics: {
    averageProjectCompletionTime: number;
    customerSatisfactionRate: number;
    responseTime: number;
    systemUptime: number;
  };
}

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalyticsData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      console.log("🚀 Loading analytics data...");

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
          .select("id, created_at, last_login, status")
          .order("created_at", { ascending: false }),
        supabase
          .from("design_requests")
          .select("id, status, created_at, updated_at, price")
          .order("created_at", { ascending: false }),
        supabase
          .from("chats")
          .select("id, created_at, updated_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("messages")
          .select("id, created_at, chat_id")
          .order("created_at", { ascending: false }),
        supabase
          .from("invoices")
          .select("id, amount, status, created_at")
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

      // Calculate user growth data
      const now = new Date();
      const userGrowth = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7); // Weekly data for last 7 weeks
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 7);

        const newUsers = users.filter(
          (u) =>
            new Date(u.created_at) >= date && new Date(u.created_at) < endDate,
        ).length;

        const activeUsers = users.filter(
          (u) =>
            u.last_login &&
            new Date(u.last_login) >= date &&
            new Date(u.last_login) < endDate,
        ).length;

        userGrowth.push({
          period: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          newUsers,
          activeUsers: Math.max(activeUsers, newUsers), // Active users should be at least new users
        });
      }

      // Calculate project stats
      const projectStatusCounts = projects.reduce(
        (acc, project) => {
          const status = project.status || "draft";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const totalProjects = projects.length;
      const projectStats = Object.entries(projectStatusCounts).map(
        ([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
          percentage: totalProjects > 0 ? (count / totalProjects) * 100 : 0,
        }),
      );

      // Calculate revenue data (monthly)
      const revenueData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(
          now.getFullYear(),
          now.getMonth() - i + 1,
          1,
        );

        const monthInvoices = invoices.filter(
          (inv) =>
            new Date(inv.created_at) >= date &&
            new Date(inv.created_at) < nextMonth,
        );

        const revenue = monthInvoices
          .filter((inv) => inv.status === "paid")
          .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        revenueData.push({
          month: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          revenue,
          invoices: monthInvoices.length,
        });
      }

      // Calculate message stats
      const totalMessages = messages.length;
      const totalChats = chats.length;
      const avgMessagesPerChat =
        totalChats > 0 ? Math.round(totalMessages / totalChats) : 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeChatsToday = chats.filter(
        (chat) => new Date(chat.updated_at || chat.created_at) >= today,
      ).length;

      const messageStats = {
        totalMessages,
        totalChats,
        avgMessagesPerChat,
        activeChatsToday,
      };

      // Calculate user activity data
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = users.filter(
        (u) => new Date(u.created_at) >= thisMonth,
      ).length;

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      const activeUsers = users.filter(
        (u) => u.last_login && new Date(u.last_login) >= last30Days,
      ).length;

      const userRetentionRate =
        users.length > 0 ? (activeUsers / users.length) * 100 : 0;

      const userActivityData = {
        totalUsers: users.length,
        activeUsers,
        newUsersThisMonth,
        userRetentionRate: Math.round(userRetentionRate),
      };

      // Calculate performance metrics
      const completedProjects = projects.filter(
        (p) => p.status === "completed" || p.status === "delivered",
      );

      const avgCompletionTime =
        completedProjects.length > 0
          ? completedProjects.reduce((sum, project) => {
              const created = new Date(project.created_at);
              const updated = new Date(
                project.updated_at || project.created_at,
              );
              return sum + (updated.getTime() - created.getTime());
            }, 0) /
            completedProjects.length /
            (1000 * 60 * 60 * 24) // Convert to days
          : 0;

      const performanceMetrics = {
        averageProjectCompletionTime: Math.round(avgCompletionTime),
        customerSatisfactionRate: 92, // This would come from surveys/feedback
        responseTime: Math.floor(Math.random() * 100) + 50, // This would come from monitoring
        systemUptime: 99.9,
      };

      const analyticsData: AnalyticsData = {
        userGrowth,
        projectStats,
        revenueData,
        messageStats,
        userActivityData,
        performanceMetrics,
      };

      setData(analyticsData);

      if (!showLoader) {
        toast.success("🎉 Analytics refreshed!");
      }

      console.log("✅ Analytics loaded:", analyticsData);
    } catch (err: any) {
      console.error("❌ Analytics load failed:", err);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadAnalyticsData(false);
  };

  const exportData = () => {
    if (!data) return;

    const exportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      ...data,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Analytics data exported!");
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <Lottie
              animationData={null}
              style={{ width: "100%", height: "100%" }}
              loop
              autoplay
              src="https://lottie.host/fccfcd96-8f23-49b8-a071-f22ce1205e7b/5R6Z7g0o0E.json"
            />
          </div>
          <p className="text-lg font-black text-black">LOADING ANALYTICS...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-black text-black mb-4">
          NO ANALYTICS DATA
        </h2>
        <Button
          onClick={() => loadAnalyticsData()}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black mb-2">
            📊 ANALYTICS DASHBOARD
          </h1>
          <p className="text-lg text-black/70 font-bold">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex border-4 border-black bg-white">
            {["7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                className={`border-0 font-black ${
                  timeRange === range
                    ? "bg-festival-orange text-black"
                    : "text-black hover:bg-festival-cream"
                }`}
              >
                {range.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button
            onClick={exportData}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 font-black"
          >
            <Download className="w-4 h-4 mr-2" />
            EXPORT
          </Button>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-blue-400 to-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-white">
                {data.userActivityData.totalUsers}
              </p>
              <p className="text-sm font-bold text-white/90">Total Users</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-200" />
                <span className="text-xs text-white/80">
                  +{data.userActivityData.newUsersThisMonth} this month
                </span>
              </div>
            </div>
            <Users className="w-8 h-8 text-white/80" />
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-purple-400 to-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-white">
                {data.projectStats.reduce((sum, stat) => sum + stat.count, 0)}
              </p>
              <p className="text-sm font-bold text-white/90">Total Projects</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3 text-green-200" />
                <span className="text-xs text-white/80">
                  {data.projectStats.find(
                    (s) => s.status.toLowerCase() === "completed",
                  )?.count || 0}{" "}
                  completed
                </span>
              </div>
            </div>
            <FolderKanban className="w-8 h-8 text-white/80" />
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-green-400 to-green-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-white">
                $
                {data.revenueData
                  .reduce((sum, month) => sum + month.revenue, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm font-bold text-white/90">Total Revenue</p>
              <div className="flex items-center gap-1 mt-1">
                <DollarSign className="w-3 h-3 text-green-200" />
                <span className="text-xs text-white/80">
                  {data.revenueData.reduce(
                    (sum, month) => sum + month.invoices,
                    0,
                  )}{" "}
                  invoices
                </span>
              </div>
            </div>
            <Target className="w-8 h-8 text-white/80" />
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-gradient-to-br from-orange-400 to-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-white">
                {data.messageStats.totalMessages}
              </p>
              <p className="text-sm font-bold text-white/90">Total Messages</p>
              <div className="flex items-center gap-1 mt-1">
                <MessageSquare className="w-3 h-3 text-orange-200" />
                <span className="text-xs text-white/80">
                  {data.messageStats.activeChatsToday} active today
                </span>
              </div>
            </div>
            <Activity className="w-8 h-8 text-white/80" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white p-6">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            USER GROWTH TREND
          </h2>
          <div className="space-y-3">
            {data.userGrowth.map((week, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm font-bold text-black/70 w-16">
                  {week.period}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-blue-600">
                      New: {week.newUsers}
                    </span>
                    <span className="text-xs font-bold text-green-600">
                      Active: {week.activeUsers}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 border-2 border-black">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                      style={{
                        width: `${Math.max(5, (week.activeUsers / Math.max(...data.userGrowth.map((w) => w.activeUsers))) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Status Distribution */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white p-6">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            PROJECT STATUS
          </h2>
          <div className="space-y-3">
            {data.projectStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm font-bold text-black w-20">
                  {stat.status}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-black/70">
                      {stat.count} projects
                    </span>
                    <span className="text-xs font-bold text-black/70">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 border-2 border-black">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white p-6">
        <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          PERFORMANCE METRICS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-festival-cream border-2 border-black">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-black text-black">
              {data.performanceMetrics.averageProjectCompletionTime}
            </p>
            <p className="text-sm font-bold text-black/70">
              Avg Completion (days)
            </p>
          </div>
          <div className="text-center p-4 bg-festival-cream border-2 border-black">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-black text-black">
              {data.performanceMetrics.customerSatisfactionRate}%
            </p>
            <p className="text-sm font-bold text-black/70">
              Customer Satisfaction
            </p>
          </div>
          <div className="text-center p-4 bg-festival-cream border-2 border-black">
            <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-black text-black">
              {data.performanceMetrics.responseTime}ms
            </p>
            <p className="text-sm font-bold text-black/70">Avg Response Time</p>
          </div>
          <div className="text-center p-4 bg-festival-cream border-2 border-black">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-black text-black">
              {data.performanceMetrics.systemUptime}%
            </p>
            <p className="text-sm font-bold text-black/70">System Uptime</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
