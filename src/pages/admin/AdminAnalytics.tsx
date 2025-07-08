import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAnalyticsData } from "@/lib/admin-data";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Activity,
  Download,
  Calendar,
  Target,
  Zap,
} from "lucide-react";

const AdminAnalytics: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  const analytics = mockAnalyticsData;

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            ANALYTICS DASHBOARD
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Business insights and performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-4 border-black">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-black" />
            <TrendingUp className="w-5 h-5 text-black/60" />
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-black">
              {analytics.clientEngagement.activeSessions}
            </p>
            <p className="text-sm font-medium text-black/80">Active Sessions</p>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-pink to-festival-magenta p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-white" />
            <TrendingUp className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-white">
              {analytics.clientEngagement.requestsPerWeek}
            </p>
            <p className="text-sm font-medium text-white/80">Requests/Week</p>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-black" />
            <TrendingUp className="w-5 h-5 text-black/60" />
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-black">
              $
              {analytics.financialMetrics.monthlyRecurringRevenue.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-black/80">Monthly Revenue</p>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-green-400 to-green-500 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-black" />
            <TrendingUp className="w-5 h-5 text-black/60" />
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-black">
              {(analytics.systemHealth.uptime * 100).toFixed(1)}%
            </p>
            <p className="text-sm font-medium text-black/80">System Uptime</p>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Engagement */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">
                Client Engagement
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  {analytics.clientEngagement.activeSessions}
                </p>
                <p className="text-sm text-black/70">Active Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  {analytics.clientEngagement.requestsPerWeek}
                </p>
                <p className="text-sm text-black/70">Requests/Week</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">
                    Client Retention
                  </span>
                  <span className="text-sm font-bold">
                    {(
                      analytics.clientEngagement.clientRetentionRate * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-black/20 border-2 border-black">
                  <div
                    className="h-full bg-gradient-to-r from-festival-orange to-festival-coral"
                    style={{
                      width: `${analytics.clientEngagement.clientRetentionRate * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">
                    Avg Project Value
                  </span>
                  <span className="text-sm font-bold">
                    ${analytics.clientEngagement.averageProjectValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Designer Productivity */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">
                Designer Productivity
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  {analytics.designerProductivity.averageTurnaroundTime}d
                </p>
                <p className="text-sm text-black/70">Avg Turnaround</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  {analytics.designerProductivity.completedRequestsThisMonth}
                </p>
                <p className="text-sm text-black/70">Completed This Month</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">
                    Utilization Rate
                  </span>
                  <span className="text-sm font-bold">
                    {(
                      analytics.designerProductivity.utilizationRate * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-black/20 border-2 border-black">
                  <div
                    className="h-full bg-gradient-to-r from-festival-pink to-festival-magenta"
                    style={{
                      width: `${analytics.designerProductivity.utilizationRate * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">Customer Rating</span>
                  <span className="text-sm font-bold">
                    {analytics.designerProductivity.customerSatisfaction}/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Metrics */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">
                Financial Performance
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  $
                  {analytics.financialMetrics.monthlyRecurringRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-black/70">Monthly Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  ${analytics.financialMetrics.averageInvoiceSize}
                </p>
                <p className="text-sm text-black/70">Avg Invoice</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">Collection Rate</span>
                  <span className="text-sm font-bold">
                    {(analytics.financialMetrics.collectionRate * 100).toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-black/20 border-2 border-black">
                  <div
                    className="h-full bg-gradient-to-r from-festival-yellow to-festival-amber"
                    style={{
                      width: `${analytics.financialMetrics.collectionRate * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">
                    Outstanding Balance
                  </span>
                  <span className="text-sm font-bold">
                    $
                    {analytics.financialMetrics.outstandingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* System Health */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-green-400 to-green-500">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">System Health</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  {(analytics.systemHealth.uptime * 100).toFixed(2)}%
                </p>
                <p className="text-sm text-black/70">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black">
                  {analytics.systemHealth.activeUsers}
                </p>
                <p className="text-sm text-black/70">Active Users</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">Error Rate</span>
                  <span className="text-sm font-bold">
                    {(analytics.systemHealth.errorRate * 100).toFixed(3)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-black/20 border-2 border-black">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${Math.max(analytics.systemHealth.errorRate * 100, 2)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-black/70">Avg Load Time</span>
                  <span className="text-sm font-bold">
                    {analytics.systemHealth.averageLoadTime}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
