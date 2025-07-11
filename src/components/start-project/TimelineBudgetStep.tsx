import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { BounceIn } from "@/components/AnimatedElements";
import { Clock, DollarSign } from "lucide-react";

interface FormData {
  projectName: string;
  description: string;
  style: string;
  timeline: string;
  budget: string;
  budgetAmount: number[];
  files: File[];
}

interface TimelineBudgetStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  projectType: string;
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

// Define budget configuration for each project type
const budgetConfig = {
  photoshop: { min: 10, max: 300 },
  "3d": { min: 20, max: 1000 },
  design: { min: 20, max: 1000 }, // Graphic requests same as 3D
  website: { min: 50, max: 2000 },
};

// Generate 6 dynamic budget ranges based on min-max values
const generateBudgetOptions = (min: number, max: number) => {
  const range = max - min;
  const increment = range / 6;
  const emojis = ["✨", "🎯", "💫", "🔥", "💎", "👑"];
  const descriptions = [
    "Basic magic",
    "Standard level",
    "Enhanced quality",
    "Premium work",
    "Elite craftsmanship",
    "Master-level sorcery",
  ];

  const options = [];
  for (let i = 0; i < 6; i++) {
    const rangeMin = Math.round(min + increment * i);
    const rangeMax = i === 5 ? max : Math.round(min + increment * (i + 1));

    options.push({
      value: i === 5 ? `${rangeMin}+` : `${rangeMin}-${rangeMax}`,
      title:
        i === 5
          ? `$${rangeMin}+ ${emojis[i]}`
          : `$${rangeMin} - $${rangeMax} ${emojis[i]}`,
      description: descriptions[i],
      emoji: emojis[i],
      min: rangeMin,
      max: rangeMax,
    });
  }
  return options;
};

// Helper function to get budget range for a given amount
const getBudgetRangeForAmount = (amount: number, options: any[]) => {
  for (const option of options) {
    if (amount >= option.min && (option.max === null || amount <= option.max)) {
      return option.value;
    }
  }
  return options[options.length - 1].value; // Default to highest range
};

export const TimelineBudgetStep = ({
  formData,
  setFormData,
  projectType,
}: TimelineBudgetStepProps) => {
  // Get budget configuration for current project type
  const currentBudgetConfig =
    budgetConfig[projectType as keyof typeof budgetConfig] ||
    budgetConfig.website;
  const budgetOptions = generateBudgetOptions(
    currentBudgetConfig.min,
    currentBudgetConfig.max,
  );

  // Handle timeline option clicks
  const handleTimelineOptionClick = (value: string) => {
    setFormData({ ...formData, timeline: value });
  };

  // Handle budget option clicks
  const handleBudgetOptionClick = (value: string) => {
    setFormData({ ...formData, budget: value });
  };

  // Handle slider changes with automatic range selection
  const handleSliderChange = (value: number[]) => {
    const newAmount = value[0];
    const matchingRange = getBudgetRangeForAmount(newAmount, budgetOptions);
    setFormData({
      ...formData,
      budgetAmount: value,
      budget: matchingRange,
    });
  };
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
          Help us understand your project constraints so we can work our magic
          perfectly
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
                className={`flex items-center space-x-3 p-4 md:p-6 border-3 rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  formData.timeline === option.value
                    ? "border-retro-purple bg-retro-purple/10 shadow-lg"
                    : "border-retro-purple/30 hover:border-retro-purple/60"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTimelineOptionClick(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="text-2xl md:text-3xl">{option.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-retro-purple text-base md:text-lg">
                    {option.title}
                  </div>
                  <div className="text-sm md:text-base text-retro-purple/70">
                    {option.description}
                  </div>
                </div>
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

          {/* Dynamic Budget Slider */}
          <div className="mb-6 p-4 md:p-6 border-3 border-retro-purple/30 rounded-2xl bg-retro-purple/5">
            <div className="mb-4">
              <Label className="text-retro-purple font-medium text-base md:text-lg">
                Custom Budget: ${formData.budgetAmount[0]}
              </Label>
              <p className="text-sm text-retro-purple/60 mt-1">
                {projectType === "photoshop" &&
                  "Photoshop requests: $10 - $300"}
                {(projectType === "3d" || projectType === "design") &&
                  "3D & Graphic requests: $20 - $1000"}
                {projectType === "website" && "Website requests: $50 - $2000"}
              </p>
            </div>
            <Slider
              value={formData.budgetAmount}
              onValueChange={handleSliderChange}
              max={currentBudgetConfig.max}
              min={currentBudgetConfig.min}
              step={10}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-sm text-retro-purple/60">
              <span>${currentBudgetConfig.min}</span>
              <span>${currentBudgetConfig.max}+</span>
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
                className={`flex items-center space-x-3 p-4 md:p-6 border-3 rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  formData.budget === option.value
                    ? "border-retro-purple bg-retro-purple/10 shadow-lg"
                    : "border-retro-purple/30 hover:border-retro-purple/60"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBudgetOptionClick(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="text-2xl md:text-3xl">{option.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-retro-purple text-base md:text-lg">
                    {option.title}
                  </div>
                  <div className="text-sm md:text-base text-retro-purple/70">
                    {option.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </RadioGroup>
        </motion.div>
      </div>
    </motion.div>
  );
};
