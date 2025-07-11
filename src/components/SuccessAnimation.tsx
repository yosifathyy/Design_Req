import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Zap, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface SuccessAnimationProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  onComplete: () => void;
}

export const SuccessAnimation = ({
  isVisible,
  title = "Success!",
  description = "Your action completed successfully",
  onComplete,
}: SuccessAnimationProps) => {
  useEffect(() => {
    if (isVisible) {
      // Subtle confetti animation
      const duration = 1500;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 2;

        confetti({
          particleCount,
          startVelocity: 15,
          spread: 45,
          origin: {
            x: randomInRange(0.3, 0.7),
            y: randomInRange(0.4, 0.6),
          },
          colors: ["#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"],
        });
      }, 100);

      // Auto-close after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon with animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-display font-bold text-gray-900 mb-2"
            >
              {title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-6 leading-relaxed"
            >
              {description}
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3 mb-6"
            >
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Zap className="w-4 h-4 text-festival-orange" />
                <span>+10 XP earned</span>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4 text-festival-pink" />
                <span>Chat with our team now available</span>
              </div>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-gray-400"
            >
              Redirecting to dashboard...
            </motion.div>

            {/* Auto-close progress bar */}
            <motion.div
              className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-festival-pink to-festival-orange"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 2, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
