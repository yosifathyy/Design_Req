
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { FadeInUp } from "@/components/AnimatedElements";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export const ProgressBar = ({ step, totalSteps }: ProgressBarProps) => {
  return (
    <FadeInUp delay={0.2} className="mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-4 px-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => (
          <motion.div
            key={num}
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-sm transition-all duration-300 ${
              step >= num
                ? "bg-retro-purple text-white"
                : "bg-retro-purple/20 text-retro-purple/60"
            }`}
            whileHover={{ scale: 1.1 }}
            animate={step === num ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: step === num ? 2 : 0 }}
          >
            {step > num ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
            ) : (
              num
            )}
          </motion.div>
        ))}
      </div>
      <div className="w-full bg-retro-purple/20 rounded-full h-2 md:h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-retro-purple to-retro-teal h-2 md:h-3 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </FadeInUp>
  );
};
