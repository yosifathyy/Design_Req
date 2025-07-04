import React, { useState, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Star } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface ScrapState {
  name: boolean;
  email: boolean;
  message: boolean;
}

interface ValidationState {
  name: boolean | null;
  email: boolean | null;
  message: boolean | null;
}

const FestivalContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [tornScraps, setTornScraps] = useState<ScrapState>({
    name: false,
    email: false,
    message: false,
  });

  const [validation, setValidation] = useState<ValidationState>({
    name: null,
    email: null,
    message: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (field: keyof FormState, value: string): boolean => {
    switch (field) {
      case "name":
        return value.trim().length >= 2;
      case "email":
        return validateEmail(value.trim());
      case "message":
        return value.trim().length >= 10;
      default:
        return false;
    }
  };

  const handleScrapClick = (field: keyof ScrapState) => {
    setTornScraps((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputBlur = (field: keyof FormState) => {
    const value = formData[field];
    const isValid = validateField(field, value);
    setValidation((prev) => ({
      ...prev,
      [field]: isValid,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameValid = validateField("name", formData.name);
    const emailValid = validateField("email", formData.email);
    const messageValid = validateField("message", formData.message);

    setValidation({
      name: nameValid,
      email: emailValid,
      message: messageValid,
    });

    if (!nameValid || !emailValid || !messageValid) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        className="min-h-[60vh] flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-gradient-to-br from-festival-yellow to-festival-orange p-8 sm:p-12 rounded-3xl border-4 border-festival-black shadow-[8px_8px_0px_0px] shadow-festival-black text-center max-w-md"
          animate={{
            rotate: [-2, 2, -2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mb-4"
          >
            <Sparkles className="w-16 h-16 text-festival-black mx-auto" />
          </motion.div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-festival-black mb-4 uppercase tracking-wide">
            Thank You! ✨
          </h2>
          <p className="text-festival-black font-bold text-lg">
            Your message has been sent! We'll get back to you soon! 🎉
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.h2
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-center text-festival-pink mb-8 sm:mb-12 uppercase tracking-wide"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textShadow: "4px 4px 0px hsl(var(--festival-orange))",
        }}
      >
        Let's Create Magic! 🎨
      </motion.h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6 sm:space-y-8"
      >
        {/* Name Scrap */}
        <motion.div className="relative min-h-[80px]" layout>
          <AnimatePresence mode="wait">
            {!tornScraps.name ? (
              <motion.div
                key="name-scrap"
                className="bg-gradient-to-br from-festival-coral to-festival-pink p-6 border-4 border-festival-black rounded-2xl cursor-pointer relative overflow-hidden shadow-[6px_6px_0px_0px] shadow-festival-black transform rotate-1 transition-all duration-300 hover:rotate-2 hover:scale-105 hover:shadow-[8px_8px_0px_0px] hover:shadow-festival-black"
                onClick={() => handleScrapClick("name")}
                whileHover={{
                  rotate: 2,
                  scale: 1.05,
                }}
                whileTap={{
                  rotate: 0,
                  scale: 0.95,
                  y: 20,
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  rotate: 45,
                  scale: 0.8,
                  transition: { duration: 0.3 },
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-festival-coral to-festival-pink opacity-80"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 10% 100%, 20% 0%, 30% 100%, 40% 0%, 50% 100%, 60% 0%, 70% 100%, 80% 0%, 90% 100%, 100% 0%)",
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl sm:text-2xl font-black text-festival-black uppercase tracking-wider">
                    Your Name ✨
                  </span>
                  <Heart className="w-6 h-6 text-festival-black" />
                </div>
                <p className="text-festival-black/80 font-bold text-sm mt-2">
                  Click to reveal the magic input!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="name-input"
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <label
                  htmlFor="name"
                  className="block font-bold text-festival-pink text-lg mb-3"
                >
                  Your Awesome Name ✨
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleInputBlur("name")}
                  className={`w-full p-4 border-4 border-festival-black bg-festival-cream font-bold text-lg text-festival-black rounded-2xl shadow-[4px_4px_0px_0px] shadow-festival-black focus:outline-none focus:shadow-[6px_6px_0px_0px] focus:shadow-festival-orange transition-all ${
                    validation.name === true
                      ? "bg-festival-yellow"
                      : validation.name === false
                        ? "bg-festival-coral"
                        : ""
                  }`}
                  placeholder="Your magical name..."
                  required
                />
                {validation.name === false && (
                  <motion.p
                    className="text-festival-magenta font-bold text-sm mt-2 uppercase tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    ⚡ Name must be at least 2 characters
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Email Scrap */}
        <motion.div className="relative min-h-[80px]" layout>
          <AnimatePresence mode="wait">
            {!tornScraps.email ? (
              <motion.div
                key="email-scrap"
                className="bg-gradient-to-br from-festival-yellow to-festival-amber p-6 border-4 border-festival-black rounded-2xl cursor-pointer relative overflow-hidden shadow-[6px_6px_0px_0px] shadow-festival-black transform -rotate-2 transition-all duration-300 hover:-rotate-3 hover:scale-105 hover:shadow-[8px_8px_0px_0px] hover:shadow-festival-black"
                onClick={() => handleScrapClick("email")}
                whileHover={{
                  rotate: -3,
                  scale: 1.05,
                }}
                whileTap={{
                  rotate: 0,
                  scale: 0.95,
                  y: 20,
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  rotate: -45,
                  scale: 0.8,
                  transition: { duration: 0.3 },
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-festival-yellow to-festival-amber opacity-80"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 15% 100%, 25% 0%, 35% 100%, 45% 0%, 55% 100%, 65% 0%, 75% 100%, 85% 0%, 95% 100%, 100% 0%)",
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl sm:text-2xl font-black text-festival-black uppercase tracking-wider">
                    Email Address 📧
                  </span>
                  <Star className="w-6 h-6 text-festival-black" />
                </div>
                <p className="text-festival-black/80 font-bold text-sm mt-2">
                  Tear away to reveal your email field!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="email-input"
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <label
                  htmlFor="email"
                  className="block font-bold text-festival-orange text-lg mb-3"
                >
                  Your Magic Email 📧
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleInputBlur("email")}
                  className={`w-full p-4 border-4 border-festival-black bg-festival-cream font-bold text-lg text-festival-black rounded-2xl shadow-[4px_4px_0px_0px] shadow-festival-black focus:outline-none focus:shadow-[6px_6px_0px_0px] focus:shadow-festival-orange transition-all ${
                    validation.email === true
                      ? "bg-festival-yellow"
                      : validation.email === false
                        ? "bg-festival-coral"
                        : ""
                  }`}
                  placeholder="your@awesome-email.com"
                  required
                />
                {validation.email === false && (
                  <motion.p
                    className="text-festival-magenta font-bold text-sm mt-2 uppercase tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    ⚡ Please enter a valid email address
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Message Scrap */}
        <motion.div className="relative min-h-[80px]" layout>
          <AnimatePresence mode="wait">
            {!tornScraps.message ? (
              <motion.div
                key="message-scrap"
                className="bg-gradient-to-br from-festival-orange to-festival-coral p-6 border-4 border-festival-black rounded-2xl cursor-pointer relative overflow-hidden shadow-[6px_6px_0px_0px] shadow-festival-black transform rotate-1 transition-all duration-300 hover:rotate-2 hover:scale-105 hover:shadow-[8px_8px_0px_0px] hover:shadow-festival-black"
                onClick={() => handleScrapClick("message")}
                whileHover={{
                  rotate: 2,
                  scale: 1.05,
                }}
                whileTap={{
                  rotate: 0,
                  scale: 0.95,
                  y: 20,
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  rotate: 45,
                  scale: 0.8,
                  transition: { duration: 0.3 },
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-festival-orange to-festival-coral opacity-80"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 8% 100%, 16% 0%, 24% 100%, 32% 0%, 40% 100%, 48% 0%, 56% 100%, 64% 0%, 72% 100%, 80% 0%, 88% 100%, 96% 0%, 100% 100%)",
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl sm:text-2xl font-black text-festival-black uppercase tracking-wider">
                    Your Message 💭
                  </span>
                  <Sparkles className="w-6 h-6 text-festival-black" />
                </div>
                <p className="text-festival-black/80 font-bold text-sm mt-2">
                  Rip this open to share your amazing ideas!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="message-input"
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <label
                  htmlFor="message"
                  className="block font-bold text-festival-coral text-lg mb-3"
                >
                  Tell us your amazing ideas! 💭
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  onBlur={() => handleInputBlur("message")}
                  className={`w-full p-4 border-4 border-festival-black bg-festival-cream font-bold text-lg text-festival-black rounded-2xl shadow-[4px_4px_0px_0px] shadow-festival-black focus:outline-none focus:shadow-[6px_6px_0px_0px] focus:shadow-festival-orange transition-all resize-none min-h-[140px] ${
                    validation.message === true
                      ? "bg-festival-yellow"
                      : validation.message === false
                        ? "bg-festival-coral"
                        : ""
                  }`}
                  placeholder="Share your creative vision, project ideas, questions, or just say hi! We love hearing from amazing people like you..."
                  required
                  rows={6}
                />
                {validation.message === false && (
                  <motion.p
                    className="text-festival-magenta font-bold text-sm mt-2 uppercase tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    ⚡ Message must be at least 10 characters
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r from-festival-magenta to-festival-pink text-festival-black font-display font-black text-xl sm:text-2xl uppercase tracking-wider px-8 py-4 sm:px-12 sm:py-6 border-4 border-festival-black rounded-2xl shadow-[6px_6px_0px_0px] shadow-festival-black transform -rotate-1 transition-all duration-300 ${
              isSubmitting
                ? "opacity-75 cursor-not-allowed bg-gradient-to-r from-festival-orange to-festival-coral"
                : "hover:-rotate-2 hover:scale-105 hover:shadow-[8px_8px_0px_0px] hover:shadow-festival-orange active:rotate-0 active:scale-95 active:shadow-[4px_4px_0px_0px]"
            }`}
            whileHover={
              !isSubmitting
                ? {
                    rotate: -2,
                    scale: 1.05,
                  }
                : {}
            }
            whileTap={
              !isSubmitting
                ? {
                    rotate: 0,
                    scale: 0.95,
                  }
                : {}
            }
          >
            <div className="flex items-center justify-center space-x-3">
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                  <span>Sending Magic...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  <span>Send Message!</span>
                  <Sparkles className="w-6 h-6" />
                </>
              )}
            </div>
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default FestivalContactForm;
