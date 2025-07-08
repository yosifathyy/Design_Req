export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "designer" | "user";
  avatar?: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: Permission[];
  skills?: string[];
  assignedProjects?: string[];
}

export interface Permission {
  id: string;
  name: string;
  category:
    | "users"
    | "projects"
    | "invoices"
    | "content"
    | "analytics"
    | "system";
  description: string;
}

export interface AdminProject {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  designerId?: string;
  designerName?: string;
  status: "new" | "in-progress" | "needs-feedback" | "revisions" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  timeline: ProjectTimelineEntry[];
  tasks: ProjectTask[];
  assets: ProjectAsset[];
  estimatedHours?: number;
  actualHours?: number;
  budget?: number;
}

export interface ProjectTimelineEntry {
  id: string;
  type:
    | "created"
    | "assigned"
    | "status-change"
    | "comment"
    | "file-upload"
    | "completed";
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  data?: any;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: "todo" | "in-progress" | "completed";
  dueDate?: string;
  createdAt: string;
  subtasks?: ProjectSubtask[];
}

export interface ProjectSubtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ProjectAsset {
  id: string;
  name: string;
  type: "reference" | "deliverable" | "revision";
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  mimeType: string;
}

export interface AdminInvoice {
  id: string;
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  amount: number;
  lineItems: InvoiceLineItem[];
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
  dueDate: string;
  notes?: string;
  paymentMethod?: string;
  taxRate?: number;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: "design" | "revision" | "rush" | "consultation";
}

export interface AdminChat {
  id: string;
  projectId: string;
  participants: AdminUser[];
  messages: AdminChatMessage[];
  unreadCount: number;
  lastActivity: string;
  status: "active" | "archived";
}

export interface AdminChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: "text" | "file" | "system";
  files?: ProjectAsset[];
  readBy: string[];
  reactions?: MessageReaction[];
  editedAt?: string;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  source: "system" | "payment" | "user" | "project";
}

export interface AnalyticsData {
  clientEngagement: {
    activeSessions: number;
    requestsPerWeek: number;
    averageProjectValue: number;
    clientRetentionRate: number;
  };
  designerProductivity: {
    averageTurnaroundTime: number;
    completedRequestsThisMonth: number;
    utilizationRate: number;
    customerSatisfaction: number;
  };
  financialMetrics: {
    monthlyRecurringRevenue: number;
    averageInvoiceSize: number;
    outstandingBalance: number;
    collectionRate: number;
  };
  systemHealth: {
    uptime: number;
    errorRate: number;
    averageLoadTime: number;
    activeUsers: number;
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SystemSettings {
  company: {
    name: string;
    logo: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  business: {
    currency: string;
    taxRate: number;
    timezone: string;
    language: string;
    fiscalYearStart: string;
  };
  integrations: {
    paypal: {
      enabled: boolean;
      clientId: string;
      webhookUrl: string;
    };
    email: {
      provider: string;
      smtpHost: string;
      smtpPort: number;
      username: string;
    };
    analytics: {
      googleAnalytics: string;
      mixpanel: string;
    };
  };
  features: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    chatEnabled: boolean;
    notificationsEnabled: boolean;
  };
}
