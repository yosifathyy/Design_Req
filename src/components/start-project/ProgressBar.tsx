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
      {/* Retro Folder Tabs */}
      <div className="flex items-end justify-center gap-1 mb-6">
        {stepData.map((stepInfo, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          const isAccessible = step >= stepNum;
          const IconComponent = stepInfo.icon;

          return (
            <motion.div
              key={stepNum}
              className={`relative px-4 py-3 min-w-[120px] text-center transition-all duration-300 ${
                isActive
                  ? `bg-white border-3 border-retro-purple shadow-[4px_4px_0px_0px_hsl(var(--retro-purple))] z-10 -mb-1`
                  : isCompleted
                    ? `bg-retro-purple text-white border-3 border-retro-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]`
                    : isAccessible
                      ? `bg-retro-purple/10 border-3 border-retro-purple/30 text-retro-purple/60`
                      : `bg-gray-100 border-3 border-gray-300 text-gray-400`
              }`}
              style={{
                clipPath: isActive
                  ? "polygon(10px 0%, calc(100% - 10px) 0%, 100% 100%, 0% 100%)"
                  : "polygon(15px 0%, calc(100% - 15px) 0%, calc(100% - 5px) 100%, 5px 100%)",
              }}
              whileHover={isAccessible ? { scale: 1.02, y: -2 } : {}}
              animate={isActive ? { y: -4 } : { y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`p-1.5 rounded-lg ${isActive ? `bg-gradient-to-r ${stepInfo.color}` : ""} ${isActive ? "text-white" : ""}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs font-label font-medium ${isActive ? "text-retro-purple" : isCompleted ? "text-white" : ""}`}
                >
                  {stepInfo.label}
                </span>
              </div>

              {/* Tab shadow effect */}
              {isActive && (
                <div
                  className="absolute inset-0 -z-10 bg-retro-purple/20 transform translate-x-1 translate-y-1 rounded-t-lg"
                  style={{
                    clipPath:
                      "polygon(10px 0%, calc(100% - 10px) 0%, 100% 100%, 0% 100%)",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-retro-purple/20 rounded-full h-3 overflow-hidden border-3 border-retro-purple/30 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]">
        <motion.div
          className="bg-gradient-to-r from-retro-purple to-retro-teal h-3 rounded-full shadow-[inset_0px_1px_2px_rgba(255,255,255,0.3)]"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </FadeInUp>
  );
};
