import React, { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  colorScheme?: "orange" | "pink" | "yellow" | "coral" | "magenta" | "cream";
  delay?: number;
  hoverEffect?: "tilt" | "bounce" | "shake" | "grow";
}

export const BentoCard = ({
  children,
  className = "",
  size = "md",
  colorScheme = "orange",
  delay = 0,
  hoverEffect = "tilt",
}: BentoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "col-span-1 row-span-1 min-h-[200px] sm:min-h-[240px]",
    md: "col-span-1 sm:col-span-1 lg:col-span-2 row-span-1 min-h-[240px] sm:min-h-[280px]",
    lg: "col-span-1 sm:col-span-2 lg:col-span-4 row-span-1 lg:row-span-2 min-h-[320px] sm:min-h-[400px]",
    xl: "col-span-1 sm:col-span-2 lg:col-span-4 row-span-1 lg:row-span-2 min-h-[400px] sm:min-h-[480px]",
  };

  const colorSchemes = {
    orange: "bg-festival-orange border-festival-black shadow-festival-black",
    pink: "bg-festival-pink border-festival-black shadow-festival-black",
    yellow: "bg-festival-yellow border-festival-black shadow-festival-black",
    coral: "bg-festival-coral border-festival-black shadow-festival-black",
    magenta: "bg-festival-magenta border-festival-black shadow-festival-black",
    cream: "bg-festival-cream border-festival-black shadow-festival-black",
  };

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const content = contentRef.current;

    // Initial setup
    gsap.set(card, {
      y: 100,
      opacity: 0,
      rotation: Math.random() * 6 - 3, // Random slight rotation
      scale: 0.8,
    });

    // Enhanced entrance and exit animations
    ScrollTrigger.create({
      trigger: card,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          delay: delay,
          ease: "back.out(1.7)",
        });
      },
      onLeave: () => {
        gsap.to(card, {
          y: -150,
          opacity: 0,
          rotation: Math.random() * 20 - 10,
          scale: 0.4,
          duration: 0.6,
          ease: "power2.in",
        });
      },
      onEnterBack: () => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.8)",
        });
      },
      onLeaveBack: () => {
        gsap.to(card, {
          y: 150,
          opacity: 0,
          rotation: Math.random() * 20 - 10,
          scale: 0.5,
          duration: 0.5,
          ease: "power2.in",
        });
      },
    });

    // Hover animations
    const handleMouseEnter = () => {
      const hoverAnimations = {
        tilt: () => {
          gsap.to(card, {
            rotation: Math.random() * 8 - 4,
            scale: 1.05,
            y: -10,
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(content, {
            y: -5,
            duration: 0.4,
            ease: "power2.out",
          });
        },
        bounce: () => {
          gsap.to(card, {
            y: -15,
            scale: 1.03,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        },
        shake: () => {
          gsap.to(card, {
            rotation: 2,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "power2.inOut",
          });
        },
        grow: () => {
          gsap.to(card, {
            scale: 1.08,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
        },
      };

      hoverAnimations[hoverEffect]();
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotation: 0,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
      gsap.to(content, {
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    // Floating animation
    gsap.to(card, {
      y: "+=5",
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: Math.random() * 2,
    });

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [delay, hoverEffect]);

  return (
    <div
      ref={cardRef}
      className={cn(
        sizeClasses[size],
        colorSchemes[colorScheme],
        "relative group cursor-pointer",
        "border-[6px] rounded-3xl",
        "shadow-[12px_12px_0px_0px] hover:shadow-[20px_20px_0px_0px]",
        "transition-shadow duration-300",
        "overflow-hidden",
        className,
      )}
    >
      {/* Neubrutalism decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-festival-black rounded-full opacity-20"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-festival-black rounded-full opacity-15"></div>
      <div className="absolute top-1/2 right-6 w-4 h-4 bg-festival-black transform rotate-45 opacity-10"></div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full p-6">
        {children}
      </div>

      {/* Animated grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};

export const BentoGrid = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    // Stagger animation for grid children
    const cards = gridRef.current.querySelectorAll(".bento-card");

    gsap.set(cards, {
      y: 50,
      opacity: 0,
      rotation: "random(-5, 5)",
      scale: 0.8,
    });

    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        });
      },
      onLeave: () => {
        gsap.to(cards, {
          y: -100,
          opacity: 0,
          rotation: "random(-15, 15)",
          scale: 0.6,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.in",
        });
      },
      onEnterBack: () => {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        });
      },
      onLeaveBack: () => {
        gsap.to(cards, {
          y: 100,
          opacity: 0,
          rotation: "random(-10, 10)",
          scale: 0.7,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.in",
        });
      },
    });
  }, []);

  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        "flex justify-center",
        className,
      )}
    >
      <div
        ref={gridRef}
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full",
          "justify-items-center place-items-center",
        )}
      >
        {children}
      </div>
    </div>
  );
};

// Specialized Bento cards with Neubrutalism styling
export const StatBentoCard = ({
  stat,
  label,
  icon: Icon,
  delay = 0,
  colorScheme = "cream",
}: {
  stat: string;
  label: string;
  icon: any;
  delay?: number;
  colorScheme?: "orange" | "pink" | "yellow" | "coral" | "magenta" | "cream";
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iconRef.current || !statRef.current) return;

    // Icon animation
    gsap.set(iconRef.current, { scale: 0, rotation: -180 });
    gsap.to(iconRef.current, {
      scale: 1,
      rotation: 0,
      duration: 1,
      delay: delay + 0.3,
      ease: "elastic.out(1, 0.5)",
    });

    // Counter animation for stats
    const finalValue = parseInt(stat.replace(/[^\d]/g, ""));
    if (!isNaN(finalValue)) {
      gsap.to(
        { value: 0 },
        {
          value: finalValue,
          duration: 2,
          delay: delay + 0.5,
          ease: "power2.out",
          onUpdate: function () {
            const suffix = stat.replace(/[\d]/g, "");
            statRef.current!.textContent =
              Math.round(this.targets()[0].value) + suffix;
          },
        },
      );
    }
  }, [stat, delay]);

  return (
    <BentoCard
      size="sm"
      delay={delay}
      colorScheme={colorScheme}
      hoverEffect="bounce"
      className="bento-card"
    >
      <div className="h-full flex flex-col justify-center items-center text-center">
        <div
          ref={iconRef}
          className="w-16 h-16 bg-festival-black rounded-2xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div
          ref={statRef}
          className="font-display text-4xl font-black text-festival-black mb-2 tracking-tight"
        >
          {stat}
        </div>
        <div className="text-festival-black/70 font-bold text-sm uppercase tracking-wider leading-tight">
          {label}
        </div>
      </div>
    </BentoCard>
  );
};

export const FeatureBentoCard = ({
  title,
  description,
  icon: Icon,
  delay = 0,
  colorScheme = "orange",
}: {
  title: string;
  description: string;
  icon: any;
  delay?: number;
  colorScheme?: "orange" | "pink" | "yellow" | "coral" | "magenta" | "cream";
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!iconRef.current || !titleRef.current || !descRef.current) return;

    const tl = gsap.timeline({ delay: delay + 0.5 });

    // Staggered content animation
    gsap.set([iconRef.current, titleRef.current, descRef.current], {
      y: 30,
      opacity: 0,
    });

    tl.to(iconRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
      .to(
        titleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      )
      .to(
        descRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );

    // Continuous icon rotation
    gsap.to(iconRef.current, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "none",
    });
  }, [delay]);

  return (
    <BentoCard
      size="md"
      delay={delay}
      colorScheme={colorScheme}
      hoverEffect="tilt"
      className="bento-card"
    >
      <div className="h-full flex flex-col">
        <div
          ref={iconRef}
          className="w-20 h-20 bg-festival-black rounded-3xl flex items-center justify-center mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
        >
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h3
          ref={titleRef}
          className="font-display text-2xl font-black text-festival-black mb-4 tracking-tight leading-tight"
        >
          {title}
        </h3>
        <p
          ref={descRef}
          className="text-festival-black/80 font-bold flex-1 text-base leading-relaxed"
        >
          {description}
        </p>
      </div>
    </BentoCard>
  );
};

export const HeroBentoCard = ({
  children,
  delay = 0,
  colorScheme = "pink",
}: {
  children: ReactNode;
  delay?: number;
  colorScheme?: "orange" | "pink" | "yellow" | "coral" | "magenta" | "cream";
}) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Special hero entrance animation
    gsap.set(heroRef.current, {
      scale: 0.5,
      rotation: -10,
      opacity: 0,
    });

    gsap.to(heroRef.current, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      delay: delay,
      ease: "elastic.out(1, 0.8)",
    });

    // Breathing animation
    gsap.to(heroRef.current, {
      scale: 1.02,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, [delay]);

  return (
    <div ref={heroRef}>
      <BentoCard
        size="xl"
        colorScheme={colorScheme}
        delay={0} // Already handled by heroRef animation
        hoverEffect="grow"
        className="bento-card relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-festival-black rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">{children}</div>
      </BentoCard>
    </div>
  );
};

// Special effect card with intense animations
export const SpectacularBentoCard = ({
  children,
  delay = 0,
  colorScheme = "magenta",
}: {
  children: ReactNode;
  delay?: number;
  colorScheme?: "orange" | "pink" | "yellow" | "coral" | "magenta" | "cream";
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !sparkleRef.current) return;

    // Spectacular entrance
    gsap.set(cardRef.current, {
      y: -200,
      rotation: 45,
      scale: 0,
      opacity: 0,
    });

    gsap.to(cardRef.current, {
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 1.2,
      delay: delay,
      ease: "bounce.out",
    });

    // Sparkle effects
    const sparkles = sparkleRef.current.children;
    gsap.set(sparkles, { scale: 0, rotation: "random(0, 360)" });

    gsap.to(sparkles, {
      scale: 1,
      rotation: "+=360",
      duration: 2,
      delay: delay + 0.5,
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "elastic.inOut(1, 0.5)",
    });
  }, [delay]);

  return (
    <div ref={cardRef}>
      <BentoCard
        size="lg"
        colorScheme={colorScheme}
        delay={0}
        hoverEffect="shake"
        className="bento-card relative"
      >
        {/* Sparkle decorations */}
        <div ref={sparkleRef} className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-festival-black"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${10 + Math.floor(i / 4) * 80}%`,
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              }}
            />
          ))}
        </div>

        {children}
      </BentoCard>
    </div>
  );
};
