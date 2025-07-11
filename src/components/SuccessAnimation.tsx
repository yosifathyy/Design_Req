
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

interface SuccessAnimationProps {
  isVisible: boolean;
  title: string;
  description: string;
  onComplete?: () => void;
}

export const SuccessAnimation = ({ 
  isVisible, 
  title, 
  description, 
  onComplete 
}: SuccessAnimationProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative"
        >
          <CheckCircle className="w-8 h-8 text-green-600" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          {description}
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onComplete}
          className="bg-retro-purple text-white px-6 py-2 rounded-lg hover:bg-retro-purple/90 transition-colors"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
