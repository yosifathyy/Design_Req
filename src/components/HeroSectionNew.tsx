import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Rocket,
  ArrowRight,
  Play,
  Zap,
  Star,
  Heart,
  Palette,
  Wand2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

const HeroSectionNew: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const mouseFollowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 100,
      });

      // Create entrance timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate floating orbs
      gsap.set(".floating-orb", {
        scale: 0,
        rotation: "random(-180, 180)",
      });

      tl.to(
        ".floating-orb",
        {
          scale: 1,
          rotation: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "elastic.out(1, 0.5)",
        },
        0,
      );

      // Animate background shapes
      gsap.set(".bg-shape", {
        scale: 0,
        rotation: "random(-45, 45)",
      });

      tl.to(
        ".bg-shape",
        {
          scale: 1,
          rotation: "random(-10, 10)",
          duration: 1,
          stagger: 0.05,
          ease: "back.out(1.7)",
        },
        0.2,
      );

      // Title animation with character reveal
      if (titleRef.current) {
        const title = titleRef.current;
        const text = title.textContent || "";
        title.innerHTML = text
          .split("")
          .map((char) =>
            char === " "
              ? `<span class="char">&nbsp;</span>`
              : `<span class="char">${char}</span>`,
          )
          .join("");

        gsap.set(".char", { opacity: 0, y: 100, rotateX: -90 });

        tl.to(titleRef.current, { opacity: 1, duration: 0.1 }, 0.8).to(
          ".char",
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "back.out(1.7)",
          },
          0.8,
        );
      }

      // Subtitle animation
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        1.5,
      );

      // CTA buttons animation
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        2,
      );

      // Continuous animations
      gsap.to(".floating-orb", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-180, 180)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random",
        },
      });

      // Background shapes floating
      gsap.to(".bg-shape", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-45, 45)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          amount: 3,
          from: "random",
        },
      });

      // Mouse follower effect
      const handleMouseMove = (e: MouseEvent) => {
        if (!mouseFollowerRef.current) return;

        gsap.to(mouseFollowerRef.current, {
          x: e.clientX - 50,
          y: e.clientY - 50,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Parallax effects
          gsap.set(".parallax-slow", {
            y: progress * 100,
            rotation: progress * 20,
          });

          gsap.set(".parallax-fast", {
            y: progress * 200,
            rotation: progress * -30,
          });

          // Title transformation
          if (titleRef.current) {
            gsap.set(titleRef.current, {
              scale: Math.max(0.8, 1 - progress * 0.2),
              y: progress * -50,
            });
          }
        },
      });

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream"
      style={{ zIndex: 1 }}
    >
      {/* Mouse follower */}
      <div
        ref={mouseFollowerRef}
        className="fixed w-24 h-24 pointer-events-none mix-blend-difference"
        style={{
          transform: "translate(-50%, -50%)",
          zIndex: 40,
        }}
      >
        <div className="w-full h-full bg-festival-orange rounded-full opacity-20 animate-pulse"></div>
      </div>

      {/* Background shapes */}
      <div
        ref={shapesRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`bg-shape absolute rounded-xl ${
              i % 4 === 0
                ? "bg-festival-orange/10"
                : i % 4 === 1
                  ? "bg-festival-pink/10"
                  : i % 4 === 2
                    ? "bg-festival-yellow/10"
                    : "bg-festival-coral/10"
            } ${
              i % 3 === 0 ? "w-12 h-12" : i % 3 === 1 ? "w-8 h-8" : "w-16 h-16"
            } ${i < 8 ? "parallax-slow" : "parallax-fast"}`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${5 + Math.random() * 90}%`,
            }}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <div
        ref={orbsRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`floating-orb absolute w-24 h-24 rounded-full border-4 border-black ${
              i % 4 === 0
                ? "bg-gradient-to-br from-festival-orange to-festival-pink"
                : i % 4 === 1
                  ? "bg-gradient-to-br from-festival-pink to-festival-amber"
                  : i % 4 === 2
                    ? "bg-gradient-to-br from-festival-yellow to-festival-coral"
                    : "bg-gradient-to-br from-festival-coral to-festival-magenta"
            } shadow-2xl`}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
          >
            <div className="absolute inset-3 bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center">
              {i % 4 === 0 && <Sparkles className="w-6 h-6 text-white" />}
              {i % 4 === 1 && <Zap className="w-6 h-6 text-white" />}
              {i % 4 === 2 && <Star className="w-6 h-6 text-white" />}
              {i % 4 === 3 && <Heart className="w-6 h-6 text-white" />}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center w-full flex flex-col items-center justify-center"
        style={{ zIndex: 10 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-festival-orange to-festival-pink px-8 py-4 rounded-full my-[18px] mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          whileHover={{
            scale: 1.05,
            rotate: 2,
            boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Palette className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-lg font-black text-white tracking-wide">
            CREATIVE POWERHOUSE ⚡
          </span>
        </motion.div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] text-black mb-8 tracking-tight leading-[0.8]"
          style={{
            textShadow: "8px 8px 0px rgba(0,0,0,0.1)",
            perspective: "1000px",
          }}
        >
          Design Requests ✨
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black/80 max-w-4xl mx-auto leading-relaxed font-bold pt-[38px] mt-[51px] mb-[53px]"
        >
          Where <span className="text-festival-orange">wild creativity</span>{" "}
          meets <span className="text-festival-pink">festival vibes</span> to
          create <span className="text-festival-amber">legendary designs!</span>{" "}
          🎨🔥
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: -2,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/start-project"
              className="group relative overflow-hidden bg-gradient-to-r from-festival-orange to-festival-pink text-white font-black px-12 py-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-xl uppercase tracking-wide inline-flex items-center gap-4"
            >
              <motion.div
                animate={{
                  x: [0, 5, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Rocket className="w-6 h-6" />
              </motion.div>
              Start Creating
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-festival-pink to-festival-amber opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 2,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="outline"
              className="border-4 border-black text-black hover:bg-festival-yellow hover:text-black font-black px-12 py-6 rounded-2xl transition-all duration-300 text-xl uppercase tracking-wide bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
              onClick={() =>
                document.getElementById("portfolio")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Play className="w-6 h-6 mr-3" />
              </motion.div>
              See Magic
            </Button>
          </motion.div>
        </div>

        {/* Floating stats */}
        <div className="mt-16 mb-[45px] flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full">
          {[
            { label: "Happy Clients", value: "500+", icon: Heart },
            { label: "Projects", value: "1.2K+", icon: Wand2 },
            { label: "Awards", value: "25+", icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white border-4 border-black rounded-2xl p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-w-[100px] md:min-w-[120px]"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 + i * 0.2, duration: 0.8 }}
              whileHover={{
                scale: 1.05,
                rotate: i % 2 === 0 ? 2 : -2,
                boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
              }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center"
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-festival-orange mb-2" />
                <div className="text-xl md:text-2xl font-black text-black">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-bold text-black/70">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSectionNew;
