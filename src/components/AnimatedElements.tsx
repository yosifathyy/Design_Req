import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

// Scroll animation hook
export const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return { ref, controls };
};

// Fade in up animation
export const FadeInUp = ({ children, delay = 0, className = "" }: any) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Bounce in animation (cartoony)
export const BounceIn = ({ children, delay = 0, className = "" }: any) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.3, rotate: -10 },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: {
            type: "spring",
            damping: 10,
            stiffness: 100,
          },
        },
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide and rotate animation
export const SlideRotate = ({
  children,
  delay = 0,
  direction = "left",
  className = "",
}: any) => {
  const { ref, controls } = useScrollAnimation();

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -100 : 100,
      rotate: direction === "left" ? -15 : 15,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Jump animation (very cartoony)
export const JumpIn = ({ children, delay = 0, className = "" }: any) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 100, scale: 0.5, rotate: 180 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          transition: {
            type: "spring",
            damping: 8,
            stiffness: 100,
            bounce: 0.6,
          },
        },
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Wiggle animation for icons
export const WiggleIcon = ({ children, className = "" }: any) => {
  return (
    <motion.div
      whileHover={{
        rotate: [0, -10, 10, -10, 0],
        scale: [1, 1.1, 1.1, 1.1, 1],
        transition: { duration: 0.5 },
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Simple Tilt Card without 3D transforms
export const TiltCard = ({ children, className = "" }: any) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating animation
export const FloatingElement = ({ children, className = "" }: any) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, 0, -2, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animation
export const StaggerContainer = ({ children, className = "" }: any) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerChild = ({ children, className = "" }: any) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            damping: 20,
            stiffness: 100,
          },
        },
      }}
      className={cn("flex flex-col justify-center items-start", className)}
    >
      {children}
    </motion.div>
  );
};
