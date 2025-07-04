import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Upload, Users, MessageCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
  delay: number;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  title,
  description,
  icon: Icon,
  delay,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(cardRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotationY: -45,
      });

      gsap.set([iconRef.current, numberRef.current], {
        scale: 0,
        rotation: 180,
      });

      gsap.set([titleRef.current, descRef.current], {
        opacity: 0,
        y: 30,
      });

      // Much smoother scroll-triggered entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "top 40%",
          toggleActions: "play none none none",
          scrub: 0.8, // Smoother scrub for more fluid animation
        },
      });

      // Smoother card entrance
      tl.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 2,
        ease: "power2.out", // Smoother easing
        delay: delay,
      })
        // Smoother number entrance
        .to(
          numberRef.current,
          {
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=1.5",
        )
        // Smoother icon entrance
        .to(
          iconRef.current,
          {
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=1.2",
        )
        // Smoother title reveal
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8",
        )
        // Smoother description slide
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6",
        );
    }, cardRef);

    return () => ctx.revert();
  }, [delay]);

  const getCardColor = () => {
    switch (step) {
      case 1:
        return "from-retro-pink to-retro-purple";
      case 2:
        return "from-retro-orange to-retro-teal";
      case 3:
        return "from-retro-teal to-retro-mint";
      case 4:
        return "from-retro-purple to-retro-pink";
      default:
        return "from-retro-pink to-retro-purple";
    }
  };

  return (
    <div ref={cardRef} className="relative group cursor-pointer">
      {/* Main Card with Hero Button Hover Animation */}
      <motion.div
        whileHover={{
          scale: 1.05,
          rotate: 2,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "relative overflow-hidden rounded-3xl border-4 border-black",
          "bg-gradient-to-br p-8 min-h-[320px]",
          "shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)]",
          getCardColor(),
        )}
      >
        {/* Retro grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Step Number */}
        <div
          ref={numberRef}
          className="absolute top-4 right-4 w-12 h-12 bg-black text-white font-black text-xl rounded-full flex items-center justify-center border-3 border-white shadow-lg"
        >
          {step}
        </div>

        {/* Icon */}
        <div
          ref={iconRef}
          className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl border-4 border-black flex items-center justify-center mb-6 shadow-lg"
        >
          <Icon className="w-10 h-10 text-black" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3
            ref={titleRef}
            className="font-display font-black text-2xl lg:text-3xl text-white mb-4 tracking-tight"
            style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.5)" }}
          >
            {title}
          </h3>
          <p
            ref={descRef}
            className="text-white/95 text-lg font-medium leading-relaxed"
          >
            {description}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-4 left-4 w-8 h-8 border-4 border-white/30 rounded-full" />
        <div className="absolute top-1/2 left-0 w-4 h-16 bg-white/10 transform -translate-y-1/2" />
      </motion.div>
    </div>
  );
};

const RetroHowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const steps = [
    {
      step: 1,
      title: "Submit Your Brief",
      description:
        "Tell us about your project using our AI-powered brief generator. It's like magic, but for design briefs!",
      icon: Upload,
    },
    {
      step: 2,
      title: "Get Matched",
      description:
        "We assign the perfect designer from our expert team. Think of it as design matchmaking!",
      icon: Users,
    },
    {
      step: 3,
      title: "Collaborate",
      description:
        "Work directly with your designer through secure messaging. It's like having a design buddy!",
      icon: MessageCircle,
    },
    {
      step: 4,
      title: "Receive Results",
      description:
        "Get your professional designs delivered on time. Boom! Your vision comes to life!",
      icon: CheckCircle,
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Much smoother title animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotation: -5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.8,
          ease: "power2.out", // Smoother easing
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none none",
            scrub: 0.6, // Smoother scrub
          },
        },
      );

      // Smoother subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power2.out", // Smoother easing
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Smoother background shapes animation
      const shapes = sectionRef.current?.querySelectorAll(".floating-bg-shape");
      shapes?.forEach((shape, i) => {
        gsap.to(shape, {
          y: -80,
          rotation: 180,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2 + i * 0.5, // Much smoother parallax
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-retro-cream via-retro-lavender to-retro-peach overflow-hidden"
    >
      {/* Retro background effects */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,0,149,0.3) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(0,255,255,0.3) 0%, transparent 40%),
              radial-gradient(circle at 40% 60%, rgba(255,119,51,0.2) 0%, transparent 40%)
            `,
          }}
        />
      </div>

      {/* Floating retro shapes with scroll animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "floating-bg-shape absolute opacity-10",
              i % 4 === 0
                ? "w-16 h-16 bg-retro-pink rounded-full"
                : i % 4 === 1
                  ? "w-12 h-12 bg-retro-teal rotate-45"
                  : i % 4 === 2
                    ? "w-8 h-20 bg-retro-orange rounded-full"
                    : "w-14 h-14 bg-retro-purple rounded-full border-4 border-white",
            )}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float 6s ease-in-out infinite ${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div ref={titleRef} className="mb-6">
            <h2
              className="font-display font-black text-5xl lg:text-7xl text-black tracking-tight mb-4"
              style={{
                textShadow:
                  "6px 6px 0px rgba(255,0,149,0.3), 12px 12px 0px rgba(0,255,255,0.2)",
              }}
            >
              HOW IT WORKS
            </h2>
            <div className="flex justify-center">
              <div className="w-32 h-2 bg-gradient-to-r from-retro-pink via-retro-orange to-retro-teal rounded-full border-2 border-black shadow-lg" />
            </div>
          </div>
          <p
            ref={subtitleRef}
            className="text-xl lg:text-2xl text-black/80 font-bold max-w-3xl mx-auto leading-relaxed"
          >
            Our streamlined process makes getting epic design work effortless
            and super fun! 🎨
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <StepCard key={step.step} {...step} delay={index * 0.15} />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 flex justify-center">
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-4 h-4 rounded-full border-3 border-black",
                  i === 0
                    ? "bg-retro-pink"
                    : i === 1
                      ? "bg-retro-orange"
                      : i === 2
                        ? "bg-retro-teal"
                        : "bg-retro-purple",
                )}
                style={{
                  animation: `pulse 2s ease-in-out infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
};

export default RetroHowItWorks;
