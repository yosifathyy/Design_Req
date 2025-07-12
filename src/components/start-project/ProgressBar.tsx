import { motion } from "framer-motion";
import { CheckCircle, Palette, FileText, Clock, User } from "lucide-react";
import { FadeInUp } from "@/components/AnimatedElements";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const stepData = [
  {
    icon: Palette,
    label: "Project Type",
    color: "from-retro-purple to-retro-teal",
  },
  {
    icon: FileText,
    label: "Details",
    color: "from-retro-orange to-retro-peach",
  },
  { icon: Clock, label: "Timeline", color: "from-retro-teal to-retro-mint" },
  { icon: User, label: "Submit", color: "from-retro-pink to-retro-lavender" },
];

export const ProgressBar = ({ step, totalSteps }: ProgressBarProps) => {
  return (
    <FadeInUp delay={0.2} className="mb-8 md:mb-12">
      {/* Clean Step Indicators */}
      <div className="flex items-center justify-between mb-6 px-4">
        {stepData.map((stepInfo, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          const isAccessible = step >= stepNum;
          const IconComponent = stepInfo.icon;

          return (
            <div key={stepNum} className="flex flex-col items-center">
              <motion.div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${stepInfo.color} text-white shadow-lg scale-110`
                    : isCompleted
                      ? `bg-gradient-to-r ${stepInfo.color} text-white`
                      : isAccessible
                        ? `bg-gray-100 text-gray-400 border-2 border-gray-300`
                        : `bg-gray-50 text-gray-300`
                }`}
                whileHover={
                  isAccessible ? { scale: isActive ? 1.15 : 1.05 } : {}
                }
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </motion.div>

              <span
                className={`text-xs md:text-sm font-label font-medium text-center transition-colors duration-300 ${
                  isActive
                    ? "text-gray-800"
                    : isCompleted
                      ? "text-gray-600"
                      : "text-gray-400"
                }`}
              >
                {stepInfo.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Simplified Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </FadeInUp>
  );
};
