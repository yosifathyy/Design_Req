import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Rocket, CheckCircle } from "lucide-react";
import { WiggleIcon } from "@/components/AnimatedElements";

interface NavigationButtonsProps {
  step: number;
  totalSteps: number;
  loading: boolean;
  isStepValid: (step: number) => boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const NavigationButtons = ({
  step,
  totalSteps,
  loading,
  isStepValid,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationButtonsProps) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t-2 border-retro-purple/20 gap-4 md:gap-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full md:w-auto"
      >
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={step === 1}
          className="w-full md:w-auto border-2 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-6 py-3 rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
      </motion.div>

      {step < totalSteps ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto"
        >
          <Button
            onClick={onNext}
            disabled={!isStepValid(step)}
            className="w-full md:w-auto bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto"
        >
          <Button
            onClick={onSubmit}
            disabled={loading || !isStepValid(step)}
            className="w-full md:w-auto bg-gradient-to-r from-retro-purple to-retro-teal text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg animate-pulse-glow"
          >
            <WiggleIcon>
              <Rocket className="w-5 h-5 mr-2" />
            </WiggleIcon>
            {loading ? "Submitting..." : "Submit Project"}
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
