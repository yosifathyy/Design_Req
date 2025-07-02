import React, { useEffect, useRef, ReactNode } from "react";
import {
  useGSAPScrollTrigger,
  useGSAPStagger,
  useGSAPHover,
  useGSAPFloating,
  useGSAPTypewriter,
  useGSAPParallax,
} from "@/lib/gsap-animations";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface GSAPFadeInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export const GSAPFadeIn: React.FC<GSAPFadeInProps> = ({
  children,
  direction = "up",
  delay = 0,
  className,
}) => {
  const ref = useGSAPScrollTrigger("fadeIn", direction, delay);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface GSAPSlideInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export const GSAPSlideIn: React.FC<GSAPSlideInProps> = ({
  children,
  direction = "left",
  delay = 0,
  className,
}) => {
  const ref = useGSAPScrollTrigger("slideIn", direction, delay);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface GSAPBounceInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const GSAPBounceIn: React.FC<GSAPBounceInProps> = ({
  children,
  delay = 0,
  className,
}) => {
  const ref = useGSAPScrollTrigger("bounceIn", "up", delay);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface GSAPScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const GSAPScaleIn: React.FC<GSAPScaleInProps> = ({
  children,
  delay = 0,
  className,
}) => {
  const ref = useGSAPScrollTrigger("scaleIn", "up", delay);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface GSAPFlipInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const GSAPFlipIn: React.FC<GSAPFlipInProps> = ({
  children,
  delay = 0,
  className,
}) => {
  const ref = useGSAPScrollTrigger("flipIn", "up", delay);

  return (
    <div ref={ref} className={cn("preserve-3d", className)}>
      {children}
    </div>
  );
};

interface GSAPStaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const GSAPStagger: React.FC<GSAPStaggerProps> = ({
  children,
  staggerDelay = 0.1,
  className,
}) => {
  const ref = useGSAPStagger(staggerDelay);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface GSAPHoverProps {
  children: ReactNode;
  animation?: "lift" | "tilt" | "glow" | "bounce" | "wiggle";
  className?: string;
}

export const GSAPHover: React.FC<GSAPHoverProps> = ({
  children,
  animation = "lift",
  className,
}) => {
  const ref = useGSAPHover(animation);

  return (
    <div ref={ref} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
};

interface GSAPFloatingProps {
  children: ReactNode;
  amplitude?: number;
  duration?: number;
  className?: string;
}

export const GSAPFloating: React.FC<GSAPFloatingProps> = ({
  children,
  amplitude = 10,
  duration = 3,
  className,
}) => {
  const ref = useGSAPFloating(amplitude, duration);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface GSAPTypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

export const GSAPTypewriter: React.FC<GSAPTypewriterProps> = ({
  text,
  speed = 0.05,
  className,
}) => {
  const ref = useGSAPTypewriter(text, speed);

  return <div ref={ref} className={className}></div>;
};

interface GSAPParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const GSAPParallax: React.FC<GSAPParallaxProps> = ({
  children,
  speed = 0.5,
  className,
}) => {
  const ref = useGSAPParallax(speed);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface GSAPMagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GSAPMagneticButton: React.FC<GSAPMagneticButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !magnetRef.current) return;

    const button = buttonRef.current;
    const magnet = magnetRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (magnetRef.current) {
        magnetRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      }
    };

    const handleMouseLeave = () => {
      if (magnetRef.current) {
        magnetRef.current.style.transition =
          "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        magnetRef.current.style.transform = "translate(0px, 0px)";
      }
    };

    const handleMouseEnter = () => {
      if (magnetRef.current) {
        magnetRef.current.style.transition = "transform 0.3s ease-out";
      }
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={cn("relative overflow-hidden", className)}
      onClick={onClick}
    >
      <div ref={magnetRef} className="w-full h-full">
        {children}
      </div>
    </button>
  );
};

interface GSAPMorphingSVGProps {
  className?: string;
  color?: string;
}

export const GSAPMorphingSVG: React.FC<GSAPMorphingSVGProps> = ({
  className,
  color = "#ff6b35",
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const path = pathRef.current;
    const paths = [
      "M50,100 Q100,50 150,100 T250,100",
      "M50,100 Q100,150 150,100 T250,100",
      "M50,100 Q75,75 150,100 T250,100",
      "M50,100 Q125,125 150,100 T250,100",
    ];

    let currentIndex = 0;

    const animatePath = () => {
      const nextIndex = (currentIndex + 1) % paths.length;

      // Simple path animation without GSAP for SVG
      path.style.transition = "d 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      path.setAttribute("d", paths[nextIndex]);

      currentIndex = nextIndex;
      setTimeout(animatePath, 3000);
    };

    setTimeout(animatePath, 1000);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <svg
      className={className}
      viewBox="0 0 300 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M50,100 Q100,50 150,100 T250,100"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

interface GSAPRevealTextProps {
  text: string;
  splitType?: "words" | "chars";
  className?: string;
  delay?: number;
}

export const GSAPRevealText: React.FC<GSAPRevealTextProps> = ({
  text,
  splitType = "words",
  className,
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const splits = splitType === "words" ? text.split(" ") : text.split("");

    element.innerHTML = splits
      .map(
        (part, index) =>
          `<span style="display: inline-block; opacity: 0; transform: translateY(50px); transition-delay: ${index * 0.1 + delay}s;">${part}${splitType === "words" ? " " : ""}</span>`,
      )
      .join("");

    const spans = element.querySelectorAll("span");

    // Use Intersection Observer for scroll trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            spans.forEach((span, index) => {
              setTimeout(
                () => {
                  (span as HTMLElement).style.opacity = "1";
                  (span as HTMLElement).style.transform = "translateY(0)";
                  (span as HTMLElement).style.transition =
                    "opacity 0.8s ease-out, transform 0.8s ease-out";
                },
                index * (splitType === "words" ? 100 : 50) + delay * 1000,
              );
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [text, splitType, delay]);

  return <div ref={ref} className={className}></div>;
};
