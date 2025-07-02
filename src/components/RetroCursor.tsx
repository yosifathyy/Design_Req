import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface RetroCursorProps {
  enabled?: boolean;
}

export const RetroCursor: React.FC<RetroCursorProps> = ({ enabled = true }) => {
  const cursorMainRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const pixelDotsRef = useRef<HTMLDivElement[]>([]);

  const [isHovering, setIsHovering] = useState(false);
  const [cursorMode, setCursorMode] = useState<"normal" | "hover" | "click">(
    "normal",
  );

  useEffect(() => {
    if (!enabled) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Create pixel dots for retro effect
    const pixelDots: HTMLDivElement[] = [];
    const container = document.body;

    // Create 16 pixel dots in a grid pattern
    for (let i = 0; i < 16; i++) {
      const dot = document.createElement("div");
      dot.className = "fixed pointer-events-none z-[9996]";
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.backgroundColor = `hsl(${280 + i * 15}, 90%, 70%)`;
      dot.style.borderRadius = "50%";
      dot.style.opacity = "0";
      dot.style.transform = "translate(-50%, -50%)";
      dot.style.boxShadow = `0 0 15px hsl(${280 + i * 15}, 90%, 70%)`;
      container.appendChild(dot);
      pixelDots.push(dot);
      pixelDotsRef.current.push(dot);
    }

    // Set initial positions
    gsap.set(
      [cursorMainRef.current, cursorTrailRef.current, scanLineRef.current],
      {
        xPercent: -50,
        yPercent: -50,
      },
    );

    gsap.set(pixelDots, {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
    });

    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Main cursor - pixelated movement (slight grid snap)
      const snapX = Math.round(mouseX / 2) * 2;
      const snapY = Math.round(mouseY / 2) * 2;

      gsap.to(cursorMainRef.current, {
        x: snapX,
        y: snapY,
        duration: 0.1,
        ease: "none",
      });

      // Trail with delay and easing
      gsap.to(cursorTrailRef.current, {
        x: mouseX,
        y: mouseY,
        duration: 0.3,
        ease: "power2.out",
      });

      // Scan line with smooth follow
      gsap.to(scanLineRef.current, {
        x: mouseX,
        y: mouseY,
        duration: 0.4,
        ease: "power1.out",
      });

      // Pixel dots follow in formation
      pixelDots.forEach((dot, index) => {
        const angle = (index / pixelDots.length) * Math.PI * 2;
        const radius = cursorMode === "hover" ? 60 : 15; // Much larger radius on hover
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;

        gsap.to(dot, {
          x: mouseX + offsetX,
          y: mouseY + offsetY,
          duration: 0.2 + index * 0.01,
          ease: "power2.out",
        });
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if current element or any parent is interactive
      let element: HTMLElement | null = target;
      let isInteractive = false;

      while (element && element !== document.body) {
        if (
          element.tagName === "A" ||
          element.tagName === "BUTTON" ||
          element.classList.contains("cursor-pointer") ||
          element.getAttribute("role") === "button" ||
          element.getAttribute("role") === "link" ||
          element.getAttribute("role") === "menuitem" ||
          element.hasAttribute("onclick") ||
          (element.hasAttribute("tabindex") &&
            element.getAttribute("tabindex") !== "-1") ||
          element.tagName === "INPUT" ||
          element.tagName === "TEXTAREA" ||
          element.tagName === "SELECT"
        ) {
          isInteractive = true;
          break;
        }
        element = element.parentElement;
      }

      if (isInteractive && !isHovering) {
        setIsHovering(true);
        setCursorMode("hover");

        // Transform main cursor into pulsing star shape
        gsap.to(cursorMainRef.current, {
          scale: 1.5,
          rotation: 45,
          borderRadius: "30%",
          duration: 0.4,
          ease: "back.out(2)",
        });

        // Add pulsing animation to create star effect
        gsap.to(cursorMainRef.current, {
          scale: 1.8,
          duration: 0.6,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Trail becomes a smaller rotating ring
        gsap.to(cursorTrailRef.current, {
          scale: 2,
          borderWidth: "4px",
          borderStyle: "solid",
          rotation: 180,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });

        // Scan line becomes a cross pattern
        gsap.to(scanLineRef.current, {
          scaleX: 20,
          scaleY: 2,
          opacity: 1,
          borderRadius: "50%",
          duration: 0.4,
          ease: "power2.out",
        });

        // Pixel dots form a large starburst pattern
        gsap.to(pixelDotsRef.current, {
          scale: 2,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(3)",
          stagger: {
            amount: 0.3,
            from: "center",
          },
        });

        // Continuous rotation for pixel dots
        gsap.to(pixelDotsRef.current, {
          rotation: 360,
          duration: 2,
          ease: "none",
          repeat: -1,
        });

        // Pulsing animation for pixel dots
        gsap.to(pixelDotsRef.current, {
          scale: 2.5,
          duration: 0.8,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
          stagger: {
            amount: 0.4,
            from: "random",
          },
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;

      // Check if we're moving to an interactive element
      let element: HTMLElement | null = relatedTarget;
      let nowInteractive = false;

      if (relatedTarget) {
        while (element && element !== document.body) {
          if (
            element.tagName === "A" ||
            element.tagName === "BUTTON" ||
            element.classList.contains("cursor-pointer") ||
            element.getAttribute("role") === "button" ||
            element.getAttribute("role") === "link" ||
            element.getAttribute("role") === "menuitem" ||
            element.hasAttribute("onclick") ||
            (element.hasAttribute("tabindex") &&
              element.getAttribute("tabindex") !== "-1") ||
            element.tagName === "INPUT" ||
            element.tagName === "TEXTAREA" ||
            element.tagName === "SELECT"
          ) {
            nowInteractive = true;
            break;
          }
          element = element.parentElement;
        }
      }

      if (!nowInteractive && isHovering) {
        setIsHovering(false);
        setCursorMode("normal");

        // Kill pulsing animation and reset main cursor
        gsap.killTweensOf(cursorMainRef.current);
        gsap.to(cursorMainRef.current, {
          scale: 1,
          rotation: 0,
          borderRadius: "2px",
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });

        // Reset trail
        gsap.to(cursorTrailRef.current, {
          scale: 1,
          borderWidth: "3px",
          borderStyle: "dotted",
          rotation: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });

        // Reset scan line
        gsap.to(scanLineRef.current, {
          scaleX: 1,
          scaleY: 1,
          opacity: 0.4,
          borderRadius: "1px",
          duration: 0.4,
          ease: "power2.out",
        });

        // Hide pixel dots
        gsap.to(pixelDotsRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "back.in(1.7)",
          stagger: 0.03,
        });

        // Kill all animations on pixel dots
        gsap.killTweensOf(pixelDotsRef.current);
      }
    };

    const handleMouseDown = () => {
      setCursorMode("click");

      // Squash effect on click
      gsap.to(cursorMainRef.current, {
        scaleX: 1.5,
        scaleY: 0.7,
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(cursorTrailRef.current, {
        scale: isHovering ? 1.5 : 0.8,
        duration: 0.1,
        ease: "power2.out",
      });

      // Pixel dots burst outward
      gsap.to(pixelDotsRef.current, {
        scale: 1.8,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      setCursorMode(isHovering ? "hover" : "normal");

      // Return to previous state
      const targetScaleX = isHovering ? 0.5 : 1;
      const targetScaleY = isHovering ? 1.5 : 1;
      const targetRotation = isHovering ? 45 : 0;

      gsap.to(cursorMainRef.current, {
        scaleX: targetScaleX,
        scaleY: targetScaleY,
        rotation: targetRotation,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(cursorTrailRef.current, {
        scale: isHovering ? 2 : 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)",
      });

      gsap.to(glitchRef.current, {
        opacity: isHovering ? 0.6 : 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.to(pixelDotsRef.current, {
        scale: isHovering ? 1 : 0,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    // Add continuous animations
    gsap.to(scanLineRef.current, {
      scaleY: 1.2,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Glitch effect random flicker
    gsap.to(glitchRef.current, {
      x: "+=2",
      duration: 0.1,
      ease: "none",
      repeat: -1,
      repeatDelay: gsap.utils.random(0.5, 2),
      yoyo: true,
    });

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      // Clean up pixel dots
      pixelDots.forEach((dot) => {
        if (dot.parentNode) {
          dot.parentNode.removeChild(dot);
        }
      });
      pixelDotsRef.current = [];
    };
  }, [enabled, isHovering, cursorMode]);

  if (!enabled) return null;

  return (
    <>
      {/* Main cursor - pixelated square */}
      <div
        ref={cursorMainRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "hsl(var(--festival-orange))",
          borderRadius: "2px",
          border: "2px solid hsl(var(--festival-black))",
          boxShadow: `
            inset 2px 2px 0 hsl(var(--festival-yellow)),
            inset -2px -2px 0 hsl(var(--festival-pink)),
            4px 4px 0 hsl(var(--festival-black))
          `,
          imageRendering: "pixelated",
        }}
      />

      {/* Trail cursor - retro circle */}
      <div
        ref={cursorTrailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: "28px",
          height: "28px",
          border: "3px solid hsl(var(--festival-pink))",
          borderRadius: "50%",
          backgroundColor: "transparent",
          borderStyle: "dotted",
          boxShadow: `
            0 0 0 2px hsl(var(--festival-black)),
            0 0 20px hsl(var(--festival-pink))
          `,
        }}
      />

      {/* Scan line effect */}
      <div
        ref={scanLineRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: "2px",
          height: "40px",
          backgroundColor: "hsl(var(--festival-yellow))",
          opacity: 0.4,
          boxShadow: `
            0 0 10px hsl(var(--festival-yellow)),
            0 0 20px hsl(var(--festival-orange))
          `,
          borderRadius: "1px",
        }}
      />

      {/* Glitch effect */}
      <div
        ref={glitchRef}
        className="fixed top-0 left-0 pointer-events-none z-[9995]"
        style={{
          width: "20px",
          height: "20px",
          background: `linear-gradient(45deg,
            hsl(var(--festival-pink)) 0%,
            transparent 25%,
            hsl(var(--festival-orange)) 50%,
            transparent 75%,
            hsl(var(--festival-yellow)) 100%
          )`,
          opacity: 0,
          borderRadius: "2px",
          filter: "blur(1px)",
          mixBlendMode: "screen",
        }}
      />

      <style jsx>{`
        @keyframes pixelPulse {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: scale(1.1) rotate(2deg);
            filter: hue-rotate(90deg);
          }
        }
      `}</style>
    </>
  );
};

export default RetroCursor;
