export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin" | "designer";
  xp: number;
  level: number;
  badges: Badge[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface DesignRequest {
  id: string;
  title: string;
  description: string;
  category:
    | "logo"
    | "photoshop"
    | "3d"
    | "web-design"
    | "branding"
    | "illustration";
  priority: "low" | "medium" | "high";
  status: "draft" | "submitted" | "in-progress" | "completed" | "delivered";
  files: DesignFile[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  designerId?: string;
  price: number;
}

export interface DesignFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  thumbnail?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderType: "user" | "designer";
  timestamp: string;
  files?: DesignFile[];
}

export interface Chat {
  id: string;
  requestId: string;
  participants: string[];
  messages: ChatMessage[];
  isTyping: boolean;
  lastMessage?: ChatMessage;
}

export interface Invoice {
  id: string;
  requestId: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

export interface Notification {
  id: string;
  type: "message" | "design-delivered" | "invoice-due" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardStats {
  totalRequests: number;
  unreadChats: number;
  dueInvoices: number;
  xpProgress: {
    current: number;
    target: number;
    level: number;
  };
}
