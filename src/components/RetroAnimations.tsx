import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

// Floating background shapes
export const RetroFloatingShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const shapes = containerRef.current.querySelectorAll(".floating-shape");

    shapes.forEach((shape, i) => {
      // Random initial position
      gsap.set(shape, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      });

      // Continuous floating animation
      gsap.to(shape, {
        x: `+=${Math.random() * 400 - 200}`,
        y: `+=${Math.random() * 400 - 200}`,
        rotation: `+=${Math.random() * 720 - 360}`,
        duration: 10 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: "none",
        delay: i * 0.5,
      });

      // Scale pulsing
      gsap.to(shape, {
        scale: `+=${Math.random() * 0.3}`,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`floating-shape absolute opacity-20 ${
            i % 4 === 0
              ? "w-16 h-16 bg-retro-purple rounded-full"
              : i % 4 === 1
                ? "w-12 h-12 bg-retro-teal rotate-45"
                : i % 4 === 2
                  ? "w-20 h-8 bg-retro-orange rounded-full"
                  : "w-10 h-10 bg-retro-pink rounded-full border-4 border-white"
          }`}
        />
      ))}
    </div>
  );
};

// Retro scanlines effect
export const RetroScanlines: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 opacity-10">
      <div
        className="w-full h-full"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            )
          `,
        }}
      />
    </div>
  );
};

// Parallax retro grid
export const RetroGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    // Parallax effect on scroll
    gsap.to(gridRef.current, {
      backgroundPositionY: "-50%",
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 0, 149, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 0, 149, 0.2) 1px, transparent 1px),
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        backgroundPosition: "0 0, 0 0, 0 0, 0 0",
      }}
    />
  );
};

// Crazy scroll-triggered text animations
export const RetroScrollText: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = "" }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const letters = textRef.current.querySelectorAll(".letter");

    // Initial state
    gsap.set(letters, {
      opacity: 0,
      y: 100,
      rotation: 45,
      scale: 0,
    });

    // Stagger animation
    gsap.to(letters, {
      opacity: 1,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.8,
      stagger: {
        amount: 1.5,
        from: "random",
      },
      ease: "elastic.out(1, 0.3)",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Continuous wobble
    gsap.to(letters, {
      y: "random(-5, 5)",
      rotation: "random(-2, 2)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random",
      },
    });
  }, []);

  return (
    <div ref={textRef} className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="letter inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

// Retro button with crazy hover effects
export const RetroButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = "" }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    // Hover timeline
    const hoverTl = gsap.timeline({ paused: true });
    hoverTl
      .to(button, {
        scale: 1.1,
        rotation: 5,
        y: -10,
        boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.4)",
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(
        button.querySelector(".button-text"),
        {
          scale: 1.1,
          color: "#FFFFFF",
          duration: 0.3,
        },
        0,
      );

    // Click animation
    const clickTl = gsap.timeline({ paused: true });
    clickTl.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    const handleMouseEnter = () => hoverTl.play();
    const handleMouseLeave = () => hoverTl.reverse();
    const handleClick = () => {
      clickTl.restart();
      onClick?.();
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick);
    };
  }, [onClick]);

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-retro-purple to-retro-pink
        border-4 border-black rounded-2xl
        px-8 py-4 font-black text-lg uppercase tracking-wide
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        transition-all duration-200
        ${className}
      `}
    >
      <span className="button-text relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-retro-orange to-retro-teal opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

// Crazy geometric background
export const RetroGeometricBg: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const shapes = containerRef.current.querySelectorAll(".geo-shape");

    shapes.forEach((shape, i) => {
      // Continuous rotation and movement
      gsap.to(shape, {
        rotation: 360,
        duration: 20 + i * 5,
        repeat: -1,
        ease: "none",
      });

      gsap.to(shape, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 15 + i * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Scale pulsing
      gsap.to(shape, {
        scale: "random(0.5, 1.5)",
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-30"
    >
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`geo-shape absolute ${
            i % 3 === 0
              ? "w-32 h-32 bg-retro-purple/20 rounded-full"
              : i % 3 === 1
                ? "w-24 h-24 bg-retro-teal/20 rotate-45"
                : "w-20 h-40 bg-retro-orange/20 rounded-full"
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};
