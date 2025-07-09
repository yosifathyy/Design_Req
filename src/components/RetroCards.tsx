import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  Upload,
  Palette,
  Zap,
  Crown,
  Sparkles,
  Star,
  Heart,
  Rocket,
  Award,
  Music,
  Coffee,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RetroFloatingShapes,
  RetroScanlines,
  RetroGrid,
  RetroGeometricBg,
} from "./RetroAnimations";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

interface RetroCardData {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  shadow: string;
  accent: string;
  size: "small" | "medium" | "large";
}

const cardData: RetroCardData[] = [
  {
    id: 1,
    title: "Radical Designs",
    description:
      "Far out designs that'll blow your mind! Totally tubular graphics from the 80s era.",
    icon: Palette,
    gradient: "from-retro-purple via-retro-pink to-retro-orange",
    shadow: "shadow-[12px_12px_0px_0px_rgba(255,0,149,0.4)]",
    accent: "border-retro-pink",
    size: "large",
  },
  {
    id: 2,
    title: "Lightning Fast",
    description:
      "Faster than a DeLorean at 88mph! Quick turnaround guaranteed.",
    icon: Zap,
    gradient: "from-retro-teal via-retro-mint to-retro-orange",
    shadow: "shadow-[8px_8px_0px_0px_rgba(0,255,255,0.4)]",
    accent: "border-retro-teal",
    size: "medium",
  },
  {
    id: 3,
    title: "Premium Quality",
    description: "The bee's knees! Top-notch quality that's totally awesome.",
    icon: Crown,
    gradient: "from-retro-orange via-retro-peach to-retro-lavender",
    shadow: "shadow-[10px_10px_0px_0px_rgba(255,119,51,0.4)]",
    accent: "border-retro-orange",
    size: "medium",
  },
  {
    id: 4,
    title: "Magic Touch",
    description:
      "We add that special sauce to make your designs totally gnarly!",
    icon: Sparkles,
    gradient: "from-retro-lavender via-retro-cream to-retro-pink",
    shadow: "shadow-[12px_12px_0px_0px_rgba(200,162,200,0.4)]",
    accent: "border-retro-lavender",
    size: "small",
  },
  {
    id: 5,
    title: "All-Star Team",
    description:
      "Our crew is more talented than the A-Team! Bodacious results every time.",
    icon: Star,
    gradient: "from-retro-pink via-retro-peach to-retro-mint",
    shadow: "shadow-[8px_8px_0px_0px_rgba(255,20,147,0.4)]",
    accent: "border-retro-pink",
    size: "small",
  },
  {
    id: 6,
    title: "Made with Love",
    description:
      "Every pixel crafted with love and good vibes. Peace, love, and great design!",
    icon: Heart,
    gradient: "from-retro-cream via-retro-peach to-retro-orange",
    shadow: "shadow-[10px_10px_0px_0px_rgba(255,160,122,0.4)]",
    accent: "border-retro-cream",
    size: "medium",
  },
];

const RetroCard: React.FC<{ card: RetroCardData; index: number }> = ({
  card,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(cardRef.current, {
        opacity: 0,
        scale: 0.3,
        rotation: -45,
        y: 200,
        x: index % 2 === 0 ? -100 : 100,
      });

      gsap.set(iconRef.current, {
        scale: 0,
        rotation: 360,
      });

      gsap.set(contentRef.current, {
        opacity: 0,
        y: 50,
      });

      gsap.set(bgRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      // Scroll-triggered entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none none",
        },
      });

      // Card entrance with crazy effect
      tl.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        x: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.8)",
      })
        // Background slide in
        .to(
          bgRef.current,
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=1.2",
        )
        // Icon pop in
        .to(
          iconRef.current,
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.8",
        )
        // Content fade in
        .to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        );

      // Continuous floating animation
      gsap.to(cardRef.current, {
        y: "random(-15, 15)",
        x: "random(-8, 8)",
        rotation: "random(-2, 2)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2,
      });

      // Icon rotation animation
      gsap.to(iconRef.current, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
      });

      // Hover effects
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl
        .to(cardRef.current, {
          scale: 1.05,
          y: -15,
          boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.3)",
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          iconRef.current,
          {
            scale: 1.2,
            rotation: "+=180",
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          0,
        );

      const handleMouseEnter = () => hoverTl.play();
      const handleMouseLeave = () => hoverTl.reverse();

      cardRef.current?.addEventListener("mouseenter", handleMouseEnter);
      cardRef.current?.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        cardRef.current?.removeEventListener("mouseenter", handleMouseEnter);
        cardRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const getSizeClasses = () => {
    switch (card.size) {
      case "small":
        return "col-span-1 row-span-1 min-h-[280px]";
      case "medium":
        return "col-span-1 lg:col-span-2 row-span-1 min-h-[320px]";
      case "large":
        return "col-span-1 lg:col-span-3 row-span-2 min-h-[400px]";
      default:
        return "col-span-1 row-span-1 min-h-[280px]";
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-3xl border-4 border-black cursor-pointer group",
        getSizeClasses(),
        card.shadow,
        card.accent,
      )}
      style={{
        background: `linear-gradient(135deg, var(--retro-purple), var(--retro-pink), var(--retro-orange))`,
      }}
    >
      {/* Animated background */}
      <div
        ref={bgRef}
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-90",
          card.gradient,
        )}
      />

      {/* Retro grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animation: `float-${i % 3} ${3 + Math.random() * 2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
        {/* Icon */}
        <div
          ref={iconRef}
          className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-2xl border-3 border-black flex items-center justify-center mb-6 shadow-lg"
        >
          <card.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 flex flex-col">
          <h3 className="font-display font-black text-2xl lg:text-3xl text-white mb-4 tracking-tight shadow-text">
            {card.title}
          </h3>
          <p className="text-white/90 text-lg font-medium leading-relaxed flex-1">
            {card.description}
          </p>

          {/* Retro button */}
          <div className="mt-6">
            <button className="bg-black text-white font-black px-6 py-3 rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-200 transform hover:-translate-y-1 uppercase tracking-wide">
              Check it out!
            </button>
          </div>
        </div>
      </div>

      {/* Retro corner decorations */}
      <div className="absolute top-4 right-4 w-8 h-8 border-4 border-white/30 rounded-full" />
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full" />
      <div className="absolute top-1/2 right-0 w-3 h-12 bg-white/10 transform -translate-y-1/2" />
    </div>
  );
};

const RetroCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotation: -10,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Container entrance
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-retro-cream via-retro-lavender to-retro-peach overflow-hidden">
      {/* Retro background effects */}
      <RetroFloatingShapes />
      <RetroScanlines />
      <RetroGrid />
      <RetroGeometricBg />

      {/* Additional retro background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,0,149,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(0,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,119,51,0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="font-display font-black text-5xl lg:text-7xl text-black mb-6 tracking-tight"
            style={{
              textShadow:
                "6px 6px 0px rgba(255,0,149,0.3), 12px 12px 0px rgba(0,255,255,0.2)",
            }}
          >
            TOTALLY RADICAL! ⚡
          </h2>
          <p className="text-xl lg:text-2xl text-black/80 font-bold max-w-3xl mx-auto">
            These features are so cool, they need their own theme song! 🎵
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 auto-rows-min"
        >
          {cardData.map((card, index) => (
            <RetroCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>

      {/* Custom CSS for floating animations */}
      <style>{`
        @keyframes float-0 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(360deg);
          }
        }
        .shadow-text {
          text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  );
};

export default RetroCards;
