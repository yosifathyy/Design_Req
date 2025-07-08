import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface XPProgressProps {
  current: number;
  target: number;
  level: number;
  className?: string;
}

export const XPProgress: React.FC<XPProgressProps> = ({
  current,
  target,
  level,
  className,
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const percentage = Math.min((current / target) * 100, 100);

  useEffect(() => {
    if (!progressRef.current || !counterRef.current) return;

    // Animate progress bar
    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: `${percentage}%`,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
      },
    );

    // Animate counter
    gsap.fromTo(
      counterRef.current,
      { textContent: "0" },
      {
        textContent: current.toString(),
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
        snap: { textContent: 1 },
      },
    );
  }, [current, percentage]);

  return (
    <Card
      className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-festival-black rounded border-2 border-black">
              <Trophy className="w-5 h-5 text-festival-yellow" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/80 tracking-wide uppercase">
                Level {level}
              </p>
              <p className="text-lg font-display font-bold text-black">
                XP Progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-festival-black fill-festival-black" />
            <Star className="w-4 h-4 text-festival-black fill-festival-black" />
            <Star className="w-4 h-4 text-festival-black fill-festival-black" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-black">
              <span ref={counterRef}>0</span> / {target} XP
            </span>
            <span className="text-sm font-bold text-black">
              {Math.round(percentage)}%
            </span>
          </div>

          <div className="relative h-4 bg-black/20 border-2 border-black rounded-none overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-festival-orange via-festival-pink to-festival-magenta border-r-2 border-black"
              style={{ width: "0%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>

          <p className="text-xs text-black/70 font-medium">
            {target - current} XP to Level {level + 1}
          </p>
        </div>
      </div>
    </Card>
  );
};
