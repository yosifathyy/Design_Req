import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useEffect, useRef } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

// Detect if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Detect if user is on mobile device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

// Custom GSAP hooks for React components

export const useGSAPFadeIn = (trigger?: boolean, delay = 0) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "power2.out",
      },
    );

    return () => {
      gsap.killTweensOf(element);
    };
  }, [trigger, delay]);

  return ref;
};

export const useGSAPScrollTrigger = (
  animation: "fadeIn" | "slideIn" | "scaleIn" | "bounceIn" | "flipIn",
  direction: "up" | "down" | "left" | "right" = "up",
  delay = 0,
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const getInitialValues = () => {
      switch (animation) {
        case "fadeIn":
          return { opacity: 0, y: 30 };
        case "slideIn":
          return {
            opacity: 0,
            x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
            y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
          };
        case "scaleIn":
          return { opacity: 0, scale: 0.5, rotate: -10 };
        case "bounceIn":
          return { opacity: 0, scale: 0.3, y: 100, rotate: 15 };
        case "flipIn":
          return { opacity: 0, rotationY: 90, scale: 0.8 };
        default:
          return { opacity: 0, y: 30 };
      }
    };

    const getFinalValues = () => {
      const base = {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        rotationY: 0,
      };

      switch (animation) {
        case "bounceIn":
          return { ...base, ease: "bounce.out", duration: 1 };
        case "flipIn":
          return { ...base, ease: "power2.out", duration: 0.8 };
        default:
          return { ...base, ease: "power2.out", duration: 0.8 };
      }
    };

    gsap.set(element, getInitialValues());

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(element, {
          ...getFinalValues(),
          delay,
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
      gsap.killTweensOf(element);
    };
  }, [animation, direction, delay]);

  return ref;
};

export const useGSAPStagger = (staggerDelay = 0.1) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const children = element.children;

    gsap.set(children, { opacity: 0, y: 30, scale: 0.9 });

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: staggerDelay,
          ease: "power2.out",
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
      gsap.killTweensOf(children);
    };
  }, [staggerDelay]);

  return ref;
};

export const useGSAPHover = (
  hoverAnimation: "lift" | "tilt" | "glow" | "bounce" | "wiggle" = "lift",
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || isReducedMotion()) return;

    const element = ref.current;

    const getHoverAnimation = () => {
      switch (hoverAnimation) {
        case "lift":
          return { y: -8, scale: 1.02, duration: 0.3, ease: "power2.out" };
        case "tilt":
          return {
            rotation: 2,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          };
        case "glow":
          return { scale: 1.05, filter: "brightness(1.1)", duration: 0.3 };
        case "bounce":
          return { y: -12, scale: 1.05, duration: 0.4, ease: "bounce.out" };
        case "wiggle":
          return { rotation: 5, duration: 0.1, yoyo: true, repeat: 3 };
        default:
          return { y: -8, scale: 1.02, duration: 0.3, ease: "power2.out" };
      }
    };

    const handleMouseEnter = () => {
      gsap.to(element, getHoverAnimation());
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        y: 0,
        scale: 1,
        rotation: 0,
        filter: "brightness(1)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(element);
    };
  }, [hoverAnimation]);

  return ref;
};

export const useGSAPFloating = (amplitude = 10, duration = 3) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    // Completely disable if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }

    // Reduce animation on mobile but still allow it
    const isMobile = isMobileDevice();
    const adjustedAmplitude = isMobile ? amplitude * 0.5 : amplitude;
    const adjustedDuration = isMobile ? duration * 1.5 : duration;
    const repeatCount = isMobile ? 3 : -1; // Limited repeats on mobile, infinite on desktop

    // Floating animation
    const floatingTween = gsap.to(element, {
      y: -adjustedAmplitude,
      duration: adjustedDuration,
      yoyo: true,
      repeat: repeatCount,
      ease: "power1.inOut",
    });

    // After 10 seconds, kill the animation to let users read
    gsap.delayedCall(10, () => {
      gsap.to(element, {
        y: 0,
        duration: 1,
        ease: "power2.out",
      });
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [amplitude, duration]);

  return ref;
};

export const useGSAPTypewriter = (text: string, speed = 0.05) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(element, {
          duration: text.length * speed,
          text: text,
          ease: "none",
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [text, speed]);

  return ref;
};

export const useGSAPParallax = (speed = 0.5) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.set(element, { willChange: "transform" });

    ScrollTrigger.create({
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const yPos = progress * speed * 100;
        gsap.set(element, { y: yPos });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
      gsap.set(element, { willChange: "auto" });
    };
  }, [speed]);

  return ref;
};

export const useGSAPMorphingPath = () => {
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const path = ref.current;

    const paths = [
      "M50,100 Q100,50 150,100 T250,100",
      "M50,100 Q100,150 150,100 T250,100",
      "M50,100 Q75,75 150,100 T250,100",
      "M50,100 Q125,125 150,100 T250,100",
    ];

    let currentIndex = 0;

    const animatePath = () => {
      const nextIndex = (currentIndex + 1) % paths.length;

      gsap.to(path, {
        duration: 2,
        attr: { d: paths[nextIndex] },
        ease: "power2.inOut",
        onComplete: () => {
          currentIndex = nextIndex;
          setTimeout(animatePath, 1000);
        },
      });
    };

    animatePath();

    return () => {
      gsap.killTweensOf(path);
    };
  }, []);

  return ref;
};

// Utility functions for common animations
export const gsapAnimations = {
  // Page transition animation
  pageTransition: (element: HTMLElement, direction: "in" | "out" = "in") => {
    if (direction === "in") {
      return gsap.fromTo(
        element,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
      );
    } else {
      return gsap.to(element, {
        opacity: 0,
        y: -50,
        scale: 1.05,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  },

  // Card flip animation
  flipCard: (element: HTMLElement) => {
    return gsap.to(element, {
      rotationY: 180,
      duration: 0.6,
      ease: "power2.inOut",
    });
  },

  // Magnetic button effect
  magneticButton: (button: HTMLElement, magnet: HTMLElement) => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(magnet, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  },

  // Text reveal animation
  revealText: (
    element: HTMLElement,
    splitType: "words" | "chars" = "words",
  ) => {
    const text = element.textContent || "";
    const splits = splitType === "words" ? text.split(" ") : text.split("");

    element.innerHTML = splits
      .map(
        (part) =>
          `<span style="display: inline-block; opacity: 0; transform: translateY(50px);">${part}${splitType === "words" ? " " : ""}</span>`,
      )
      .join("");

    const spans = element.querySelectorAll("span");

    return gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: splitType === "words" ? 0.1 : 0.05,
      ease: "power2.out",
    });
  },
};

// Global GSAP setup
export const initializeGSAP = () => {
  // Set default ease
  gsap.defaults({
    ease: "power2.out",
    duration: 0.8,
  });

  // Smooth scrolling setup
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  // Refresh ScrollTrigger on route changes
  ScrollTrigger.refresh();
};
