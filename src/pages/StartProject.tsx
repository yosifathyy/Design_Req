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

import { useAuth } from "@/hooks/useAuth";
import { useProjectSubmission } from "@/hooks/useProjectSubmission";
import { toast } from "sonner";
import { EmailConfirmationReminder } from "@/components/EmailConfirmationReminder";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { supabase } from "@/integrations/supabase/client";

// Import existing step components
import { ProjectTypeStep } from "@/components/start-project/ProjectTypeStep";
import { ProjectDetailsStep } from "@/components/start-project/ProjectDetailsStep";
import { TimelineBudgetStep } from "@/components/start-project/TimelineBudgetStep";
import { AuthStep } from "@/components/start-project/AuthStep";
import { ProgressBar } from "@/components/start-project/ProgressBar";
import { NavigationButtons } from "@/components/start-project/NavigationButtons";
import { HelpSection } from "@/components/start-project/HelpSection";

const StartProject = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const { playClickSound } = useClickSound();
  const { user, loading: authLoading } = useAuth();
  const {
    submitProject,
    loading: submissionLoading,
    showSuccessAnimation,
    handleSuccessComplete,
  } = useProjectSubmission();

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
    // For step 4 (auth step), do nothing - auth step handles submission
    if (step === 4) {
      return;
    }

    // For other steps, this should not be called
    console.log("Submit called on non-auth step");
  };

  const handleAuthSuccess = async () => {
    console.log("Authentication successful, submitting project...");
    setAuthCompleted(true);

    // Validate form data
    if (!projectType || !formData.projectName || !formData.description) {
      console.log("Form validation failed");
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.timeline || !formData.budget) {
      console.log("Timeline/budget validation failed");
      toast.error("Please select timeline and budget preferences");
      return;
    }

    // Get current session
    const currentSession = await supabase.auth.getSession();
    const currentUser = currentSession.data.session?.user;
    const userId = user?.id || currentUser?.id;

    if (!userId) {
      console.log("No user ID available, cannot submit");
      toast.error("Authentication error. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting project submission...");
      await submitProject(
        {
          projectType,
          projectName: formData.projectName,
          description: formData.description,
          style: formData.style,
          timeline: formData.timeline,
          budget: formData.budget,
          files: formData.files,
        },
        userId,
      );

      console.log("Project submitted successfully");
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.details ||
        error?.hint ||
        (typeof error === "string"
          ? error
          : JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Submission error:", errorMessage);
      setIsSubmitting(false);
    }
  };

  const isStepValid = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return !!projectType;
      case 2:
        return !!(formData.projectName && formData.description);
      case 3:
        return !!(formData.timeline && formData.budget);
      case 4:
        return true; // Files are optional
      default:
        return false;
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
          <ProjectDetailsStep formData={formData} setFormData={setFormData} />
        );
      case 3:
        return (
          <TimelineBudgetStep
            formData={formData}
            setFormData={setFormData}
            projectType={projectType}
          />
        );
      case 4:
        return (
          <AuthStep
            onAuthSuccess={handleAuthSuccess}
            loading={submissionLoading || isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const isLoading = submissionLoading || isSubmitting || authLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30 relative overflow-hidden">
      {/* Email confirmation reminder */}
      <EmailConfirmationReminder />

      {/* Success animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        title="Project Submitted Successfully!"
        description="Your project has been created and you've earned 10 XP! You'll be connected to our team chat where you can discuss your project details."
        onComplete={handleSuccessComplete}
      />

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

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-retro-purple mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-retro-purple">
                      {authLoading
                        ? "Verifying authentication..."
                        : submissionLoading || isSubmitting
                          ? "Submitting your project..."
                          : "Loading..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <NavigationButtons
                step={step}
                totalSteps={4}
                loading={isLoading}
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
    </div>
  );
};

export default StartProject;
