
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClickSound } from "@/hooks/use-click-sound";
import { useLottieAnimation } from "@/hooks/use-lottie-animation";
import Lottie from "lottie-react";
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
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { playClickSound, playHoverSound } = useClickSound();
  const { lottieRef } = useLottieAnimation();
  
  const [lottieData, setLottieData] = useState(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [lottieLoaded, setLottieLoaded] = useState(false);

  // Fetch Lottie animation data
  useEffect(() => {
    const fetchLottieData = async () => {
      try {
        const response = await fetch('https://lottie.host/91daf55a-f518-429a-8ac1-469739297ad9/LIrHYs6h1V.json');
        const data = await response.json();
        setLottieData(data);
        
        // Start the 2-second preloader buffer
        setTimeout(() => {
          setShowContent(true);
        }, 2000);
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
        // Still show content after delay even if Lottie fails
        setTimeout(() => {
          setShowContent(true);
        }, 2000);
      }
    };

    fetchLottieData();
  }, []);

  useEffect(() => {
    if (!heroRef.current || !showContent) return;

    const ctx = gsap.context(() => {
      // Initial setup - only hide content elements, NOT the Lottie
      gsap.set([subtitleRef.current, ctaRef.current, statsRef.current], {
        opacity: 0,
        y: 50,
        scale: 0.95,
      });

      gsap.set(".bg-shape", {
        scale: 0,
        rotation: "random(-45, 45)",
        opacity: 0,
      });

      // Lottie container - start visible and positioned
      gsap.set(logoContainerRef.current, {
        opacity: 1, // Start visible
        y: 0,
        scale: 1,
        rotationX: 0,
      });

      // Simplified timeline - no complex Lottie animations
      const masterTimeline = gsap.timeline({ 
        delay: 0.5,
        onComplete: () => setIsInitialLoadComplete(true)
      });

      // Phase 1: Background shapes animation (0.5s - 1.3s)
      masterTimeline.to(".bg-shape", {
        scale: 1,
        opacity: 1,
        rotation: "random(-10, 10)",
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.4)",
      }, 0.5);

      // Phase 2: Subtitle animation (1s - 1.8s)
      masterTimeline.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      }, 1);

      // Phase 3: CTA buttons animation (1.4s - 2.1s)
      masterTimeline.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.4)",
      }, 1.4);

      // Phase 4: Stats animation (1.8s - 2.6s)
      masterTimeline.to(statsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      }, 1.8);

      // Continuous floating animations (after initial load)
      gsap.delayedCall(3, () => {
        gsap.to(".bg-shape", {
          y: "random(-20, 20)",
          x: "random(-15, 15)",
          rotation: "random(-30, 30)",
          duration: "random(4, 7)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          stagger: {
            amount: 2,
            from: "random",
          },
        });
      });

      // Simplified scroll-triggered animations - minimal Lottie movement
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap.fromTo(
          logoContainerRef.current,
          {
            y: 0,
            scale: 1,
            rotation: 0,
          },
          {
            y: -5, // Minimal movement
            scale: 0.98, // Subtle scaling
            rotation: 0, // No rotation
            ease: "none",
          },
        ),
      });

      // Parallax effects for other elements
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Parallax for background shapes
          gsap.set(".parallax-slow", {
            y: progress * 80,
            rotation: progress * 15,
          });

          gsap.set(".parallax-fast", {
            y: progress * 150,
            rotation: progress * -25,
          });

          // Subtitle parallax
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              y: progress * -30,
              opacity: Math.max(0.3, 1 - progress * 0.7),
            });
          }

          // CTA buttons parallax
          if (ctaRef.current) {
            gsap.set(ctaRef.current, {
              y: progress * -40,
              opacity: Math.max(0.2, 1 - progress * 0.8),
            });
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [showContent]);

  const handleLottieComplete = () => {
    console.log('Lottie animation completed');
    setLottieLoaded(true);
  };

  const handleLottieLoaded = () => {
    console.log('Lottie data loaded successfully');
    setLottieLoaded(true);
  };

  // Show preloader for first 2 seconds
  if (!showContent) {
    return (
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-festival-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-black">
            Loading amazing content...
          </p>
        </div>
      </section>
    );
  }

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
        {/* Lottie Animation Logo - Always visible */}
        <div
          ref={logoContainerRef}
          className="mb-6 sm:mb-8 md:mb-10" // Reduced bottom margin
          style={{
            perspective: "1000px",
            position: "relative",
            zIndex: 15,
            opacity: 1, // Always visible
            display: "block", // Always displayed
          }}
        >
          <div
            className="max-w-full h-auto mx-auto block transform-gpu"
            style={{
              maxHeight: "280px", // Reduced size
              width: "280px", // Reduced size
              filter: "drop-shadow(8px 8px 0px rgba(0,0,0,0.1))",
              display: "block",
              position: "relative",
            }}
          >
            {lottieData ? (
              <Lottie
                lottieRef={lottieRef}
                animationData={lottieData}
                loop={false}
                autoplay={true}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  zIndex: 20,
                }}
                onComplete={handleLottieComplete}
                onLoadedData={handleLottieLoaded}
                onError={(e) =>
                  console.error("Lottie animation failed to load:", e)
                }
              />
            ) : (
              <div 
                className="w-full h-full bg-festival-orange/20 rounded-full animate-pulse flex items-center justify-center"
                style={{ width: "280px", height: "280px" }}
              >
                <Sparkles className="w-16 h-16 text-festival-orange" />
              </div>
            )}
          </div>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-black/80 leading-relaxed font-bold mb-6 sm:mb-8 opacity-0"
          style={{
            maxWidth: "90%",
            margin: "0 auto 1rem",
            position: "relative",
            zIndex: 1,
            fontFamily: "Righteous, display",
            textShadow: "2px 2px 0px rgba(0,0,0,0.3)",
            padding: "0 1rem",
          }}
        >
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl" style={{ fontFamily: "Righteous, display" }}>
            Where{" "}
          </span>
          <span
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            style={{
              color: "#21201f",
              fontFamily: "Righteous, display",
            }}
          >
            wild creativity
          </span>
          <span
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            style={{
              fontFamily: "Righteous, display",
              paddingLeft: "4px",
            }}
          >
            {" "}
            meets{" "}
          </span>
          <span
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            style={{
              color: "#302f2d",
              fontFamily: "Righteous, display",
            }}
          >
            client desires
          </span>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl" style={{ fontFamily: "Righteous, display" }}>
            {" "}
            to create{" "}
          </span>
          <span
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
            style={{
              color: "#2d2b2a",
              fontFamily: "Righteous, display",
            }}
          >
            legendary designs!
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full px-4 mb-8 sm:mb-12 opacity-0"
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
              className="group relative overflow-hidden bg-gradient-to-r from-festival-orange to-festival-pink text-white font-black px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-base sm:text-lg lg:text-xl uppercase tracking-wide inline-flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto justify-center"
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound()}
            >
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
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
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
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
              className="border-2 sm:border-4 border-black text-black hover:bg-festival-yellow hover:text-black font-black px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl transition-all duration-300 text-base sm:text-lg lg:text-xl uppercase tracking-wide bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto justify-center inline-flex items-center gap-2 sm:gap-3"
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
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span>See Magic</span>
            </Button>
          </motion.div>
        </div>

        {/* Floating stats */}
        <div
          ref={statsRef}
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full px-4 opacity-0"
        >
          {[
            { label: "Happy Clients", value: "500+", icon: Heart },
            { label: "projects", value: "400+", icon: Wand2 },
            { label: "Awards", value: "15+", icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white border-2 sm:border-4 border-black rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] flex-1 max-w-[120px] sm:max-w-[140px]"
              whileHover={{
                scale: 1.05,
                rotate: i % 2 === 0 ? 2 : -2,
                boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
              }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5 + 3,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center"
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-festival-orange mb-1 sm:mb-2" />
                <div className="text-lg sm:text-xl lg:text-2xl font-black text-black">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-black/70 text-center">
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
