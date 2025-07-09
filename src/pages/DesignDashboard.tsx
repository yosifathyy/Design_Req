import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadCount } from "@/hooks/useRealtimeChat";
import {
  getUserProfile,
  getDesignRequests,
  getInvoices,
  createUserProfileIfMissing,
  findUserProfileByEmail,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import ProfileSetupNotice from "@/components/ProfileSetupNotice";
import IDMismatchNotice from "@/components/IDMismatchNotice";
import NewMessageNotification from "@/components/NewMessageNotification";
import MessagesInbox from "@/components/MessagesInbox";
import ProjectChatSelection from "@/components/ProjectChatSelection";
import {
  FileText,
  MessageCircle,
  CreditCard,
  Plus,
  Sparkles,
  Zap,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Bell,
  Calendar,
  Eye,
  ArrowRight,
  Palette,
  PaintBucket,
  Brush,
  Heart,
  Crown,
  Gift,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ProjectRequest {
  id: string;
  title: string;
  description: string;
  status:
    | "draft"
    | "submitted"
    | "in_review"
    | "in_progress"
    | "completed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  category: "logo" | "web" | "brand" | "print" | "packaging" | "other";
  created_at: string;
  updated_at: string;
  client_id: string;
  designer_id?: string;
  due_date?: string;
  budget?: number;
  attachments?: string[];
}

interface Invoice {
  id: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  due_date: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

interface IDMismatch {
  authId: string;
  dbId: string;
}

interface DashboardStats {
  totalRequests: number;
  activeProjects: number;
  completedProjects: number;
  totalEarnings: number;
  avgRating: number;
  dueInvoices: number;
  xpProgress: {
    current: number;
    target: number;
    level: number;
  };
}

const DesignDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount, refreshUnreadCount } = useUnreadCount();

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  // State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    avgRating: 4.8,
    dueInvoices: 0,
    xpProgress: {
      current: 10,
      target: 1000,
      level: 1,
    },
  });
  const [loading, setLoading] = useState(true);
  const [showMessagesInbox, setShowMessagesInbox] = useState(false);
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [profileSetupError, setProfileSetupError] = useState(false);
  const [idMismatch, setIdMismatch] = useState<IDMismatch | null>(null);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // First try to get user profile by auth ID
        let profile;
        try {
          profile = await getUserProfile(user.id);
        } catch (profileError) {
          console.log("⚠️ Profile not found by auth ID, searching by email...");

          if (user.email) {
            try {
              const foundProfile = await findUserProfileByEmail(user.email);
              if (foundProfile) {
                console.log("⚠️ Found profile with different ID:", {
                  authId: user.id,
                  dbId: foundProfile.id,
                });
                setIdMismatch({ authId: user.id, dbId: foundProfile.id });
                profile = foundProfile;
              }
            } catch (searchError) {
              console.log("No existing profile found, will create new one");
            }
          }

          if (!profile) {
            console.log("📝 Creating new user profile...");
            try {
              await createUserProfileIfMissing(
                user.id,
                user.email || "",
                user.user_metadata?.name || "",
              );
              profile = await getUserProfile(user.id);
              console.log("✅ User profile created successfully");
            } catch (createError) {
              console.error("❌ Error creating user profile:", createError);
              setProfileSetupError(true);
              return;
            }
          }
        }

        setUserProfile(profile);

        // Fetch design requests and invoices in parallel
        console.log("📡 Fetching design requests and invoices...");
        let requestsResponse = [];
        let invoicesResponse = [];

        try {
          requestsResponse = await getDesignRequests(user.id);
          console.log("✅ Design requests fetched:", requestsResponse.length);
        } catch (requestsError) {
          console.error("❌ Error fetching design requests:", requestsError);
          // Continue with empty array
        }

        try {
          invoicesResponse = await getInvoices();
          console.log("✅ Invoices fetched:", invoicesResponse.length);
        } catch (invoicesError) {
          console.error("❌ Error fetching invoices:", invoicesError);
          // Continue with empty array
        }

        setRequests(requestsResponse);

        // Calculate stats
        const totalRequests = requestsResponse.length;
        const activeProjects = requestsResponse.filter(
          (r) => r.status === "in_progress" || r.status === "in_review",
        ).length;
        const completedProjects = requestsResponse.filter(
          (r) => r.status === "completed",
        ).length;
        const dueInvoices = invoicesResponse.filter(
          (i) => i.status === "overdue",
        ).length;

        setStats((prev) => ({
          ...prev,
          totalRequests,
          activeProjects,
          completedProjects,
          dueInvoices,
        }));
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", {
          error,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Also log to see which specific API call failed
        if (error instanceof Error) {
          console.error("❌ Error details:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, user?.email, user?.user_metadata?.name]);

  // Animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Staggered entrance animation for all main sections
      gsap.set(
        [
          heroRef.current,
          statsRef.current,
          actionsRef.current,
          projectsRef.current,
        ],
        {
          opacity: 0,
          y: 20,
        },
      );

      gsap.to(
        [
          heroRef.current,
          statsRef.current,
          actionsRef.current,
          projectsRef.current,
        ],
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      );

      // Enhanced hover animations for stat cards
      gsap.utils.toArray(".stat-card").forEach((card: any) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.02,
            rotationY: 2,
            rotationX: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Enhanced hover animations for action cards
      gsap.utils.toArray(".action-card").forEach((card: any) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.03,
            rotationY: 3,
            rotationX: 2,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Project item animations
      gsap.utils
        .toArray(".project-item")
        .forEach((item: any, index: number) => {
          gsap.set(item, { opacity: 0, x: -20 });
          gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: 0.8 + index * 0.1,
            ease: "power2.out",
          });
        });

      // Special animation for unread chat card if there are unread messages
      if (unreadCount > 0) {
        const chatCard = document.querySelector(".unread-chat-card");
        if (chatCard) {
          gsap.to(chatCard, {
            scale: 1.01,
            duration: 2,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      }
    });

    return () => ctx.revert();
  }, [loading, unreadCount, requests]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "in_review":
        return "bg-purple-500";
      case "submitted":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-200 text-red-800";
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-festival-orange via-festival-pink to-festival-magenta flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <NewMessageNotification />

      <div className="min-h-screen bg-gradient-to-br from-festival-orange via-festival-pink to-festival-magenta relative overflow-hidden">
        {/* Static Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-20 left-20 w-32 h-32 bg-festival-coral/30 rounded-full blur-lg"></div>
          <div className="floating-element absolute top-1/3 right-10 w-24 h-24 bg-festival-yellow/40 transform rotate-45 blur-md"></div>
          <div className="floating-element absolute bottom-20 left-1/4 w-14 h-14 bg-festival-yellow/30 transform rotate-12 rounded-lg blur-sm"></div>
          <div className="floating-element absolute bottom-10 right-1/3 w-10 h-10 bg-festival-magenta/40 rounded-full blur-sm"></div>
          <div className="floating-element absolute top-1/2 left-10 w-8 h-8 bg-festival-coral/30 transform rotate-45 blur-sm"></div>
          <div className="floating-element absolute top-40 right-20 w-6 h-6 bg-festival-amber/40 rounded-full blur-sm"></div>
          <div className="floating-element absolute top-60 left-1/3 w-20 h-20 bg-festival-orange/20 rounded-full blur-md opacity-50"></div>
          <div className="floating-element absolute bottom-40 right-1/4 w-24 h-24 bg-festival-pink/20 transform rotate-12 rounded-lg blur-md opacity-50"></div>
        </div>

        {/* Overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/20 backdrop-blur-[0.5px]"></div>

        <div
          className="relative z-10 h-full flex flex-col p-2 sm:p-3 lg:p-4 max-w-7xl"
          style={{ margin: "71px auto 0 0" }}
        >
          {/* Notices */}
          {profileSetupError && <ProfileSetupNotice />}
          {idMismatch && (
            <IDMismatchNotice
              authId={idMismatch.authId}
              dbId={idMismatch.dbId}
            />
          )}

          <div style={{ paddingLeft: "74px", margin: "-28px auto 23px" }}>
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                {/* Compact Hero Section */}
                <div
                  ref={heroRef}
                  className="mb-2 relative bg-white/90 backdrop-blur-md rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 sm:p-3"
                  style={{ margin: "0 auto 8px 0" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <AvatarImage
                            src={userProfile?.avatar_url}
                            alt={userProfile?.name}
                          />
                          <AvatarFallback className="bg-festival-orange text-white text-sm sm:text-base font-bold">
                            {userProfile?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        {stats.xpProgress.level >= 5 && (
                          <Crown className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-black leading-tight">
                          Hey, {userProfile?.name?.split(" ")[0] || "Creator"}!
                          ✨
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-festival-orange text-black border border-black font-bold text-xs px-2 py-0.5">
                            <Star className="w-3 h-3 mr-1" />
                            Level {stats.xpProgress.level}
                          </Badge>
                          <Badge className="bg-festival-pink text-black border border-black font-bold text-xs px-2 py-0.5">
                            <Zap className="w-3 h-3 mr-1" />
                            {stats.xpProgress.current} XP
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="w-32 lg:w-40">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span>XP</span>
                          <span>
                            {stats.xpProgress.current}/{stats.xpProgress.target}
                          </span>
                        </div>
                        <Progress
                          value={
                            (stats.xpProgress.current /
                              stats.xpProgress.target) *
                            100
                          }
                          className="h-2 border border-black bg-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-6/12 ml-5 max-md:ml-0 max-md:w-full">
                {/* Compact Stats Grid */}
                <div
                  ref={statsRef}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-2"
                  style={{ margin: "28px auto 8px" }}
                >
                  {/* Total Requests */}
                  <Link to="/requests" className="flex flex-col">
                    <Card className="stat-card group relative bg-gradient-to-br from-festival-orange to-festival-coral border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px] mx-auto">
                      <div className="flex items-center justify-between mb-1">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        <Badge className="bg-white/20 text-white border-white/30 text-[10px] px-1 py-0.5">
                          Total
                        </Badge>
                      </div>
                      <div className="text-xl sm:text-2xl font-display font-bold text-white leading-none mb-0.5">
                        {stats.totalRequests}
                      </div>
                      <div className="text-white/90 font-medium text-xs">
                        Projects
                      </div>
                      <ArrowRight className="absolute top-1 right-1 w-3 h-3 text-white/60 group-hover:text-white transition-colors" />
                    </Card>
                  </Link>

                  {/* Unread Chats */}
                  <div
                    onClick={() => setShowMessagesInbox(true)}
                    className="flex flex-col"
                  >
                    <Card className="stat-card unread-chat-card group relative bg-gradient-to-br from-festival-pink to-festival-magenta border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px] mx-auto">
                      <div className="flex items-center justify-between mb-1">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-xl sm:text-2xl font-display font-bold text-white leading-none mb-0.5">
                        {unreadCount}
                      </div>
                      <div className="text-white/90 font-medium text-xs">
                        Messages
                      </div>
                      <ArrowRight className="absolute top-1 right-1 w-3 h-3 text-white/60 group-hover:text-white transition-colors" />
                    </Card>
                  </div>

                  {/* Active Projects */}
                  <Link to="/requests?filter=active" className="flex flex-col">
                    <Card className="stat-card group relative bg-gradient-to-br from-festival-yellow to-festival-amber border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px] mx-auto">
                      <div className="flex items-center justify-between mb-1">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                        <Badge className="bg-black/20 text-black border-black/30 text-[10px] px-1 py-0.5">
                          Active
                        </Badge>
                      </div>
                      <div className="text-xl sm:text-2xl font-display font-bold text-black leading-none mb-0.5">
                        {stats.activeProjects}
                      </div>
                      <div className="text-black/80 font-medium text-xs">
                        In Progress
                      </div>
                      <ArrowRight className="absolute top-1 right-1 w-3 h-3 text-black/60 group-hover:text-black transition-colors" />
                    </Card>
                  </Link>

                  {/* Completed Projects */}
                  <Link
                    to="/requests?filter=completed"
                    className="flex flex-col"
                  >
                    <Card className="stat-card group relative bg-gradient-to-br from-green-400 to-green-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px] mx-auto">
                      <div className="flex items-center justify-between mb-1">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        <Badge className="bg-white/20 text-white border-white/30 text-[10px] px-1 py-0.5">
                          Done
                        </Badge>
                      </div>
                      <div className="text-xl sm:text-2xl font-display font-bold text-white leading-none mb-0.5">
                        {stats.completedProjects}
                      </div>
                      <div className="text-white/90 font-medium text-xs">
                        Completed
                      </div>
                      <ArrowRight className="absolute top-1 right-1 w-3 h-3 text-white/60 group-hover:text-white transition-colors" />
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Main Content Grid */}
          <div
            className="flex-1 flex flex-col gap-2 min-h-0"
            style={{ margin: "49px auto -69px" }}
          >
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-1/3 max-md:ml-0 max-md:w-full">
                {/* Action Cards - Compact Row */}
                <div
                  ref={actionsRef}
                  className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2"
                >
                  <div
                    onClick={() => setShowProjectSelection(true)}
                    className="action-card"
                  >
                    <Card className="group relative bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 cursor-pointer p-3 h-full min-h-[80px] sm:min-h-[90px]">
                      <div className="flex sm:flex-col lg:flex-row items-center gap-2 h-full">
                        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                        <div className="flex-1 sm:text-center lg:text-left">
                          <h3 className="text-sm sm:text-base font-display font-bold text-white leading-tight">
                            Chat Designer
                          </h3>
                          <p className="text-white/80 text-xs hidden sm:block lg:hidden">
                            Start conversation
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white border border-white animate-bounce text-[10px] px-1 py-0.5">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </div>

                  <Link to="/new-request" className="action-card">
                    <Card className="group bg-gradient-to-br from-festival-magenta to-festival-pink border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 cursor-pointer p-3 h-full min-h-[80px] sm:min-h-[90px]">
                      <div className="flex sm:flex-col lg:flex-row items-center gap-2 h-full">
                        <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                        <div className="flex-1 sm:text-center lg:text-left">
                          <h3 className="text-sm sm:text-base font-display font-bold text-white leading-tight">
                            New Project
                          </h3>
                          <p className="text-white/80 text-xs hidden sm:block lg:hidden">
                            Create amazing
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  <Link to="/payments" className="action-card">
                    <Card className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 cursor-pointer p-3 h-full min-h-[80px] sm:min-h-[90px]">
                      <div className="flex sm:flex-col lg:flex-row items-center gap-2 h-full">
                        <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                        <div className="flex-1 sm:text-center lg:text-left">
                          <h3 className="text-sm sm:text-base font-display font-bold text-white leading-tight">
                            Invoices
                          </h3>
                          <p className="text-white/80 text-xs hidden sm:block lg:hidden">
                            Payments
                          </p>
                        </div>
                        {stats.dueInvoices > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black border border-white text-[10px] px-1 py-0.5">
                            {stats.dueInvoices}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col w-2/3 ml-5 max-md:ml-0 max-md:w-full">
                {/* Projects Section - Takes up remaining space */}
                <div className="lg:col-span-2 flex flex-col min-h-0">
                  <div
                    ref={projectsRef}
                    className="bg-white/90 backdrop-blur-md rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-start mt-3 mx-auto p-3 pr-5 min-h-[300px] lg:min-h-0"
                    style={{ width: "636.5px", padding: "12px 20px 93px 12px" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-base sm:text-lg font-display font-bold text-black flex items-center gap-2">
                        <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-festival-orange" />
                        <span className="-mt-1 mr-28">Recent Projects</span>
                      </h2>
                      <Link to="/requests">
                        <Button className="bg-festival-orange hover:bg-festival-coral border border-black font-bold text-xs px-2 py-1">
                          View All
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>

                    {requests.length > 0 ? (
                      <div className="flex-1 overflow-y-auto space-y-1">
                        {requests.slice(0, 4).map((request, index) => (
                          <Link
                            key={request.id}
                            to={`/requests/${request.id}`}
                            className="project-item group block"
                          >
                            <Card className="border border-black/20 hover:border-festival-orange hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-festival-orange/20 rounded-full flex items-center justify-center border border-festival-orange/30 flex-shrink-0">
                                  {request.category === "logo" && (
                                    <PaintBucket className="w-3 h-3 text-festival-orange" />
                                  )}
                                  {request.category === "web" && (
                                    <Brush className="w-3 h-3 text-festival-orange" />
                                  )}
                                  {request.category === "brand" && (
                                    <Sparkles className="w-3 h-3 text-festival-orange" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xs sm:text-sm font-bold text-black group-hover:text-festival-orange transition-colors truncate leading-tight">
                                    {request.title}
                                  </h3>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge
                                      className={`${getStatusColor(request.status)} text-white border-0 text-[10px] px-1 py-0.5`}
                                    >
                                      {request.status}
                                    </Badge>
                                    <Badge
                                      className={`${getPriorityColor(request.priority)} border-0 text-[10px] px-1 py-0.5`}
                                    >
                                      {request.priority}
                                    </Badge>
                                  </div>
                                </div>
                                <ArrowRight className="w-3 h-3 text-black/40 group-hover:text-festival-orange transition-colors flex-shrink-0" />
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 flex-1 flex flex-col justify-center">
                        <Gift className="w-8 h-8 text-festival-orange/50 mx-auto mb-2" />
                        <h3 className="text-sm font-bold text-black/60 mb-1">
                          No projects yet
                        </h3>
                        <p className="text-black/50 mb-3 text-xs">
                          Start your first design project!
                        </p>
                        <Link to="/new-request">
                          <Button className="bg-festival-orange hover:bg-festival-coral border border-black font-bold text-xs px-2 py-1">
                            <Plus className="w-3 h-3 mr-1" />
                            Create Project
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Inbox Modal */}
      <MessagesInbox
        isOpen={showMessagesInbox}
        onClose={() => {
          setShowMessagesInbox(false);
          // Force refresh of unread count when closing messages inbox
          setTimeout(() => {
            console.log(
              "🔄 Refreshing unread count after closing messages inbox",
            );
            refreshUnreadCount();
          }, 500);
        }}
        onOpenChat={(projectId) => {
          navigate(`/chat?request=${projectId}`);
        }}
      />

      {/* Project Chat Selection Modal */}
      <ProjectChatSelection
        isOpen={showProjectSelection}
        onClose={() => setShowProjectSelection(false)}
        onSelectProject={(projectId) => {
          navigate(`/chat?request=${projectId}`);
        }}
        onCreateNewProject={() => {
          navigate("/new-request");
        }}
      />
    </>
  );
};

export default DesignDashboard;
