import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface GSAPInteractiveBackgroundProps {
  particleCount?: number;
  colors?: string[];
}

export const GSAPInteractiveBackground: React.FC<
  GSAPInteractiveBackgroundProps
> = ({ particleCount = 50, colors = ["#ff6b35", "#ff1f7a", "#ffeb3b"] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full pointer-events-none";
      particle.style.width = `${Math.random() * 8 + 4}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = "0.6";

      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      container.appendChild(particle);
      particles.push(particle);
      particlesRef.current.push(particle);
    }

    // Animate particles
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        rotation: `random(0, 360)`,
        scale: `random(0.5, 1.5)`,
        duration: `random(15, 25)`,
        repeat: -1,
        yoyo: true,
        ease: "none",
        delay: index * 0.1,
      });

      // Individual floating animation
      gsap.to(particle, {
        y: `random(-50, 50)`,
        duration: `random(3, 6)`,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: Math.random() * 2,
      });
    });

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      particles.forEach((particle) => {
        const particleRect = particle.getBoundingClientRect();
        const particleX =
          particleRect.left - rect.left + particleRect.width / 2;
        const particleY = particleRect.top - rect.top + particleRect.height / 2;

        const distance = Math.sqrt(
          Math.pow(x - particleX, 2) + Math.pow(y - particleY, 2),
        );

        if (distance < 100) {
          const angle = Math.atan2(y - particleY, x - particleX);
          const force = (100 - distance) / 100;
          const moveX = Math.cos(angle) * force * 30;
          const moveY = Math.sin(angle) * force * 30;

          gsap.to(particle, {
            x: `+=${moveX}`,
            y: `+=${moveY}`,
            scale: 1.5,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(particle, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      particles.forEach((particle) => {
        gsap.killTweensOf(particle);
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      particlesRef.current = [];
    };
  }, [particleCount, colors]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ mixBlendMode: "multiply" }}
    />
  );
};

export default GSAPInteractiveBackground;
