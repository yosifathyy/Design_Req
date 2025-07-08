import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/lib/dashboard-data";
import {
  Bell,
  X,
  MessageCircle,
  Download,
  CreditCard,
  Settings,
  CheckCircle,
  Trash2,
} from "lucide-react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current || !overlayRef.current) return;

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "block" });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.fromTo(
        panelRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power2.out" },
      );
    } else {
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-5 h-5 text-festival-pink" />;
      case "design-delivered":
        return <Download className="w-5 h-5 text-festival-orange" />;
      case "invoice-due":
        return <CreditCard className="w-5 h-5 text-festival-yellow" />;
      case "system":
        return <Settings className="w-5 h-5 text-festival-coral" />;
      default:
        return <Bell className="w-5 h-5 text-black" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const removeNotification = (id: string) => {
    const notificationEl = document.querySelector(
      `[data-notification-id="${id}"]`,
    );
    if (notificationEl) {
      gsap.to(notificationEl, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        },
      });
    }
  };

  const clearAll = () => {
    const notificationElements = document.querySelectorAll(
      "[data-notification-id]",
    );
    gsap.to(notificationElements, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setNotifications([]);
      },
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 opacity-0"
        style={{ display: "none" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l-4 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] z-50 transform translate-x-full"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b-4 border-black bg-festival-cream">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-black" />
                <h2 className="text-2xl font-display font-bold text-black">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <Badge className="bg-festival-orange text-black border-2 border-black">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                  className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button
                  onClick={clearAll}
                  variant="outline"
                  size="sm"
                  className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-bold text-black mb-2">
                  All caught up!
                </h3>
                <p className="text-black/70">
                  No new notifications at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    data-notification-id={notification.id}
                    className={`p-4 border-b-2 border-black/10 hover:bg-festival-cream/50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-festival-yellow/20" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-white border-2 border-black rounded">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-black text-sm">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-festival-orange rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-black/70 text-sm mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-black/50">
                            {formatTime(notification.createdAt)}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 border-2 border-black opacity-50 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
