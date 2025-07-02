import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface GSAPCursorProps {
  enabled?: boolean;
  size?: number;
  color?: string;
  blendMode?: string;
}

export const GSAPCursor: React.FC<GSAPCursorProps> = ({
  enabled = true,
  size = 20,
  color = "#ff6b35",
  blendMode = "multiply",
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled || !cursorRef.current) return;

    const cursor = cursorRef.current;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Set initial positions
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
    });

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.classList.contains("cursor-pointer") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.classList.contains("cursor-pointer") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(false);
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: isHovering ? 1.5 : 1,
        duration: 0.1,
        ease: "power2.out",
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
    };
  }, [enabled, isHovering]);

  if (!enabled) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "50%",
          mixBlendMode: blendMode as any,
        }}
      />
    </>
  );
};

export default GSAPCursor;
