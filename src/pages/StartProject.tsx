
import { useState } from "react";
import { useClickSound } from "@/hooks/use-click-sound";
import Navigation from "@/components/Navigation";
import {
  BounceIn,
  WiggleIcon,
  TiltCard,
  FloatingElement,
} from "@/components/AnimatedElements";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useProjectSubmission } from "@/hooks/useProjectSubmission";
import { toast } from "sonner";

// Import new components
import { ProjectTypeStep } from "@/components/start-project/ProjectTypeStep";
import { ProjectDetailsStep } from "@/components/start-project/ProjectDetailsStep";
import { TimelineBudgetStep } from "@/components/start-project/TimelineBudgetStep";
import { FileUploadStep } from "@/components/start-project/FileUploadStep";
import { ProgressBar } from "@/components/start-project/ProgressBar";
import { NavigationButtons } from "@/components/start-project/NavigationButtons";
import { HelpSection } from "@/components/start-project/HelpSection";

const StartProject = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { playClickSound } = useClickSound();
  const { user } = useAuth();
  const { submitProject, loading } = useProjectSubmission();
  
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    style: "",
    timeline: "",
    budget: "",
    budgetAmount: [500],
    files: [] as File[],
  });

  const handleFileUpload = (files: File[]) => {
    setFormData({ ...formData, files });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!projectType || !formData.projectName || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await submitProject({
        projectType,
        projectName: formData.projectName,
        description: formData.description,
        style: formData.style,
        timeline: formData.timeline,
        budget: formData.budget,
        files: formData.files,
      }, user.id);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Retry submission after authentication
    setTimeout(() => {
      handleSubmit();
    }, 500);
  };

  const isStepValid = (stepNum: number) => {
    switch (stepNum) {
      case 1: return !!projectType;
      case 2: return !!(formData.projectName && formData.description && formData.style);
      case 3: return !!(formData.timeline && formData.budget);
      case 4: return true; // Files are optional
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ProjectTypeStep
            projectType={projectType}
            setProjectType={setProjectType}
            playClickSound={playClickSound}
            playHoverSound={() => {}}
          />
        );
      case 2:
        return (
          <ProjectDetailsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <TimelineBudgetStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <FileUploadStep
            files={formData.files}
            onFilesChange={handleFileUpload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30 relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-retro-pink/20 rounded-full blur-xl" />
      <FloatingElement className="absolute top-40 right-20 w-16 h-16 bg-retro-teal/30 rounded-full blur-lg" />
      <FloatingElement className="absolute bottom-20 left-1/4 w-12 h-12 bg-retro-orange/20 rounded-full blur-md" />

      <Navigation />

      <div className="px-4 md:px-6 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <BounceIn className="text-center mb-8 md:mb-12">
            <motion.div
              className="inline-flex items-center space-x-2 bg-retro-purple/10 px-4 py-2 rounded-full mb-4 md:mb-6"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <WiggleIcon>
                <Zap className="w-4 h-4 text-retro-purple" />
              </WiggleIcon>
              <span className="text-sm font-medium text-retro-purple">
                AI-Powered Brief Generator
              </span>
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-retro-purple mb-4">
              Start Your Design Project
            </h1>
            <p className="text-lg md:text-xl text-retro-purple/80 max-w-2xl mx-auto px-4">
              Our intelligent system will help you create the perfect project
              brief for our expert designers! ✨
            </p>
          </BounceIn>

          {/* Progress Bar */}
          <ProgressBar step={step} totalSteps={4} />

          {/* Step Content */}
          <TiltCard className="border-3 border-retro-purple/30 bg-white/60 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-6 md:p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <NavigationButtons
                step={step}
                totalSteps={4}
                loading={loading}
                isStepValid={isStepValid}
                onPrevious={prevStep}
                onNext={nextStep}
                onSubmit={handleSubmit}
              />
            </div>
          </TiltCard>

          {/* Help Section */}
          <HelpSection />
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default StartProject;
