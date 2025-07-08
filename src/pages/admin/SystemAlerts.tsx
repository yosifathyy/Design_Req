import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSystemAlerts, markAlertAsRead } from "@/lib/api";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Bell,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";

const SystemAlerts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const alertsData = await getSystemAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to load alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-500 bg-red-50";
      case "warning":
        return "border-yellow-500 bg-yellow-50";
      case "success":
        return "border-green-500 bg-green-50";
      case "info":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const criticalAlerts = alerts.filter(
    (alert) => alert.type === "error" && !alert.is_read,
  );
  const warningAlerts = alerts.filter(
    (alert) => alert.type === "warning" && !alert.is_read,
  );
  const unreadAlerts = alerts.filter((alert) => !alert.is_read);

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId);
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId ? { ...alert, is_read: true } : alert,
        ),
      );
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(unreadAlerts.map((alert) => markAlertAsRead(alert.id)));
      setAlerts(alerts.map((alert) => ({ ...alert, is_read: true })));
    } catch (error) {
      console.error("Failed to mark all alerts as read:", error);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            SYSTEM ALERTS
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Monitor system health and critical notifications
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-4 border-black"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="border-4 border-black"
            disabled={unreadAlerts.length === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read ({unreadAlerts.length})
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-red-400 to-red-500 p-6">
          <div className="flex items-center gap-4">
            <XCircle className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-display font-bold text-white">
                {criticalAlerts.length}
              </p>
              <p className="text-sm font-medium text-white/80">
                Critical Errors
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-yellow-400 to-yellow-500 p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {warningAlerts.length}
              </p>
              <p className="text-sm font-medium text-black/80">
                Active Warnings
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center gap-4">
            <Bell className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {unreadAlerts.length}
              </p>
              <p className="text-sm font-medium text-black/80">Unread Alerts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {mockSystemAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={`border-4 ${getAlertColor(alert.type)} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 ${
              !alert.isRead ? "border-l-8" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-black">
                      {alert.title}
                    </h3>
                    <Badge
                      className={`${
                        alert.type === "error"
                          ? "bg-red-500"
                          : alert.type === "warning"
                            ? "bg-yellow-500"
                            : alert.type === "success"
                              ? "bg-green-500"
                              : "bg-blue-500"
                      } text-white border-2 border-black`}
                    >
                      {alert.type.toUpperCase()}
                    </Badge>
                    {!alert.isRead && (
                      <Badge className="bg-festival-orange text-black border-2 border-black">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <p className="text-black/70 mb-3">{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-black/60">
                      Source: {alert.source}
                    </span>
                    <span className="text-black/60">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {alert.actionUrl && (
                  <Button
                    onClick={() => window.open(alert.actionUrl, "_blank")}
                    variant="outline"
                    size="sm"
                    className="border-4 border-black"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (confirm("Delete this alert?")) {
                      console.log("Deleting alert:", alert.id);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-4 border-black"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {mockSystemAlerts.length === 0 && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-black mb-2">All Clear!</h3>
          <p className="text-black/70">
            No system alerts at the moment. Everything is running smoothly.
          </p>
        </Card>
      )}
    </div>
  );
};

export default SystemAlerts;
