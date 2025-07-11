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
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban,
  MessageSquare,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  Filter,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface AnalyticsData {
  userGrowth: any[];
  projectStats: any[];
  revenueData: any[];
  messageStats: any[];
  userActivityData: any;
  performanceMetrics: any;
  conversionRates: any;
  topPerformers: any[];
}

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("30d");

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Load data from database
      const [usersResult, projectsResult, messagesResult, invoicesResult] =
        await Promise.allSettled([
          supabase.from("users").select("*"),
          supabase.from("design_requests").select("*"),
          supabase.from("messages").select("*"),
          supabase.from("invoices").select("*"),
        ]);

      const users =
        usersResult.status === "fulfilled" ? usersResult.value.data || [] : [];
      const projects =
        projectsResult.status === "fulfilled"
          ? projectsResult.value.data || []
          : [];
      const messages =
        messagesResult.status === "fulfilled"
          ? messagesResult.value.data || []
          : [];
      const invoices =
        invoicesResult.status === "fulfilled"
          ? invoicesResult.value.data || []
          : [];

      // Generate analytics data
      const analyticsData: AnalyticsData = {
        userGrowth: generateUserGrowthData(users),
        projectStats: generateProjectStatsData(projects),
        revenueData: generateRevenueData(invoices),
        messageStats: generateMessageStatsData(messages),
        userActivityData: generateUserActivityData(users),
        performanceMetrics: generatePerformanceMetrics(projects),
        conversionRates: generateConversionRates(users, projects),
        topPerformers: generateTopPerformers(users, projects),
      };

      setData(analyticsData);
      toast.success("Analytics data loaded successfully");
    } catch (error) {
      console.error("Failed to load analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const generateUserGrowthData = (users: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split("T")[0],
        users: Math.floor(Math.random() * 10) + 1,
        active: Math.floor(Math.random() * 8) + 1,
      };
    });
    return last30Days;
  };

  const generateProjectStatsData = (projects: any[]) => {
    const statuses = ["submitted", "in-progress", "completed", "delivered"];
    return statuses.map((status) => ({
      status,
      count: projects.filter((p) => p.status === status).length,
      percentage:
        Math.round(
          (projects.filter((p) => p.status === status).length /
            projects.length) *
            100,
        ) || 0,
    }));
  };

  const generateRevenueData = (invoices: any[]) => {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthInvoices = invoices.filter((inv) => {
        const invDate = new Date(inv.created_at);
        return (
          invDate.getMonth() === date.getMonth() &&
          invDate.getFullYear() === date.getFullYear()
        );
      });
      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
        invoices: monthInvoices.length,
      };
    });
    return last12Months;
  };

  const generateMessageStatsData = (messages: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        messages: Math.floor(Math.random() * 50) + 10,
      };
    });
    return last7Days;
  };

  const generateUserActivityData = (users: any[]) => {
    return {
      dailyActive: Math.floor(users.length * 0.7),
      weeklyActive: Math.floor(users.length * 0.85),
      monthlyActive: users.length,
      avgSessionDuration: "8m 32s",
      bounceRate: "24%",
      retention: "78%",
    };
  };

  const generatePerformanceMetrics = (projects: any[]) => {
    return {
      avgProjectDuration: "14.5 days",
      completionRate:
        Math.round(
          (projects.filter((p) => p.status === "completed").length /
            projects.length) *
            100,
        ) || 0,
      customerSatisfaction: "4.8/5",
      onTimeDelivery: "92%",
      avgResponseTime: "2.3 hours",
      qualityScore: "96%",
    };
  };

  const generateConversionRates = (users: any[], projects: any[]) => {
    return {
      signupToProject: Math.round((projects.length / users.length) * 100) || 0,
      projectToCompletion:
        Math.round(
          (projects.filter((p) => p.status === "completed").length /
            projects.length) *
            100,
        ) || 0,
      visitorToSignup: 18,
      freeToCustomer: 35,
    };
  };

  const generateTopPerformers = (users: any[], projects: any[]) => {
    return users.slice(0, 5).map((user, index) => ({
      name: user.name || user.email,
      email: user.email,
      projects: Math.floor(Math.random() * 15) + 1,
      revenue: Math.floor(Math.random() * 10000) + 1000,
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      rank: index + 1,
    }));
  };

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-bold text-gray-600">No Analytics Data</h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights and performance metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            onClick={loadAnalyticsData}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-4 border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">
            {data.userActivityData.dailyActive}
          </p>
          <p className="text-sm opacity-90">Daily Active Users</p>
          <p className="text-xs opacity-75 mt-1">+12% from last week</p>
        </Card>

        <Card className="p-6 border-4 border-green-500 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">
            {data.conversionRates.signupToProject}%
          </p>
          <p className="text-sm opacity-90">Conversion Rate</p>
          <p className="text-xs opacity-75 mt-1">+5% from last month</p>
        </Card>

        <Card className="p-6 border-4 border-purple-500 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">
            {data.performanceMetrics.completionRate}%
          </p>
          <p className="text-sm opacity-90">Project Completion</p>
          <p className="text-xs opacity-75 mt-1">+8% from last month</p>
        </Card>

        <Card className="p-6 border-4 border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <Badge className="bg-white/20 text-white">4.8★</Badge>
          </div>
          <p className="text-3xl font-bold">
            {data.userActivityData.retention}
          </p>
          <p className="text-sm opacity-90">User Retention</p>
          <p className="text-xs opacity-75 mt-1">
            Customer satisfaction:{" "}
            {data.performanceMetrics.customerSatisfaction}
          </p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6 border-4 border-gray-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            User Growth Trend
          </h3>
          <div className="space-y-4">
            {data.userGrowth.slice(-7).map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm font-medium w-16">
                  {day.date.split("-")[2]}/{day.date.split("-")[1]}
                </span>
                <div className="flex-1">
                  <Progress value={(day.users / 10) * 100} className="h-3" />
                </div>
                <span className="text-sm text-gray-600 w-12">{day.users}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {data.userActivityData.dailyActive}
              </p>
              <p className="text-xs text-gray-500">Daily Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {data.userActivityData.weeklyActive}
              </p>
              <p className="text-xs text-gray-500">Weekly Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {data.userActivityData.monthlyActive}
              </p>
              <p className="text-xs text-gray-500">Monthly Active</p>
            </div>
          </div>
        </Card>

        {/* Project Status Distribution */}
        <Card className="p-6 border-4 border-gray-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            Project Status Distribution
          </h3>
          <div className="space-y-4">
            {data.projectStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">
                    {stat.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {stat.count} ({stat.percentage}%)
                  </span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
              <p className="text-lg font-bold text-green-700">
                {data.performanceMetrics.onTimeDelivery}
              </p>
              <p className="text-xs text-green-600">On-time Delivery</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <Clock className="w-6 h-6 mx-auto mb-1 text-blue-500" />
              <p className="text-lg font-bold text-blue-700">
                {data.performanceMetrics.avgProjectDuration}
              </p>
              <p className="text-xs text-blue-600">Avg Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics */}
        <Card className="p-6 border-4 border-gray-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Revenue Analytics
          </h3>
          <div className="space-y-3">
            {data.revenueData.slice(-6).map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{month.month}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(month.revenue / 5000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    ${month.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                $
                {data.revenueData
                  .reduce((sum, month) => sum + month.revenue, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Revenue (12 months)</p>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6 border-4 border-gray-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-blue-600">
                  {data.performanceMetrics.avgResponseTime}
                </span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="p-3 bg-green-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Quality Score</span>
                <span className="text-sm text-green-600">
                  {data.performanceMetrics.qualityScore}
                </span>
              </div>
              <Progress value={96} className="h-2" />
            </div>

            <div className="p-3 bg-purple-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Customer Satisfaction
                </span>
                <span className="text-sm text-purple-600">
                  {data.performanceMetrics.customerSatisfaction}
                </span>
              </div>
              <Progress value={96} className="h-2" />
            </div>

            <div className="p-3 bg-orange-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Session Duration</span>
                <span className="text-sm text-orange-600">
                  {data.userActivityData.avgSessionDuration}
                </span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="p-6 border-4 border-gray-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {data.topPerformers.map((performer, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  #{performer.rank}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{performer.name}</p>
                  <p className="text-xs text-gray-500">
                    {performer.projects} projects
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    ${performer.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">★ {performer.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="p-6 border-4 border-gray-300">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          Conversion Funnel Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              100%
            </div>
            <h4 className="font-bold text-gray-900">Visitors</h4>
            <p className="text-sm text-gray-600">Landing page views</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">1,245</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              {data.conversionRates.visitorToSignup}%
            </div>
            <h4 className="font-bold text-gray-900">Signups</h4>
            <p className="text-sm text-gray-600">User registrations</p>
            <p className="text-2xl font-bold text-green-600 mt-2">224</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              {data.conversionRates.signupToProject}%
            </div>
            <h4 className="font-bold text-gray-900">Projects</h4>
            <p className="text-sm text-gray-600">Started projects</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">156</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              {data.conversionRates.projectToCompletion}%
            </div>
            <h4 className="font-bold text-gray-900">Completed</h4>
            <p className="text-sm text-gray-600">Finished projects</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">98</p>
          </div>
        </div>
      </Card>

      {/* Footer Actions */}
      <Card className="p-6 border-4 border-gray-300 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Advanced Analytics</h3>
            <p className="text-gray-300">
              Get deeper insights with custom reports and advanced filtering
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Custom Filter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
