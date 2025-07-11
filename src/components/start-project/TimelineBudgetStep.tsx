
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { BounceIn } from "@/components/AnimatedElements";
import { Clock, DollarSign } from "lucide-react";

interface FormData {
  timeline: string;
  budget: string;
  budgetAmount: number[];
}

interface TimelineBudgetStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

const timelineOptions = [
  {
    value: "rush",
    title: "Rush (24h) ⚡",
    description: "Need it yesterday? We got you!",
    emoji: "🚀",
  },
  {
    value: "standard",
    title: "Standard (3-5 days) 📅",
    description: "Perfect balance of speed & quality",
    emoji: "⭐",
  },
  {
    value: "flexible",
    title: "Flexible (1-2 weeks) 🌱",
    description: "No rush, take your time",
    emoji: "🌸",
  },
  {
    value: "large",
    title: "Large Project (2-4 weeks) 🏗️",
    description: "Complex masterpiece incoming",
    emoji: "🎨",
  },
];

const budgetOptions = [
  {
    value: "50-150",
    title: "$50 - $150 💫",
    description: "Perfect for basic magic",
    emoji: "✨",
  },
  {
    value: "150-300",
    title: "$150 - $300 🌟",
    description: "Standard wizardry level",
    emoji: "🎯",
  },
  {
    value: "300-500",
    title: "$300 - $500 🔥",
    description: "Premium spell casting",
    emoji: "💎",
  },
  {
    value: "500+",
    title: "$500+ 🚀",
    description: "Master-level sorcery",
    emoji: "👑",
  },
];

export const TimelineBudgetStep = ({ formData, setFormData }: TimelineBudgetStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BounceIn>
        <h2 className="font-display text-2xl md:text-3xl text-retro-purple mb-3 text-center">
          Timeline & Budget Magic! ⏰💰
        </h2>
        <p className="text-retro-purple/80 text-center mb-6 md:mb-8 px-4">
          Help us understand your project constraints so we can work
          our magic perfectly
        </p>
      </BounceIn>

      <div className="space-y-8 md:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label className="text-retro-purple font-bold text-lg md:text-xl mb-4 md:mb-6 block flex items-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            When do you need this completed? 🏃‍♂️
          </Label>
          <RadioGroup
            value={formData.timeline}
            onValueChange={(value) =>
              setFormData({ ...formData, timeline: value })
            }
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
          >
            {timelineOptions.map((option, index) => (
              <motion.div
                key={option.value}
                className="flex items-center space-x-3 p-4 md:p-6 border-3 border-retro-purple/30 rounded-2xl hover:border-retro-purple/60 transition-all duration-300 hover:shadow-lg cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                />
                <div className="text-2xl md:text-3xl">{option.emoji}</div>
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-bold text-retro-purple text-base md:text-lg">
                    {option.title}
                  </div>
                  <div className="text-sm md:text-base text-retro-purple/70">
                    {option.description}
                  </div>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="text-retro-purple font-bold text-lg md:text-xl mb-4 md:mb-6 block flex items-center">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            What's your budget range? 💸
          </Label>
          
          {/* Budget Slider */}
          <div className="mb-6 p-4 md:p-6 border-3 border-retro-purple/30 rounded-2xl bg-retro-purple/5">
            <div className="mb-4">
              <Label className="text-retro-purple font-medium text-base md:text-lg">
                Custom Budget: ${formData.budgetAmount[0]}
              </Label>
            </div>
            <Slider
              value={formData.budgetAmount}
              onValueChange={(value) => setFormData({ ...formData, budgetAmount: value })}
              max={2000}
              min={50}
              step={25}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-sm text-retro-purple/60">
              <span>$50</span>
              <span>$2000+</span>
            </div>
          </div>

          <RadioGroup
            value={formData.budget}
            onValueChange={(value) =>
              setFormData({ ...formData, budget: value })
            }
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
          >
            {budgetOptions.map((option, index) => (
              <motion.div
                key={option.value}
                className="flex items-center space-x-3 p-4 md:p-6 border-3 border-retro-purple/30 rounded-2xl hover:border-retro-purple/60 transition-all duration-300 hover:shadow-lg cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                />
                <div className="text-2xl md:text-3xl">{option.emoji}</div>
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-bold text-retro-purple text-base md:text-lg">
                    {option.title}
                  </div>
                  <div className="text-sm md:text-base text-retro-purple/70">
                    {option.description}
                  </div>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </motion.div>
      </div>
    </motion.div>
  );
};
