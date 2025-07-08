import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  gradient: string;
  onClick?: () => void;
  badge?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  gradient,
  onClick,
  badge,
  className,
}) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all duration-200 hover:transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        gradient,
        className,
      )}
      onClick={onClick}
    >
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className={cn("p-3 rounded-lg border-2 border-black", color)}>
            <Icon className="w-6 h-6 text-black" />
          </div>
          {badge && (
            <div className="bg-festival-black text-white px-2 py-1 rounded border-2 border-black text-sm font-bold">
              {badge}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-black/80 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-display font-bold text-black">{value}</p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-4 h-4 bg-black opacity-20 transform rotate-45" />
      <div className="absolute bottom-2 left-2 w-6 h-6 bg-black opacity-10 rounded-full" />
    </Card>
  );
};
