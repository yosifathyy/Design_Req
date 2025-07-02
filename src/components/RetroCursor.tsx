import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

interface RetroCursorProps {
  enabled?: boolean;
}

export const RetroCursor: React.FC<RetroCursorProps> = ({ enabled = true }) => {
  const isMobile = useIsMobile();
  const cursorMainRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [cursorMode, setCursorMode] = useState<"normal" | "hover" | "click">(
    "normal",
  );

  useEffect(() => {
    if (!enabled) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Set initial positions
    gsap.set([cursorMainRef.current, scanLineRef.current], {
      xPercent: -50,
      yPercent: -50,
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

      // Scan line with smooth follow
      gsap.to(scanLineRef.current, {
        x: mouseX,
        y: mouseY,
        duration: 0.4,
        ease: "power1.out",
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

        // Scan line becomes a cross pattern
        gsap.to(scanLineRef.current, {
          scaleX: 20,
          scaleY: 2,
          opacity: 1,
          borderRadius: "50%",
          duration: 0.4,
          ease: "power2.out",
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

        // Reset scan line
        gsap.to(scanLineRef.current, {
          scaleX: 1,
          scaleY: 1,
          opacity: 0.4,
          borderRadius: "1px",
          duration: 0.4,
          ease: "power2.out",
        });
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
    };

    const handleMouseUp = () => {
      setCursorMode(isHovering ? "hover" : "normal");

      // Return to previous state
      const targetScale = isHovering ? 1.5 : 1;
      const targetRotation = isHovering ? 45 : 0;

      if (isHovering) {
        // Restart pulsing animation if hovering
        gsap.killTweensOf(cursorMainRef.current);
        gsap.set(cursorMainRef.current, {
          scale: targetScale,
          rotation: targetRotation,
        });
        gsap.to(cursorMainRef.current, {
          scale: 1.8,
          duration: 0.6,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      } else {
        gsap.to(cursorMainRef.current, {
          scale: targetScale,
          rotation: targetRotation,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        });
      }
    };

    // Add continuous animations
    gsap.to(scanLineRef.current, {
      scaleY: 1.2,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
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
