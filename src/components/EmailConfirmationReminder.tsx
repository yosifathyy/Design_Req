import { useState, useEffect } from "react";
import { X, Mail, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmailConfirmationReminder = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Show reminder if user exists but email is not confirmed
    if (user && !user.email_confirmed_at) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user]);

  const handleResendConfirmation = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });

      if (error) {
        toast.error("Failed to resend confirmation email");
      } else {
        toast.success("Confirmation email sent! Check your inbox.");
      }
    } catch (error) {
      toast.error("Failed to resend confirmation email");
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-gradient-to-r from-festival-yellow/90 to-festival-orange/90 backdrop-blur-sm border border-festival-orange/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Mail className="w-5 h-5 text-festival-black mt-0.5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-festival-black">
                  Confirm your email address
                </p>
                <p className="text-xs text-festival-black/80 mt-1">
                  We sent a verification link to{" "}
                  <span className="font-medium">{user?.email}</span>
                </p>

                <div className="flex items-center space-x-3 mt-2">
                  <button
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                    className="text-xs font-medium text-festival-black underline hover:no-underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend email"}
                  </button>

                  <div className="flex items-center text-xs text-festival-black/60">
                    <Check className="w-3 h-3 mr-1" />
                    You can still use the app
                  </div>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 hover:bg-festival-black/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-festival-black" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
