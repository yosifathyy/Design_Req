import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserProfile,
  getDesignRequests,
  getInvoices,
  createUserProfileIfMissing,
  findUserProfileByEmail,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { XPProgress } from "@/components/dashboard/XPProgress";
import { mockUser, mockStats } from "@/lib/dashboard-data";
import ProfileSetupNotice from "@/components/ProfileSetupNotice";
import IDMismatchNotice from "@/components/IDMismatchNotice";
import AdminChatList from "@/components/AdminChatList";
import {
  FileText,
  MessageCircle,
  CreditCard,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";

const DesignDashboard: React.FC = () => {
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [stats, setStats] = React.useState({
    totalRequests: 0,
    unreadChats: 0,
    dueInvoices: 0,
    xpProgress: {
      current: 0,
      target: 1000,
      level: 1,
    },
  });
  const [loading, setLoading] = React.useState(true);
  const [isCreatingProfile, setIsCreatingProfile] = React.useState(false);
  const [profileSetupError, setProfileSetupError] = React.useState(false);
  const [idMismatch, setIdMismatch] = React.useState<{
    authId: string;
    dbId: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user profile
        let profile = await getUserProfile(user.id);

        // If no profile found by ID, try finding by email (handles ID mismatches)
        if (!profile && user.email) {
          console.log("No user profile found by ID, checking by email...");
          profile = await findUserProfileByEmail(user.email);

          if (profile) {
            console.log(
              `Found existing profile by email with different ID: ${profile.id}`,
            );
            // Track ID mismatch for user notification
            if (profile.id !== user.id) {
              setIdMismatch({ authId: user.id, dbId: profile.id });
            }
          }
        }

        // If still no profile found, try to create one
        if (!profile && user.email) {
          console.log("No user profile found, attempting to create one...");
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

        // If still no profile, use fallback data
        if (!profile) {
          console.warn("Could not create user profile, using fallback data");
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
        const requests = await getDesignRequests(user.id);

        // Fetch invoices
        const invoices = await getInvoices(user.id);
        const pendingInvoices = invoices.filter(
          (inv) => inv.status === "pending",
        );

        // Calculate XP target based on level
        const currentProfile = profile || { level: 1, xp: 0 };
        const xpTarget = currentProfile.level * 1000;

        // Update stats
        setStats({
          totalRequests: requests.length,
          unreadChats: 0, // We'll implement this with real-time later
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
    if (!containerRef.current || !cardsRef.current || !buttonRef.current)
      return;

    const tl = gsap.timeline();

    // Page entrance animation
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    // Stagger cards animation
    const cards = cardsRef.current.children;
    tl.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: "back.out(1.2)",
      },
      "-=0.3",
    );

    // Button animation
    tl.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" },
      "-=0.2",
    );

    // Button pulse animation
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  }, []);

  const handleCardClick = (path: string) => {
    // Add click animation
    gsap.to(event?.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <div className="min-h-screen bg-festival-cream relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-festival-orange transform rotate-45" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-festival-pink rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-festival-yellow transform rotate-12" />
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-festival-magenta rounded-full" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-6xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-festival-orange border-4 border-black rounded-full flex items-center justify-center">
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {userProfile?.name?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-black">
                Hello, {userProfile?.name?.split(" ")[0] || "Designer"}! 👋
              </h1>
              <p className="text-lg text-black/70 font-medium">
                Ready to create something amazing today?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Link to="/requests">
            {loading ? (
              <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : (
              <StatsCard
                title="Total Requests"
                value={stats.totalRequests}
                icon={FileText}
                color="bg-festival-orange"
                gradient="bg-gradient-to-br from-festival-orange to-festival-coral"
                onClick={() => handleCardClick("/requests")}
              />
            )}
          </Link>

          <Link to="/chat">
            {loading ? (
              <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : (
              <StatsCard
                title="Unread Chats"
                value={stats.unreadChats}
                icon={MessageCircle}
                color="bg-festival-pink"
                gradient="bg-gradient-to-br from-festival-pink to-festival-magenta"
                onClick={() => handleCardClick("/chat")}
                badge={stats.unreadChats > 0 ? "NEW" : undefined}
              />
            )}
          </Link>

          <Link to="/payments">
            {loading ? (
              <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : (
              <StatsCard
                title="Due Invoices"
                value={stats.dueInvoices}
                icon={CreditCard}
                color="bg-festival-yellow"
                gradient="bg-gradient-to-br from-festival-yellow to-festival-amber"
                onClick={() => handleCardClick("/payments")}
                badge={stats.dueInvoices > 0 ? "!" : undefined}
              />
            )}
          </Link>

          {loading ? (
            <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            <XPProgress
              current={stats.xpProgress.current}
              target={stats.xpProgress.target}
              level={stats.xpProgress.level}
            />
          )}
        </div>

        {/* Admin Chat List */}
        {userProfile?.role === "admin" ||
        userProfile?.role === "super-admin" ? (
          <div className="mb-8">
            <AdminChatList />
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="flex flex-col items-center gap-6">
          <Link to="/new-request">
            <Button
              ref={buttonRef}
              className="text-2xl font-display font-bold px-12 py-6 h-auto bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <Plus className="w-8 h-8 mr-3" />
              NEW REQUEST
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
          </Link>

          <div className="flex items-center gap-4 text-sm text-black/60">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-festival-orange" />
              <span>Level {userProfile?.level || 1} Designer</span>
            </div>
            <div className="w-1 h-1 bg-black rounded-full" />
            <span>
              Member since{" "}
              {userProfile?.created_at
                ? new Date(userProfile.created_at).toLocaleDateString()
                : "recently"}
            </span>
            <div className="w-1 h-1 bg-black rounded-full" />
            <span>XP: {userProfile?.xp || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDashboard;
