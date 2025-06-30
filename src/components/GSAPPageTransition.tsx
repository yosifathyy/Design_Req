import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

interface GSAPPageTransitionProps {
  children: React.ReactNode;
}

export const GSAPPageTransition: React.FC<GSAPPageTransitionProps> = ({
  children,
}) => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current || !overlayRef.current) return;

    const page = pageRef.current;
    const overlay = overlayRef.current;

    // Page enter animation
    const tl = gsap.timeline();

    // Set initial states
    gsap.set(page, { opacity: 0, y: 50, scale: 0.95 });
    gsap.set(overlay, { scaleY: 1, transformOrigin: "top" });

    // Animate overlay out and page in
    tl.to(overlay, {
      scaleY: 0,
      duration: 0.8,
      ease: "power2.inOut",
      transformOrigin: "bottom",
    }).to(
      page,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.4",
    );

    return () => {
      gsap.killTweensOf([page, overlay]);
    };
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-festival-orange z-[9999] pointer-events-none"
        style={{ transformOrigin: "top" }}
      />

      {/* Page content */}
      <div ref={pageRef}>{children}</div>
    </div>
  );
};

export default GSAPPageTransition;
