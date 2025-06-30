import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const GSAPScrollProgress: React.FC = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    const progress = progressRef.current;

    gsap.set(progress, { scaleX: 0, transformOrigin: "left" });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.to(progress, {
          scaleX: self.progress,
          duration: 0.1,
          ease: "none",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === document.body) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[9999] pointer-events-none">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-festival-orange via-festival-pink to-festival-yellow shadow-lg"
      />
    </div>
  );
};

export default GSAPScrollProgress;
