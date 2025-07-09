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
      const backgroundElements = containerRef.current?.querySelectorAll(".floating-element");
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
            rotateX: -15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            ease: "power3.out"
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
            z: -100
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
            x: -50
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
            scale: 0.95
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          },
          "-=0.4",
        );

        // Animate project items when they appear
        const projectItems = projectsRef.current.querySelectorAll(".project-item");
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
            }
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
          from: "random"
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
