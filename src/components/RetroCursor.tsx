import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface RetroCursorProps {
  enabled?: boolean;
}

export const RetroCursor: React.FC<RetroCursorProps> = ({ enabled = true }) => {
  const cursorMainRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const trailDotsRef = useRef<HTMLDivElement[]>([]);

  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Create trail dots
    const trailDots: HTMLDivElement[] = [];
    const container = document.body;

    // Create trail elements
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement("div");
      dot.className = "fixed pointer-events-none z-[9997]";
      dot.style.width = `${8 - i}px`;
      dot.style.height = `${8 - i}px`;
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = `hsl(${325 + i * 10}, 100%, ${50 + i * 5}%)`;
      dot.style.opacity = `${0.8 - i * 0.1}`;
      dot.style.transform = "translate(-50%, -50%)";
      container.appendChild(dot);
      trailDots.push(dot);
      trailDotsRef.current.push(dot);
    }

    // Set initial positions
    gsap.set(
      [
        cursorMainRef.current,
        cursorTrailRef.current,
        cursorGlowRef.current,
        cursorTextRef.current,
      ],
      {
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      },
    );

    gsap.set(trailDots, {
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

      // Main cursor - instant follow
      gsap.to(cursorMainRef.current, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Trail cursor - delayed follow
      gsap.to(cursorTrailRef.current, {
        x: mouseX,
        y: mouseY,
        duration: 0.4,
        ease: "power2.out",
      });

      // Glow effect - smooth follow
      gsap.to(cursorGlowRef.current, {
        x: mouseX,
        y: mouseY,
        duration: 0.6,
        ease: "power1.out",
      });

      // Text element
      gsap.to(cursorTextRef.current, {
        x: mouseX,
        y: mouseY - 40,
        duration: 0.3,
        ease: "power2.out",
      });

      // Trail dots with staggered animation
      trailDots.forEach((dot, index) => {
        gsap.to(dot, {
          x: mouseX,
          y: mouseY,
          duration: 0.3 + index * 0.05,
          ease: "power2.out",
          delay: index * 0.02,
        });
      });
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.classList.contains("cursor-pointer") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.hasAttribute("onclick");

      if (isInteractive) {
        setIsHovering(true);
        setIsClickable(true);

        // Main cursor hover animation
        gsap.to(cursorMainRef.current, {
          scale: 0.3,
          duration: 0.4,
          ease: "back.out(2)",
        });

        // Trail expands and rotates
        gsap.to(cursorTrailRef.current, {
          scale: 2.5,
          rotation: 180,
          duration: 0.4,
          ease: "back.out(1.5)",
        });

        // Glow intensifies
        gsap.to(cursorGlowRef.current, {
          scale: 3,
          opacity: 0.8,
          duration: 0.4,
          ease: "power2.out",
        });

        // Trail dots animate in
        gsap.to(trailDotsRef.current, {
          scale: 1,
          rotation: 360,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.05,
        });

        // Check for custom cursor text
        const cursorTextAttr =
          target.getAttribute("data-cursor") ||
          target.closest("[data-cursor]")?.getAttribute("data-cursor") ||
          target.textContent?.slice(0, 10) ||
          "";

        if (cursorTextAttr) {
          setCursorText(cursorTextAttr);
          gsap.to(cursorTextRef.current, {
            opacity: 1,
            scale: 1,
            y: -50,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        }
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.classList.contains("cursor-pointer") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.hasAttribute("onclick");

      if (isInteractive) {
        setIsHovering(false);
        setIsClickable(false);
        setCursorText("");

        // Reset all elements
        gsap.to([cursorMainRef.current, cursorTrailRef.current], {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });

        gsap.to(cursorGlowRef.current, {
          scale: 1,
          opacity: 0.3,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(trailDotsRef.current, {
          scale: 0,
          rotation: 0,
          duration: 0.4,
          ease: "back.in(1.7)",
          stagger: 0.03,
        });

        gsap.to(cursorTextRef.current, {
          opacity: 0,
          scale: 0.8,
          y: -30,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    };

    const handleMouseDown = () => {
      // Click animation
      gsap.to([cursorMainRef.current, cursorTrailRef.current], {
        scale: isHovering ? [0.2, 2] : [0.7, 0.8],
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(cursorGlowRef.current, {
        scale: isHovering ? 4 : 1.5,
        opacity: 1,
        duration: 0.1,
        ease: "power2.out",
      });

      // Trail dots burst effect
      gsap.to(trailDotsRef.current, {
        scale: 1.5,
        duration: 0.1,
        ease: "power2.out",
        stagger: 0.01,
      });
    };

    const handleMouseUp = () => {
      // Return to hover state or normal state
      const targetScale = isHovering ? [0.3, 2.5] : [1, 1];
      const targetGlowScale = isHovering ? 3 : 1;
      const targetGlowOpacity = isHovering ? 0.8 : 0.3;

      gsap.to([cursorMainRef.current, cursorTrailRef.current], {
        scale: targetScale,
        duration: 0.2,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(cursorGlowRef.current, {
        scale: targetGlowScale,
        opacity: targetGlowOpacity,
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.to(trailDotsRef.current, {
        scale: isHovering ? 1 : 0,
        duration: 0.2,
        ease: "power2.out",
        stagger: 0.01,
      });
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      // Clean up trail dots
      trailDots.forEach((dot) => {
        if (dot.parentNode) {
          dot.parentNode.removeChild(dot);
        }
      });
      trailDotsRef.current = [];
    };
  }, [enabled, isHovering]);

  if (!enabled) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorMainRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "hsl(var(--festival-orange))",
          borderRadius: "50%",
          border: "2px solid hsl(var(--festival-black))",
          boxShadow: "0 0 20px hsl(var(--festival-orange))",
        }}
      />

      {/* Trail circle */}
      <div
        ref={cursorTrailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid hsl(var(--festival-pink))",
          borderRadius: "50%",
          backgroundColor: "transparent",
          borderStyle: "dashed",
          animation: "spin 3s linear infinite",
        }}
      />

      {/* Glow effect */}
      <div
        ref={cursorGlowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{
          width: "60px",
          height: "60px",
          background: `radial-gradient(circle, hsla(var(--festival-pink), 0.3) 0%, hsla(var(--festival-orange), 0.2) 40%, transparent 70%)`,
          borderRadius: "50%",
          opacity: 0.3,
          filter: "blur(2px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Cursor text */}
      <div
        ref={cursorTextRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] px-2 py-1 bg-festival-black text-festival-cream text-xs font-bold rounded-md opacity-0"
        style={{
          transform: "translate(-50%, -100%)",
        }}
      >
        {cursorText}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default RetroCursor;
