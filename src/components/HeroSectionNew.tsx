import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClickSound } from "@/hooks/use-click-sound";
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
import { Squares } from "@/components/ui/squares-background";

gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

const HeroSectionNew: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const { playClickSound, playHoverSound } = useClickSound();

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([logoRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 100,
        scale: 0.8,
      });

      // Create entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });

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

      // Logo entrance animation
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          filter: "drop-shadow(8px 8px 0px rgba(0,0,0,0.1))",
        },
        0.5,
      );

      // Logo scroll-out animation (bidirectional)
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap.fromTo(
          logoRef.current,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
          },
          {
            y: -150,
            scale: 0.7,
            opacity: 0.4,
            rotation: -5,
            ease: "none",
          },
        ),
        onUpdate: (self) => {
          // Ensure logo is visible when at the top
          if (self.progress === 0) {
            gsap.set(logoRef.current, {
              y: 0,
              scale: 1,
              opacity: 1,
              rotation: 0,
            });
          }
        },
      });

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
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream"
      style={{ zIndex: 1 }}
    >
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

      {/* Animated Squares Background */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        <Squares
          direction="diagonal"
          speed={0.8}
          squareSize={40}
          borderColor="rgba(0, 0, 0, 0.3)"
          hoverFillColor="rgba(255, 107, 53, 0.8)"
          className="opacity-80 pointer-events-auto"
        />
      </div>

      {/* Main content */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center w-full flex flex-col items-center justify-center"
        style={{ zIndex: 10 }}
      >
        {/* Main title */}
        <div
          ref={(el) => {
            logoRef.current = el;
            titleRef.current = el;
          }}
          className="mb-24"
          style={{
            perspective: "1000px",
          }}
        >
          <img
            src="https://i.postimg.cc/JnS8wrG0/logo-image.png"
            alt="Design Requests Logo"
            className="max-w-full h-auto mx-auto block"
            style={{
              maxHeight: "300px",
              width: "auto",
              filter: "drop-shadow(8px 8px 0px rgba(0,0,0,0.1))",
              display: "block",
            }}
            onLoad={() => console.log("Logo loaded successfully")}
            onError={(e) => console.error("Logo failed to load:", e)}
          />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black/80 leading-relaxed font-bold mb-8"
          style={{
            marginTop: "-116px",
            marginBottom: "-4px",
            maxWidth: "727px",
            margin: "-116px auto -4px",
            position: "relative",
            zIndex: 1,
            fontFamily: "Righteous, display",
            textShadow: "3px 3px 0px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontFamily: "Righteous, display", fontSize: "30px" }}>
            Where{" "}
          </span>
          <span
            style={{
              color: "#21201f",
              fontFamily: "Righteous, display",
              fontSize: "30px",
            }}
          >
            wild creativity
          </span>
          <span
            style={{
              fontFamily: "Righteous, display",
              paddingLeft: "8px",
              fontSize: "30px",
            }}
          >
            {" "}
            meets{" "}
          </span>
          <span
            style={{
              color: "#302f2d",
              fontFamily: "Righteous, display",
              fontSize: "30px",
            }}
          >
            client desires
          </span>
          <span style={{ fontFamily: "Righteous, display", fontSize: "30px" }}>
            {" "}
            to create{" "}
          </span>
          <span
            style={{
              color: "#2d2b2a",
              fontFamily: "Righteous, display",
              fontSize: "33px",
            }}
          >
            legendary designs!
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full"
          style={{ marginTop: "9px" }}
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
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound()}
            >
              {/* Animated background - moved behind content */}
              <div className="absolute inset-0 bg-gradient-to-r from-festival-pink to-festival-amber opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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
                className="relative z-10"
              >
                <Rocket className="w-6 h-6" />
              </motion.div>
              <span className="relative z-10">Start Creating</span>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
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
        <div
          className="flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full"
          style={{ margin: "10px 0 43px" }}
        >
          {[
            { label: "Happy Clients", value: "500+", icon: Heart },
            { label: "projects", value: "400+", icon: Wand2 },
            { label: "Awards", value: "15+", icon: Star },
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
