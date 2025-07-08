import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockAuditLogs } from "@/lib/admin-data";
import {
  Shield,
  Search,
  Download,
  Filter,
  Calendar,
  User,
  Activity,
} from "lucide-react";

const AuditLogs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <User className="w-4 h-4" />;
    if (action.includes("role")) return <Shield className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const criticalLogs = mockAuditLogs.filter(
    (log) => log.severity === "critical",
  ).length;
  const todayLogs = mockAuditLogs.filter(
    (log) =>
      new Date(log.timestamp).toDateString() === new Date().toDateString(),
  ).length;

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            AUDIT & LOGS
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Security monitoring and activity tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-4 border-black">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="border-4 border-black">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center gap-4">
            <Activity className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {mockAuditLogs.length}
              </p>
              <p className="text-sm font-medium text-black/80">
                Total Log Entries
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-red-400 to-red-500 p-6">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-display font-bold text-white">
                {criticalLogs}
              </p>
              <p className="text-sm font-medium text-white/80">
                Critical Events
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-green-400 to-green-500 p-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {todayLogs}
              </p>
              <p className="text-sm font-medium text-black/80">
                Today's Activity
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            placeholder="Search audit logs..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
      </div>

      {/* Audit Logs */}
      <div className="space-y-4">
        {mockAuditLogs.map((log) => (
          <Card
            key={log.id}
            className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-black">
                      {log.action.replace(/\./g, " ").toUpperCase()}
                    </h3>
                    <Badge
                      className={`${getSeverityColor(log.severity)} border-2 border-black`}
                    >
                      {log.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-black/60">User</p>
                      <p className="font-medium text-black">{log.userName}</p>
                    </div>
                    <div>
                      <p className="text-black/60">Resource</p>
                      <p className="font-medium text-black">
                        {log.resource} {log.resourceId && `(${log.resourceId})`}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/60">IP Address</p>
                      <p className="font-medium text-black">{log.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-black/60">Timestamp</p>
                      <p className="font-medium text-black">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {log.details && (
                    <div className="p-3 bg-festival-cream border-2 border-black">
                      <p className="text-xs font-bold text-black mb-1">
                        Details:
                      </p>
                      <pre className="text-xs text-black/70 whitespace-pre-wrap">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {mockAuditLogs.length === 0 && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-black mb-2">No Audit Logs</h3>
          <p className="text-black/70">No audit log entries found.</p>
        </Card>
      )}
    </div>
  );
};

export default AuditLogs;
