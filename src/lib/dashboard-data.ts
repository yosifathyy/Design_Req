import {
  User,
  DesignRequest,
  Invoice,
  Notification,
  DashboardStats,
  Chat,
  ChatMessage,
  Badge,
} from "./dashboard-types";

export const mockUser: User = {
  id: "1",
  name: "Alex Designer",
  email: "alex@example.com",
  avatar: "/placeholder.svg",
  role: "user",
  xp: 850,
  level: 3,
  badges: [
    {
      id: "1",
      name: "First Request",
      icon: "🎯",
      description: "Submitted your first design request",
      unlockedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Chat Master",
      icon: "💬",
      description: "Sent 50 messages to designers",
      unlockedAt: "2024-02-01",
    },
  ],
  createdAt: "2024-01-01",
};

export const mockRequests: DesignRequest[] = [
  {
    id: "1",
    title: "Modern Logo Design",
    description:
      "Need a clean, modern logo for my tech startup. Looking for something minimalist with blue/green colors.",
    category: "logo",
    priority: "high",
    status: "in-progress",
    files: [
      {
        id: "1",
        name: "brand-guidelines.pdf",
        url: "/placeholder.svg",
        type: "application/pdf",
        size: 2048000,
        thumbnail: "/placeholder.svg",
      },
    ],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-22",
    userId: "1",
    designerId: "2",
    price: 299,
  },
  {
    id: "2",
    title: "Product Photo Editing",
    description:
      "Remove background and enhance 20 product photos for e-commerce store.",
    category: "photoshop",
    priority: "medium",
    status: "completed",
    files: [],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    userId: "1",
    designerId: "3",
    price: 150,
  },
  {
    id: "3",
    title: "Website UI Design",
    description:
      "Design landing page for SaaS product with modern, professional look.",
    category: "web-design",
    priority: "high",
    status: "delivered",
    files: [],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
    userId: "1",
    designerId: "2",
    price: 599,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    requestId: "1",
    amount: 299,
    status: "pending",
    dueDate: "2024-02-01",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    requestId: "2",
    amount: 150,
    status: "paid",
    dueDate: "2024-01-25",
    createdAt: "2024-01-15",
    paidAt: "2024-01-18",
  },
  {
    id: "3",
    requestId: "3",
    amount: 599,
    status: "paid",
    dueDate: "2024-01-20",
    createdAt: "2024-01-10",
    paidAt: "2024-01-19",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New message from designer",
    message: "Sarah sent you updates on your logo design",
    isRead: false,
    createdAt: "2024-01-25T10:30:00Z",
    actionUrl: "/chat/1",
  },
  {
    id: "2",
    type: "design-delivered",
    title: "Design completed!",
    message: "Your website UI design is ready for download",
    isRead: false,
    createdAt: "2024-01-25T09:15:00Z",
    actionUrl: "/downloads",
  },
  {
    id: "3",
    type: "invoice-due",
    title: "Invoice due soon",
    message: "Invoice #1 for $299 is due in 3 days",
    isRead: true,
    createdAt: "2024-01-24T14:00:00Z",
    actionUrl: "/payments",
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: "1",
    text: "Hi! I've started working on your logo design. I have a few questions about the style you're looking for.",
    senderId: "2",
    senderName: "Sarah Chen",
    senderType: "designer",
    timestamp: "2024-01-22T09:00:00Z",
  },
  {
    id: "2",
    text: "Great! I'm looking for something modern and clean, maybe with a tech feel to it. The company is called 'TechFlow'.",
    senderId: "1",
    senderName: "Alex Designer",
    senderType: "user",
    timestamp: "2024-01-22T09:15:00Z",
  },
  {
    id: "3",
    text: "Perfect! Here are some initial concepts. What do you think?",
    senderId: "2",
    senderName: "Sarah Chen",
    senderType: "designer",
    timestamp: "2024-01-22T11:30:00Z",
    files: [
      {
        id: "2",
        name: "logo-concepts-v1.png",
        url: "/placeholder.svg",
        type: "image/png",
        size: 1024000,
        thumbnail: "/placeholder.svg",
      },
    ],
  },
  {
    id: "4",
    text: "I love concept #2! Can we try it in different colors?",
    senderId: "1",
    senderName: "Alex Designer",
    senderType: "user",
    timestamp: "2024-01-22T14:00:00Z",
  },
];

export const mockChat: Chat = {
  id: "1",
  requestId: "1",
  participants: ["1", "2"],
  messages: mockMessages,
  isTyping: false,
  lastMessage: mockMessages[mockMessages.length - 1],
};

export const mockStats: DashboardStats = {
  totalRequests: 8,
  unreadChats: 2,
  dueInvoices: 1,
  xpProgress: {
    current: 850,
    target: 1000,
    level: 3,
  },
};

export const designCategories = [
  { id: "logo", name: "Logo Design", icon: "🎯", color: "bg-festival-orange" },
  {
    id: "photoshop",
    name: "Photo Editing",
    icon: "📸",
    color: "bg-festival-pink",
  },
  { id: "3d", name: "3D Design", icon: "🎲", color: "bg-festival-yellow" },
  {
    id: "web-design",
    name: "Web Design",
    icon: "💻",
    color: "bg-festival-coral",
  },
  {
    id: "branding",
    name: "Branding",
    icon: "🏷️",
    color: "bg-festival-magenta",
  },
  {
    id: "illustration",
    name: "Illustration",
    icon: "🎨",
    color: "bg-festival-amber",
  },
];
