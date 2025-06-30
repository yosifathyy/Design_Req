import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: string;
  delay?: number;
}

export const BentoCard = ({
  children,
  className = "",
  size = "md",
  gradient,
  delay = 0,
}: BentoCardProps) => {
  const sizeClasses = {
    // Small cards - 1 column on all sizes
    sm: "col-span-1 row-span-1 min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]",
    // Medium cards - 1 col mobile, 1 col tablet, 2 cols desktop
    md: "col-span-1 sm:col-span-1 lg:col-span-2 row-span-1 min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]",
    // Large cards - 1 col mobile, 2 cols tablet, 4 cols desktop
    lg: "col-span-1 sm:col-span-2 lg:col-span-4 row-span-1 lg:row-span-2 min-h-[320px] sm:min-h-[380px] lg:min-h-[450px]",
    // Extra large cards - full width on all sizes
    xl: "col-span-1 sm:col-span-2 lg:col-span-4 row-span-1 lg:row-span-2 min-h-[380px] sm:min-h-[450px] lg:min-h-[500px]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay,
        },
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", damping: 20, stiffness: 300 },
      }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(sizeClasses[size], className)}
    >
      <Card
        className={cn(
          "h-full border-3 border-retro-purple/30 shadow-xl hover:shadow-3xl transition-all duration-300",
          gradient
            ? `bg-gradient-to-br ${gradient}`
            : "bg-white/70 backdrop-blur-sm",
          "relative overflow-hidden group cursor-pointer",
        )}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          <motion.div
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-retro-orange/40 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-retro-teal/40 rounded-full"
            animate={{
              scale: [1, 0.7, 1],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-retro-pink/30 rounded-full"
            animate={{
              scale: [0.5, 1.2, 0.5],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full">{children}</div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-retro-purple/10 via-retro-teal/10 to-retro-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-lg border-2 border-retro-purple/0 group-hover:border-retro-purple/50 transition-all duration-300" />
      </Card>
    </motion.div>
  );
};

export const BentoGrid = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        // Responsive grid: 1 col mobile, 2 cols tablet, 4 cols desktop
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8 auto-rows-min w-full",
        className,
      )}
    >
      {children}
    </div>
  );
};

// Special Bento cards for different content types
export const StatBentoCard = ({
  stat,
  label,
  icon: Icon,
  delay = 0,
}: {
  stat: string;
  label: string;
  icon: any;
  delay?: number;
}) => {
  return (
    <BentoCard size="sm" delay={delay}>
      <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-center items-center text-center">
        <motion.div
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-purple to-retro-teal rounded-2xl lg:rounded-3xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 shadow-lg"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
        </motion.div>
        <motion.div
          className="font-display text-2xl sm:text-3xl lg:text-4xl text-retro-purple mb-2 sm:mb-3"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 100,
            delay: delay + 0.2,
          }}
        >
          {stat}
        </motion.div>
        <div className="text-sm sm:text-base text-retro-purple/70 font-medium text-center leading-tight">
          {label}
        </div>
      </div>
    </BentoCard>
  );
};

export const FeatureBentoCard = ({
  title,
  description,
  icon: Icon,
  gradient,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: any;
  gradient: string;
  delay?: number;
}) => {
  return (
    <BentoCard size="md" gradient={gradient} delay={delay}>
      <div className="p-5 sm:p-6 lg:p-8 h-full flex flex-col">
        <motion.div
          className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-white/25 backdrop-blur-sm rounded-2xl lg:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 shadow-xl border-2 border-white/30"
          whileHover={{
            rotate: [0, -10, 10, 0],
            scale: 1.1,
          }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
        </motion.div>
        <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-white mb-3 sm:mb-4">
          {title}
        </h3>
        <p className="text-white/90 flex-1 text-sm sm:text-base lg:text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </BentoCard>
  );
};

export const HeroBentoCard = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => {
  return (
    <BentoCard
      size="xl"
      gradient="from-retro-purple/20 via-retro-teal/20 to-retro-orange/20"
      delay={delay}
    >
      {children}
    </BentoCard>
  );
};