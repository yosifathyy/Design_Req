import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { XPProgress } from "@/components/dashboard/XPProgress";
import { mockUser, mockStats } from "@/lib/dashboard-data";
import {
  FileText,
  MessageCircle,
  CreditCard,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";

const DesignDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-black">
                Hello, {mockUser.name.split(" ")[0]}! 👋
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
            <StatsCard
              title="Total Requests"
              value={mockStats.totalRequests}
              icon={FileText}
              color="bg-festival-orange"
              gradient="bg-gradient-to-br from-festival-orange to-festival-coral"
              onClick={() => handleCardClick("/requests")}
            />
          </Link>

          <Link to="/chat">
            <StatsCard
              title="Unread Chats"
              value={mockStats.unreadChats}
              icon={MessageCircle}
              color="bg-festival-pink"
              gradient="bg-gradient-to-br from-festival-pink to-festival-magenta"
              onClick={() => handleCardClick("/chat")}
              badge={mockStats.unreadChats > 0 ? "NEW" : undefined}
            />
          </Link>

          <Link to="/payments">
            <StatsCard
              title="Due Invoices"
              value={mockStats.dueInvoices}
              icon={CreditCard}
              color="bg-festival-yellow"
              gradient="bg-gradient-to-br from-festival-yellow to-festival-amber"
              onClick={() => handleCardClick("/payments")}
              badge={mockStats.dueInvoices > 0 ? "!" : undefined}
            />
          </Link>

          <XPProgress
            current={mockStats.xpProgress.current}
            target={mockStats.xpProgress.target}
            level={mockStats.xpProgress.level}
          />
        </div>

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
              <span>Level {mockUser.level} Designer</span>
            </div>
            <div className="w-1 h-1 bg-black rounded-full" />
            <span>{mockUser.badges.length} Badges Earned</span>
            <div className="w-1 h-1 bg-black rounded-full" />
            <span>Member since Jan 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDashboard;
