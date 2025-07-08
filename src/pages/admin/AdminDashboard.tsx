import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fetchDashboardData,
  subscribeToAdminUpdates,
  type DashboardData,
} from "@/lib/admin-api";
import {
  Users,
  FolderKanban,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Zap,
  Shield,
  Eye,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLastUpdated(new Date());
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const cleanup = subscribeToAdminUpdates((update) => {
      console.log("Real-time update received:", update);
      // Refresh dashboard data when updates are received
      if (dashboardData) {
        fetchDashboardData()
          .then((newData) => {
            setDashboardData(newData);
            setLastUpdated(new Date());
          })
          .catch((err) => {
            console.error("Failed to refresh dashboard data:", err);
          });
      }
    });

    return cleanup;
  }, [dashboardData]);

  // GSAP animations
  useEffect(() => {
    if (
      !containerRef.current ||
      !metricsRef.current ||
      !chartsRef.current ||
      loading
    )
      return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    const metricCards = metricsRef.current.children;
    tl.fromTo(
      metricCards,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.2)",
      },
      "-=0.3",
    );

    const chartCards = chartsRef.current.children;
    tl.fromTo(
      chartCards,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.2",
    );
  }, [loading]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-festival-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-black">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-4 border-red-500 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] bg-white p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-black mb-2">
            Dashboard Error
          </h3>
          <p className="text-black/70 mb-6">{error}</p>
          <Button
            onClick={refreshData}
            className="bg-red-500 hover:bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  // Fallback to empty data if needed
  const data = dashboardData || {
    users: [],
    projects: [],
    invoices: [],
    chats: [],
    alerts: [],
    analytics: {
      clientEngagement: {
        activeSessions: 0,
        requestsPerWeek: 0,
        averageProjectValue: 0,
        clientRetentionRate: 0,
      },
      designerProductivity: {
        averageTurnaroundTime: 0,
        completedRequestsThisMonth: 0,
        utilizationRate: 0,
        customerSatisfaction: 0,
      },
      financialMetrics: {
        monthlyRecurringRevenue: 0,
        averageInvoiceSize: 0,
        outstandingBalance: 0,
        collectionRate: 0,
      },
      systemHealth: {
        uptime: 0,
        errorRate: 0,
        averageLoadTime: 0,
        activeUsers: 0,
      },
    },
  };

  const recentProjects = data.projects.slice(0, 5);
  const pendingInvoices = data.invoices.filter(
    (inv: any) => inv.status === "pending" || inv.status === "overdue",
  );
  const criticalAlerts = data.alerts.filter(
    (alert: any) => !alert.is_read && alert.type === "error",
  );
  const activeDesigners = data.users.filter(
    (user: any) => user.role === "designer" && user.status === "active",
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "needs-feedback":
        return "bg-orange-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "from-red-500 to-red-600";
      case "high":
        return "from-festival-pink to-festival-magenta";
      case "medium":
        return "from-festival-orange to-festival-coral";
      case "low":
        return "from-festival-yellow to-festival-amber";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Complete system overview and management center
          </p>
          <p className="text-sm text-black/50">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-2 text-festival-orange">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Updating...</span>
            </div>
          )}
          <Button
            onClick={refreshData}
            variant="outline"
            disabled={loading}
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div
        ref={metricsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <Users className="w-6 h-6 text-festival-orange" />
            </div>
            <Badge className="bg-festival-black text-white border-2 border-black">
              ACTIVE
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
              Total Users
            </p>
            <p className="text-3xl font-display font-bold text-black">
              {data.users.length}
            </p>
            <p className="text-sm text-black/70">
              {activeDesigners} designers active
            </p>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-pink to-festival-magenta p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <FolderKanban className="w-6 h-6 text-festival-pink" />
            </div>
            <Badge className="bg-festival-black text-white border-2 border-black">
              PROJECTS
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
              Active Projects
            </p>
            <p className="text-3xl font-display font-bold text-black">
              {data.projects.length}
            </p>
            <p className="text-sm text-black/70">
              {
                data.projects.filter((p: any) => p.status === "in-progress")
                  .length
              }{" "}
              in progress
            </p>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <CreditCard className="w-6 h-6 text-festival-yellow" />
            </div>
            <Badge className="bg-festival-black text-white border-2 border-black">
              REVENUE
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
              Monthly Revenue
            </p>
            <p className="text-3xl font-display font-bold text-black">
              $
              {data.analytics.financialMetrics.monthlyRecurringRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-black/70">
              ${data.analytics.financialMetrics.outstandingBalance} pending
            </p>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-green-400 to-green-500 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <Badge className="bg-festival-black text-white border-2 border-black">
              UPTIME
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
              System Health
            </p>
            <p className="text-3xl font-display font-bold text-black">
              {(data.analytics.systemHealth.uptime * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-black/70">
              {data.analytics.systemHealth.activeUsers} users online
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">Recent Projects</h3>
              <Button
                onClick={() => navigate("/admin/projects")}
                variant="outline"
                size="sm"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-festival-cream border-2 border-black"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-black text-sm mb-1">
                    {project.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getStatusColor(project.status)} text-white border-2 border-black text-xs`}
                    >
                      {project.status.replace("-", " ").toUpperCase()}
                    </Badge>
                    <span className="text-xs text-black/60">
                      {project.clientName}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(project.priority)}`}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">System Alerts</h3>
              <Button
                onClick={() => navigate("/admin/alerts")}
                variant="outline"
                size="sm"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {mockSystemAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border-2 border-black ${
                  alert.type === "error"
                    ? "bg-red-50"
                    : alert.type === "warning"
                      ? "bg-yellow-50"
                      : "bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "error"
                        ? "bg-red-500"
                        : alert.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-black">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-black/70 line-clamp-2">
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
        </Card>

        {/* Quick Actions */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black">
            <h3 className="text-xl font-bold text-black">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-3">
            <Button
              onClick={() => navigate("/admin/projects/kanban")}
              className="w-full justify-between bg-gradient-to-r from-festival-orange to-festival-coral hover:from-festival-coral hover:to-festival-orange border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                Project Kanban
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => navigate("/admin/invoices/create")}
              className="w-full justify-between bg-gradient-to-r from-festival-pink to-festival-magenta hover:from-festival-magenta hover:to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Create Invoice
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => navigate("/admin/users")}
              className="w-full justify-between bg-gradient-to-r from-festival-yellow to-festival-amber hover:from-festival-amber hover:to-festival-yellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manage Users
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => navigate("/admin/analytics")}
              className="w-full justify-between bg-gradient-to-r from-festival-cyan to-festival-blue hover:from-festival-blue hover:to-festival-cyan border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => navigate("/admin/settings")}
              variant="outline"
              className="w-full justify-between border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                System Settings
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="p-6 border-b-4 border-black">
          <h3 className="text-xl font-bold text-black">Performance Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-black mb-2">
                {mockAnalyticsData.designerProductivity.averageTurnaroundTime}d
              </div>
              <div className="text-sm text-black/70">Avg. Turnaround</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-black mb-2">
                {mockAnalyticsData.designerProductivity.customerSatisfaction}/5
              </div>
              <div className="text-sm text-black/70">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-black mb-2">
                {(
                  mockAnalyticsData.financialMetrics.collectionRate * 100
                ).toFixed(0)}
                %
              </div>
              <div className="text-sm text-black/70">Collection Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-black mb-2">
                {(mockAnalyticsData.systemHealth.errorRate * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-black/70">Error Rate</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
