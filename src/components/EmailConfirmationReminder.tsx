
import { useState, useEffect } from "react";
import { X, Mail, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmailConfirmationReminder = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if email is confirmed
      const isEmailConfirmed = user.email_confirmed_at !== null;
      setIsConfirmed(isEmailConfirmed);
      
      // Show reminder if email is not confirmed and user hasn't dismissed it
      const dismissed = localStorage.getItem(`email-reminder-dismissed-${user.id}`);
      if (!isEmailConfirmed && !dismissed) {
        setIsVisible(true);
      }
    }
  }, [user]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (user) {
      localStorage.setItem(`email-reminder-dismissed-${user.id}`, 'true');
    }
  };

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      
      toast.success("Confirmation email sent! Check your inbox.");
    } catch (error: any) {
      toast.error("Failed to send confirmation email. Please try again.");
    }
  };

  if (!user || isConfirmed || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-amber-800">
                  Confirm your email
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Please check your email and click the confirmation link to secure your account.
                </p>
                <button
                  onClick={handleResendEmail}
                  className="text-sm text-amber-800 hover:text-amber-900 underline mt-2"
                >
                  Resend confirmation email
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-amber-500 hover:text-amber-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
