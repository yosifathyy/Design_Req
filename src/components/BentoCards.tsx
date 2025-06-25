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
    sm: "col-span-1 row-span-1 min-h-[200px]",
    md: "col-span-1 md:col-span-2 row-span-1 min-h-[250px]",
    lg: "col-span-1 md:col-span-2 lg:col-span-3 row-span-2 min-h-[350px]",
    xl: "col-span-1 md:col-span-2 lg:col-span-4 row-span-2 min-h-[400px]",
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
        y: -5,
        scale: 1.02,
        transition: { type: "spring", damping: 20, stiffness: 300 },
      }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(sizeClasses[size], className)}
    >
      <Card
        className={cn(
          "h-full border-3 border-retro-purple/30 shadow-lg hover:shadow-2xl transition-all duration-300",
          gradient
            ? `bg-gradient-to-br ${gradient}`
            : "bg-white/60 backdrop-blur-sm",
          "relative overflow-hidden group",
        )}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <motion.div
            className="absolute top-4 right-4 w-8 h-8 bg-retro-orange/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-4 left-4 w-6 h-6 bg-retro-teal/30 rounded-full"
            animate={{
              scale: [1, 0.8, 1],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full">{children}</div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-retro-purple/10 via-retro-teal/10 to-retro-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        "grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-min",
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
      <div className="p-6 h-full flex flex-col justify-center items-center text-center">
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-retro-purple to-retro-teal rounded-2xl flex items-center justify-center mb-4"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          className="font-display text-3xl text-retro-purple mb-2"
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
        <div className="text-sm text-retro-purple/70 font-medium">{label}</div>
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
      <div className="p-6 h-full flex flex-col">
        <motion.div
          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4"
          whileHover={{
            rotate: [0, -10, 10, 0],
            scale: 1.1,
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="font-bold text-xl text-white mb-3">{title}</h3>
        <p className="text-white/80 flex-1">{description}</p>
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
