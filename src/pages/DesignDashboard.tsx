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
  const unreadCount = useUnreadCount();

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
      // Initial page load animation
      const tl = gsap.timeline();

      // Hero section animation
      if (heroRef.current) {
        tl.fromTo(
          heroRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.2)" },
        );
      }

      // Stats cards stagger animation
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-card");
        tl.fromTo(
          statCards,
          { opacity: 0, y: 60, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.6",
        );
      }

      // Quick actions animation
      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current.children,
          { opacity: 0, scale: 0.8, rotation: -5 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.4",
        );
      }

      // Projects section
      if (projectsRef.current) {
        tl.fromTo(
          projectsRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.3",
        );
      }

      // Floating animations for decorative elements
      gsap.to(".floating-element", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-15, 15)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.5,
      });

      // Hover animations for stat cards
      const statCards = document.querySelectorAll(".stat-card");
      statCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            rotateY: 5,
            z: 50,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            rotateY: 0,
            z: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

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
          navigate("/chat");
        }}
      />

      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-festival-orange/20 transform rotate-45 rounded-lg"></div>
          <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-festival-pink/20 rounded-full"></div>
          <div className="floating-element absolute bottom-32 left-1/4 w-28 h-28 bg-festival-yellow/20 transform rotate-12 rounded-lg"></div>
          <div className="floating-element absolute bottom-20 right-1/3 w-20 h-20 bg-festival-magenta/20 rounded-full"></div>
          <div className="floating-element absolute top-1/2 left-20 w-16 h-16 bg-festival-coral/20 transform rotate-45"></div>
          <div className="floating-element absolute top-60 right-40 w-12 h-12 bg-festival-amber/20 rounded-full"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Notices */}
          {profileSetupError && <ProfileSetupNotice />}
          {idMismatch && (
            <IDMismatchNotice
              authId={idMismatch.authId}
              dbId={idMismatch.dbId}
            />
          )}

          {/* Hero Section */}
          <div
            ref={heroRef}
            className="mb-8 sm:mb-12 relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 lg:p-8"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
                <div className="relative">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <AvatarImage
                      src={userProfile?.avatar_url}
                      alt={userProfile?.name}
                    />
                    <AvatarFallback className="bg-festival-orange text-white text-xl sm:text-2xl font-bold">
                      {userProfile?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  {stats.xpProgress.level >= 5 && (
                    <Crown className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-black mb-2">
                    Welcome back,{" "}
                    {userProfile?.name?.split(" ")[0] || "Creator"}!
                  </h1>
                  <p className="text-lg sm:text-xl text-black/70 font-medium mb-3">
                    Ready to bring amazing ideas to life? ✨
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
                    <Badge className="bg-festival-orange text-black border-2 border-black font-bold">
                      <Star className="w-4 h-4 mr-1" />
                      Level {stats.xpProgress.level} Creator
                    </Badge>
                    <Badge className="bg-festival-pink text-black border-2 border-black font-bold">
                      <Zap className="w-4 h-4 mr-1" />
                      {stats.xpProgress.current} XP
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right w-full lg:w-auto">
                <div className="text-sm text-black/60 mb-2">
                  Member since{" "}
                  {userProfile?.created_at
                    ? new Date(userProfile.created_at).toLocaleDateString()
                    : "recently"}
                </div>
                <div className="w-full sm:w-64 lg:w-48 mx-auto lg:mx-0">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>XP Progress</span>
                    <span>
                      {stats.xpProgress.current}/{stats.xpProgress.target}
                    </span>
                  </div>
                  <Progress
                    value={
                      (stats.xpProgress.current / stats.xpProgress.target) * 100
                    }
                    className="h-3 border-2 border-black bg-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {/* Total Requests */}
            <Link to="/requests">
              <Card className="stat-card group relative bg-gradient-to-br from-festival-orange to-festival-coral border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-4 sm:p-6 min-h-[140px] sm:min-h-[160px]">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-12 h-12 text-white" />
                  <Badge className="bg-white/20 text-white border-white/30">
                    All Time
                  </Badge>
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  {stats.totalRequests}
                </div>
                <div className="text-white/90 font-medium mb-3">
                  Total Projects
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View all projects
                </div>
                <ArrowRight className="absolute top-6 right-6 w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              </Card>
            </Link>

            {/* Unread Chats */}
            <div onClick={() => setShowMessagesInbox(true)}>
              <Card className="stat-card unread-chat-card group relative bg-gradient-to-br from-festival-pink to-festival-magenta border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-4 sm:p-6 min-h-[140px] sm:min-h-[160px]">
                <div className="flex items-center justify-between mb-4">
                  <MessageCircle className="w-12 h-12 text-white" />
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white border-2 border-white animate-pulse">
                      {unreadCount} New!
                    </Badge>
                  )}
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  {unreadCount}
                </div>
                <div className="text-white/90 font-medium mb-3">
                  Unread Messages
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Check conversations
                </div>
                <ArrowRight className="absolute top-6 right-6 w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              </Card>
            </div>

            {/* Active Projects */}
            <Link to="/requests?filter=active">
              <Card className="stat-card group relative bg-gradient-to-br from-festival-yellow to-festival-amber border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-12 h-12 text-black" />
                  <Badge className="bg-black/20 text-black border-black/30">
                    In Progress
                  </Badge>
                </div>
                <div className="text-4xl font-display font-bold text-black mb-2">
                  {stats.activeProjects}
                </div>
                <div className="text-black/80 font-medium mb-3">
                  Active Projects
                </div>
                <div className="flex items-center text-black/70 text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Track progress
                </div>
                <ArrowRight className="absolute top-6 right-6 w-6 h-6 text-black/60 group-hover:text-black transition-colors" />
              </Card>
            </Link>

            {/* Completed Projects */}
            <Link to="/requests?filter=completed">
              <Card className="stat-card group relative bg-gradient-to-br from-green-400 to-green-600 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                  <Badge className="bg-white/20 text-white border-white/30">
                    Success!
                  </Badge>
                </div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  {stats.completedProjects}
                </div>
                <div className="text-white/90 font-medium mb-3">
                  Completed Projects
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Heart className="w-4 h-4 mr-2" />
                  View portfolio
                </div>
                <ArrowRight className="absolute top-6 right-6 w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              </Card>
            </Link>
          </div>

          {/* Quick Actions */}
          <div
            ref={actionsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            <Link to="/new-request">
              <Card className="group bg-gradient-to-br from-festival-magenta to-festival-pink border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 cursor-pointer p-8 text-center">
                <Plus className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Start New Project
                </h3>
                <p className="text-white/80 font-medium">
                  Let's create something amazing together!
                </p>
              </Card>
            </Link>

            <div onClick={() => setShowProjectSelection(true)}>
              <Card className="group relative bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 cursor-pointer p-8 text-center">
                <MessageCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Chat with Designer
                </h3>
                <p className="text-white/80 font-medium">
                  Choose project to chat about
                </p>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-white animate-bounce">
                    {unreadCount}
                  </Badge>
                )}
              </Card>
            </div>

            <Link to="/payments">
              <Card className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 cursor-pointer p-8 text-center">
                <CreditCard className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  View Invoices
                </h3>
                <p className="text-white/80 font-medium">
                  Manage payments and billing
                </p>
                {stats.dueInvoices > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black border-2 border-white">
                    {stats.dueInvoices}
                  </Badge>
                )}
              </Card>
            </Link>
          </div>

          {/* Recent Projects */}
          <div
            ref={projectsRef}
            className="bg-white/80 backdrop-blur-sm rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-black flex items-center gap-3">
                <Palette className="w-8 h-8 text-festival-orange" />
                Recent Projects
              </h2>
              <Link to="/requests">
                <Button className="bg-festival-orange hover:bg-festival-coral border-2 border-black font-bold">
                  View All Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {requests.length > 0 ? (
              <div className="grid gap-4">
                {requests.slice(0, 3).map((request, index) => (
                  <Link
                    key={request.id}
                    to={`/requests/${request.id}`}
                    className="group"
                  >
                    <Card className="border-2 border-black/20 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-festival-orange/20 rounded-full flex items-center justify-center border-2 border-festival-orange/30">
                            {request.category === "logo" && (
                              <PaintBucket className="w-6 h-6 text-festival-orange" />
                            )}
                            {request.category === "web" && (
                              <Brush className="w-6 h-6 text-festival-orange" />
                            )}
                            {request.category === "brand" && (
                              <Sparkles className="w-6 h-6 text-festival-orange" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-black group-hover:text-festival-orange transition-colors">
                              {request.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge
                                className={`${getStatusColor(request.status)} text-white border-0`}
                              >
                                {request.status}
                              </Badge>
                              <Badge
                                className={`${getPriorityColor(request.priority)} border-0`}
                              >
                                {request.priority} priority
                              </Badge>
                              <span className="text-sm text-black/60">
                                {new Date(
                                  request.created_at,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-festival-orange transition-colors" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-festival-orange/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-black/60 mb-2">
                  No projects yet
                </h3>
                <p className="text-black/50 mb-6">
                  Start your first design project and watch the magic happen!
                </p>
                <Link to="/new-request">
                  <Button className="bg-festival-orange hover:bg-festival-coral border-2 border-black font-bold">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Inbox Modal */}
      <MessagesInbox
        isOpen={showMessagesInbox}
        onClose={() => setShowMessagesInbox(false)}
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
