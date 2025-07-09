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
  status: string;
  created_at: string;
  priority: string;
  category: string;
}

const DesignDashboard: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeProjects: 0,
    completedProjects: 0,
    dueInvoices: 0,
    xpProgress: {
      current: 0,
      target: 1000,
      level: 1,
    },
  });
  const [loading, setLoading] = useState(true);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [profileSetupError, setProfileSetupError] = useState(false);
  const [idMismatch, setIdMismatch] = useState<{
    authId: string;
    dbId: string;
  } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [lastUnreadCount, setLastUnreadCount] = useState(0);
  const [showMessagesInbox, setShowMessagesInbox] = useState(false);
  const [showProjectSelection, setShowProjectSelection] = useState(false);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { unreadCount, refreshUnreadCount } = useUnreadCount();

  // Real-time update for unread count changes
  useEffect(() => {
    if (unreadCount > lastUnreadCount && lastUnreadCount >= 0) {
      // Show notification when new messages arrive
      setShowNotification(true);

      // Add a subtle animation when unread count changes
      const chatCard = document.querySelector(".unread-chat-card");
      if (chatCard) {
        gsap.to(chatCard, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }
    } else if (unreadCount === 0 && lastUnreadCount > 0) {
      // Hide notification when all messages are read
      console.log("📭 All messages read, hiding notification");
      setShowNotification(false);
    }
    setLastUnreadCount(unreadCount);
  }, [unreadCount, lastUnreadCount]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user profile
        let profile = await getUserProfile(user.id);

        // Handle ID mismatches
        if (!profile && user.email) {
          profile = await findUserProfileByEmail(user.email);
          if (profile && profile.id !== user.id) {
            setIdMismatch({ authId: user.id, dbId: profile.id });
          }
        }

        // Create profile if missing
        if (!profile && user.email) {
          setIsCreatingProfile(true);
          setProfileSetupError(false);

          profile = await createUserProfileIfMissing(
            user.id,
            user.email,
            user.user_metadata?.name || user.email.split("@")[0],
          );

          setIsCreatingProfile(false);

          if (!profile) {
            setProfileSetupError(true);
          }
        }

        // Fallback profile
        if (!profile) {
          profile = {
            id: user.id,
            email: user.email || "unknown@example.com",
            name: user.email?.split("@")[0] || "User",
            xp: 0,
            level: 1,
            role: "user",
            status: "active",
          };
        }

        setUserProfile(profile);

        // Fetch requests
        const requestsData = await getDesignRequests(user.id);
        setRequests(requestsData);

        // Fetch invoices
        const invoices = await getInvoices(user.id);
        const pendingInvoices = invoices.filter(
          (inv) => inv.status === "pending",
        );

        // Calculate stats
        const activeProjects = requestsData.filter(
          (req) => req.status === "in-progress" || req.status === "submitted",
        ).length;
        const completedProjects = requestsData.filter(
          (req) => req.status === "completed" || req.status === "delivered",
        ).length;

        const currentProfile = profile || { level: 1, xp: 0 };
        const xpTarget = currentProfile.level * 1000;

        setStats({
          totalRequests: requestsData.length,
          activeProjects,
          completedProjects,
          dueInvoices: pendingInvoices.length,
          xpProgress: {
            current: currentProfile.xp,
            target: xpTarget,
            level: currentProfile.level,
          },
        });
      } catch (error: any) {
        console.error("Error fetching user data:", error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (!containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      // Enhanced page load animation sequence
      const mainTl = gsap.timeline();

      // Background elements entrance
      const backgroundElements =
        containerRef.current?.querySelectorAll(".floating-element");
      if (backgroundElements) {
        gsap.set(backgroundElements, { opacity: 0, scale: 0 });
        gsap.to(backgroundElements, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
        });
      }

      // Hero section with dramatic entrance
      if (heroRef.current) {
        mainTl.fromTo(
          heroRef.current,
          {
            opacity: 0,
            y: -30,
            scale: 0.9,
            rotateX: -15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            ease: "power3.out",
          },
        );
      }

      // Stats cards with enhanced stagger and physics
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-card");
        mainTl.fromTo(
          statCards,
          {
            opacity: 0,
            y: 40,
            scale: 0.8,
            rotateY: -30,
            z: -100,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            z: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.2)",
          },
          "-=0.4",
        );
      }

      // Action cards with spring physics
      if (actionsRef.current) {
        const actionCards = actionsRef.current.querySelectorAll(".action-card");
        mainTl.fromTo(
          actionCards,
          {
            opacity: 0,
            scale: 0.7,
            rotation: -10,
            x: -50,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.3",
        );
      }

      // Projects section with slide-in effect
      if (projectsRef.current) {
        mainTl.fromTo(
          projectsRef.current,
          {
            opacity: 0,
            x: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        );

        // Animate project items when they appear
        const projectItems =
          projectsRef.current.querySelectorAll(".project-item");
        if (projectItems.length > 0) {
          gsap.fromTo(
            projectItems,
            { opacity: 0, x: 20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.5,
            },
          );
        }
      }

      // Enhanced floating animations with varied movement
      gsap.to(".floating-element", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-20, 20)",
        scale: "random(0.8, 1.2)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random",
        },
      });

      // Enhanced hover interactions for all cards
      const allCards = document.querySelectorAll(".stat-card, .action-card");
      allCards.forEach((card, index) => {
        // Subtle breathing animation
        gsap.to(card, {
          scale: 1.01,
          duration: 3 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.03,
            rotateY: 3,
            z: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1.01,
            rotateY: 0,
            z: 0,
            boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Periodic subtle animations to keep interface alive
      gsap.to(".stat-card", {
        y: "random(-2, 2)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading, requests.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "submitted":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 border-6 border-festival-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-display font-bold text-black mb-2">
            Loading your creative space...
          </h2>
          <p className="text-lg text-black/70">
            Getting everything ready for you ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* New Message Notification */}
      <NewMessageNotification
        show={showNotification}
        count={unreadCount}
        onClose={() => setShowNotification(false)}
        onClick={() => {
          setShowNotification(false);
          setShowMessagesInbox(true);
        }}
      />

      <div
        ref={containerRef}
        className="h-screen bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://cdn.builder.io/api/v1/image/assets%2F847ced7118144d42aa3c3a20eefb4087%2Fb37ab6171c61405ab176b52f9c1859bb)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-10 left-5 w-16 h-16 bg-festival-orange/30 transform rotate-45 rounded-lg blur-sm"></div>
          <div className="floating-element absolute top-20 right-10 w-12 h-12 bg-festival-pink/40 rounded-full blur-sm"></div>
          <div className="floating-element absolute bottom-20 left-1/4 w-14 h-14 bg-festival-yellow/30 transform rotate-12 rounded-lg blur-sm"></div>
          <div className="floating-element absolute bottom-10 right-1/3 w-10 h-10 bg-festival-magenta/40 rounded-full blur-sm"></div>
          <div className="floating-element absolute top-1/2 left-10 w-8 h-8 bg-festival-coral/30 transform rotate-45 blur-sm"></div>
          <div className="floating-element absolute top-40 right-20 w-6 h-6 bg-festival-amber/40 rounded-full blur-sm"></div>
          <div className="floating-element absolute top-60 left-1/3 w-20 h-20 bg-festival-orange/20 rounded-full blur-md opacity-50"></div>
          <div className="floating-element absolute bottom-40 right-1/4 w-24 h-24 bg-festival-pink/20 transform rotate-12 rounded-lg blur-md opacity-50"></div>
        </div>

        {/* Overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/20 backdrop-blur-[0.5px]"></div>

        <div className="relative z-10 h-full flex flex-col p-2 sm:p-3 lg:p-4 max-w-7xl mx-auto">
          {/* Notices */}
          {profileSetupError && <ProfileSetupNotice />}
          {idMismatch && (
            <IDMismatchNotice
              authId={idMismatch.authId}
              dbId={idMismatch.dbId}
            />
          )}

          {/* Compact Hero Section */}
          <div
            ref={heroRef}
            className="mb-2 relative bg-white/90 backdrop-blur-md rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 sm:p-3"
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
                    Hey, {userProfile?.name?.split(" ")[0] || "Creator"}! ✨
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
                      (stats.xpProgress.current / stats.xpProgress.target) * 100
                    }
                    className="h-2 border border-black bg-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Compact Stats Grid */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2"
          >
            {/* Total Requests */}
            <Link to="/requests">
              <Card className="stat-card group relative bg-gradient-to-br from-festival-orange to-festival-coral border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px]">
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
            <div onClick={() => setShowMessagesInbox(true)}>
              <Card className="stat-card unread-chat-card group relative bg-gradient-to-br from-festival-pink to-festival-magenta border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px]">
                <div className="flex items-center justify-between mb-1">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white border border-white animate-pulse text-[10px] px-1 py-0.5">
                      {unreadCount}!
                    </Badge>
                  )}
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
            <Link to="/requests?filter=active">
              <Card className="stat-card group relative bg-gradient-to-br from-festival-yellow to-festival-amber border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px]">
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
            <Link to="/requests?filter=completed">
              <Card className="stat-card group relative bg-gradient-to-br from-green-400 to-green-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-2 min-h-[70px] sm:min-h-[80px]">
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

          {/* Compact Main Content Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 min-h-0">
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

            {/* Projects Section - Takes up remaining space */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <div
                ref={projectsRef}
                className="bg-white/90 backdrop-blur-md rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-start mt-3 mx-auto p-3 pr-5 min-h-[300px] lg:min-h-0"
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
