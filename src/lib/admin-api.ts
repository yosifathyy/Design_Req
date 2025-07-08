import { supabase } from "./supabase";
import {
  getAdminUsers,
  getAdminProjects,
  getAdminInvoices,
  getSystemAlerts,
  getAuditLogs,
  getAdminAnalytics,
  getAllChatsForAdmin,
} from "./api";

export interface DashboardData {
  users: any[];
  projects: any[];
  invoices: any[];
  chats: any[];
  alerts: any[];
  analytics: any;
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl === "your-supabase-url" ||
      supabaseAnonKey === "your-supabase-anon-key" ||
      supabaseUrl.includes("placeholder")
    ) {
      console.warn("Supabase not configured - using fallback data");
      return {
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
    }

    // Fetch all dashboard data in parallel
    const [users, projects, invoices, chats, alerts, analytics] =
      await Promise.allSettled([
        getAdminUsers(),
        getAdminProjects(),
        getAdminInvoices(),
        getAllChatsForAdmin(),
        getSystemAlerts(),
        getAdminAnalytics(),
      ]);

    return {
      users: users.status === "fulfilled" ? users.value : [],
      projects: projects.status === "fulfilled" ? projects.value : [],
      invoices: invoices.status === "fulfilled" ? invoices.value : [],
      chats: chats.status === "fulfilled" ? chats.value : [],
      alerts: alerts.status === "fulfilled" ? alerts.value : [],
      analytics:
        analytics.status === "fulfilled"
          ? analytics.value
          : {
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
  } catch (error: any) {
    console.error("Failed to fetch dashboard data:", error.message);
    throw error;
  }
};

// Real-time subscription hooks
export const subscribeToAdminUpdates = (callback: (data: any) => void) => {
  const subscriptions: any[] = [];

  // Subscribe to users table changes
  const usersSubscription = supabase
    .channel("admin-users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      (payload) => {
        callback({ type: "users", payload });
      },
    )
    .subscribe();

  // Subscribe to design_requests table changes
  const projectsSubscription = supabase
    .channel("admin-projects")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "design_requests" },
      (payload) => {
        callback({ type: "projects", payload });
      },
    )
    .subscribe();

  // Subscribe to messages table changes
  const messagesSubscription = supabase
    .channel("admin-messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (payload) => {
        callback({ type: "messages", payload });
      },
    )
    .subscribe();

  // Subscribe to system_alerts table changes
  const alertsSubscription = supabase
    .channel("admin-alerts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "system_alerts" },
      (payload) => {
        callback({ type: "alerts", payload });
      },
    )
    .subscribe();

  subscriptions.push(
    usersSubscription,
    projectsSubscription,
    messagesSubscription,
    alertsSubscription,
  );

  // Return cleanup function
  return () => {
    subscriptions.forEach((sub) => {
      supabase.removeChannel(sub);
    });
  };
};

// Admin actions
export const respondToChat = async (
  chatId: string,
  message: string,
  adminUserId: string,
) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          sender_id: adminUserId,
          text: message,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Failed to send message:", error.message);
    throw error;
  }
};

export const updateUserRole = async (
  userId: string,
  newRole: string,
  adminUserId: string,
) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // Log the role change
    await supabase.from("audit_logs").insert([
      {
        user_id: adminUserId,
        action: "user.role.changed",
        resource: "user",
        resource_id: userId,
        details: { newRole, userId },
        ip_address: "127.0.0.1", // Should get real IP
        user_agent: navigator.userAgent,
        severity: "medium",
      },
    ]);

    return data;
  } catch (error: any) {
    console.error("Failed to update user role:", error.message);
    throw error;
  }
};

export const suspendUser = async (userId: string, adminUserId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ status: "suspended" })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // Log the suspension
    await supabase.from("audit_logs").insert([
      {
        user_id: adminUserId,
        action: "user.suspended",
        resource: "user",
        resource_id: userId,
        details: { userId, reason: "Admin action" },
        ip_address: "127.0.0.1", // Should get real IP
        user_agent: navigator.userAgent,
        severity: "high",
      },
    ]);

    return data;
  } catch (error: any) {
    console.error("Failed to suspend user:", error.message);
    throw error;
  }
};

export const activateUser = async (userId: string, adminUserId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ status: "active" })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // Log the activation
    await supabase.from("audit_logs").insert([
      {
        user_id: adminUserId,
        action: "user.activated",
        resource: "user",
        resource_id: userId,
        details: { userId },
        ip_address: "127.0.0.1", // Should get real IP
        user_agent: navigator.userAgent,
        severity: "low",
      },
    ]);

    return data;
  } catch (error: any) {
    console.error("Failed to activate user:", error.message);
    throw error;
  }
};
