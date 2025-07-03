import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Sparkles, Zap, Heart, Star, Wand2 } from "lucide-react";

const RetroPreloader: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    "Loading creative vibes...",
    "Mixing colors...",
    "Adding sparkles...",
    "Brewing magic...",
    "Almost ready!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 3 + 1;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    const phaseTimer = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(phaseTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0
                ? "bg-festival-orange/20"
                : i % 4 === 1
                  ? "bg-festival-pink/20"
                  : i % 4 === 2
                    ? "bg-festival-yellow/20"
                    : "bg-festival-coral/20"
            }`}
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Animated Logo/Icon */}
        <motion.div
          className="mb-12"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-festival-orange to-festival-pink rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Palette className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>

            {/* Floating Icons */}
            {[Sparkles, Zap, Heart, Star, Wand2].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${50 + 40 * Math.cos((i * 72 * Math.PI) / 180)}%`,
                  top: `${50 + 40 * Math.sin((i * 72 * Math.PI) / 180)}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <div className="w-8 h-8 bg-festival-yellow rounded-full border-2 border-black flex items-center justify-center">
                  <Icon className="w-4 h-4 text-black" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Animated Text */}
        <motion.h1
          className="text-4xl md:text-6xl font-black text-black mb-8 text-center"
          style={{
            fontFamily: "Righteous, display",
            textShadow: "4px 4px 0px rgba(0,0,0,0.3)",
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Design Requests
        </motion.h1>

        {/* Phase Text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhase}
            className="text-xl md:text-2xl text-black/80 font-bold mb-12 text-center"
            style={{ fontFamily: "Righteous, display" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {phases[currentPhase]}
          </motion.p>
        </AnimatePresence>

        {/* Progress Bar Container */}
        <div className="w-full max-w-md">
          <div className="bg-white border-4 border-black rounded-2xl p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative h-6 bg-gray-200 rounded-xl overflow-hidden">
              {/* Progress Bar */}
              <motion.div
                className="h-full bg-gradient-to-r from-festival-orange via-festival-pink to-festival-coral"
                style={{
                  width: `${progress}%`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Animated Sparkles on Progress Bar */}
              <motion.div
                className="absolute inset-0 flex items-center"
                style={{ left: `${Math.max(0, progress - 10)}%` }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Progress Percentage */}
          <motion.div
            className="text-center mt-4 text-2xl font-black text-black"
            style={{ fontFamily: "Righteous, display" }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            className="flex space-x-4"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {["🎨", "✨", "🚀", "💫", "🎪"].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-3xl"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                style={{
                  filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RetroPreloader;
