import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface GSAPLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export const GSAPLoader: React.FC<GSAPLoaderProps> = ({
  onComplete,
  duration = 2.5,
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (
      !loaderRef.current ||
      !logoRef.current ||
      !textRef.current ||
      !dotsRef.current ||
      !progressRef.current
    )
      return;

    const loader = loaderRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const dots = dotsRef.current.children;
    const progressBar = progressRef.current;

    // Set initial states
    gsap.set(logo, { scale: 0, rotation: -180, opacity: 0 });
    gsap.set(text, { y: 50, opacity: 0 });
    gsap.set(dots, { scale: 0, y: 20 });
    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left" });

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the loader
        gsap.to(loader, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            if (onComplete) onComplete();
            loader.style.display = "none";
          },
        });
      },
    });

    // Animate logo entrance
    tl.to(logo, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
    })
      // Animate text
      .to(
        text,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3",
      )
      // Animate dots sequentially
      .to(
        dots,
        {
          scale: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "bounce.out",
        },
        "-=0.2",
      )
      // Progress bar animation
      .to(
        progressBar,
        {
          scaleX: 1,
          duration: duration * 0.6,
          ease: "power2.out",
          onUpdate: function () {
            setProgress(Math.round(this.progress() * 100));
          },
        },
        "-=0.1",
      )
      // Final bounce
      .to(
        logo,
        {
          scale: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        },
        "-=0.3",
      );

    // Floating animation for dots
    gsap.to(dots, {
      y: -10,
      duration: 1,
      stagger: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      delay: 1,
    });

    return () => {
      tl.kill();
      gsap.killTweensOf([loader, logo, text, dots, progressBar]);
    };
  }, [onComplete, duration]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-gradient-to-br from-festival-cream via-festival-yellow/30 to-festival-pink/30 z-[10000] flex items-center justify-center flex-col"
    >
      {/* Logo */}
      <div
        ref={logoRef}
        className="w-24 h-24 bg-gradient-to-br from-festival-orange to-festival-pink rounded-2xl flex items-center justify-center mb-8 shadow-2xl"
      >
        <div className="text-4xl">🎨</div>
      </div>

      {/* Text */}
      <div ref={textRef} className="text-center mb-8">
        <h1 className="font-display text-3xl font-black text-festival-black mb-2">
          design requests
        </h1>
        <p className="text-festival-black/70 font-medium">
          Loading creative magic...
        </p>
      </div>

      {/* Animated dots */}
      <div ref={dotsRef} className="flex space-x-2 mb-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-festival-orange"
            style={{
              backgroundColor: i % 2 === 0 ? "#ff6b35" : "#ff1f7a",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden mb-4">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-festival-orange to-festival-pink rounded-full"
        />
      </div>

      {/* Progress text */}
      <div className="text-festival-black/60 font-medium text-sm">
        {progress}%
      </div>
    </div>
  );
};

export default GSAPLoader;
