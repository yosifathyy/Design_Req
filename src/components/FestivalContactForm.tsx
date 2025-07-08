import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the form schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

// Type for our form data
type ContactFormData = z.infer<typeof contactFormSchema>;

// Type for scrap state
type ScrapState = {
  name: boolean;
  email: boolean;
  message: boolean;
};

const FestivalContactForm: React.FC = () => {
  // State for torn paper effect
  const [tornScraps, setTornScraps] = React.useState({
    name: false,
    email: false,
    message: false,
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Initialize react-hook-form with zod validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const handleScrapClick = (field: keyof ScrapState) => {
    setTornScraps((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    <div className="max-w-2xl mx-auto pt-0 px-4 pb-1">
      <motion.h2
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-center uppercase tracking-wide mb-8 sm:mb-12 mt-[-112px]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          color: "rgba(18, 18, 17, 1)",
          textShadow: "4px 4px 0px hsl(var(--festival-orange))",
          letterSpacing: "1.2px",
        }}
      >
        <span style={{ color: "rgb(254, 130, 100)", letterSpacing: "1.2px" }}>
          Get in Touch
        </span>
      </motion.h2>

      <p
        className="text-lg lg:text-xl max-w-2xl self-start mx-auto mt-[-43px] mb-8"
        style={{
          color: "rgb(12, 11, 12)",
          fontFamily: "ADLaM Display, display",
          fontSize: "25px",
          lineHeight: "36px",
        }}
      >
        Have questions about our services? Need help with your project? We're
        here to help make magic happen!
      </p>

      <form
        ref={formRef} 
        onSubmit={handleSubmit(onSubmit)}
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
                  {...register("name")}
                  className={`w-full p-4 border-4 border-festival-black bg-festival-cream font-bold text-lg text-festival-black rounded-2xl shadow-[4px_4px_0px_0px] shadow-festival-black focus:outline-none focus:shadow-[6px_6px_0px_0px] focus:shadow-festival-orange transition-all ${
                    errors.name === undefined && tornScraps.name
                      ? "bg-festival-yellow"
                      : errors.name
                        ? "bg-festival-coral"
                        : ""
                  }`}
                  placeholder="Your magical name..."
                />
                {errors.name && (
                  <motion.p
                    className="text-festival-magenta font-bold text-sm mt-2 uppercase tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    ⚡ {errors.name.message}
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
                  {...register("email")}
                  className={`w-full p-4 border-4 border-festival-black bg-festival-cream font-bold text-lg text-festival-black rounded-2xl shadow-[4px_4px_0px_0px] shadow-festival-black focus:outline-none focus:shadow-[6px_6px_0px_0px] focus:shadow-festival-orange transition-all ${
                    errors.email === undefined && tornScraps.email
                      ? "bg-festival-yellow"
                      : errors.email
                        ? "bg-festival-coral"
                        : ""
                  }`}
                  placeholder="your@awesome-email.com"
                />
                {errors.email && (
                  <motion.p
                    className="text-festival-magenta font-bold text-sm mt-2 uppercase tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    ⚡ {errors.email.message}
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
                  {...register("message")}
                  className={`w-full p-4 border-4 border-festival-black bg-festival-cream font-bold text-lg text-festival-black rounded-2xl shadow-[4px_4px_0px_0px] shadow-festival-black focus:outline-none focus:shadow-[6px_6px_0px_0px] focus:shadow-festival-orange transition-all resize-none min-h-[140px] ${
                    errors.message === undefined && tornScraps.message
                      ? "bg-festival-yellow"
                      : errors.message
                        ? "bg-festival-coral"
                        : ""
                  }`}
                  placeholder="Share your creative vision, project ideas, questions, or just say hi! We love hearing from amazing people like you..."
                  rows={6}
                />
                {errors.message && (
                  <motion.p
                    className="text-festival-magenta font-bold text-sm mt-2 uppercase tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    ⚡ {errors.message.message}
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
            className={`text-festival-black font-display font-black text-xl sm:text-2xl uppercase tracking-wider px-8 py-4 sm:px-12 sm:py-6 border-4 border-festival-black rounded-2xl shadow-[6px_6px_0px_0px] shadow-festival-black transform -rotate-1 transition-all duration-300 bg-cover bg-center bg-no-repeat ${
              isSubmitting
                ? "opacity-75 cursor-not-allowed"
                : "hover:-rotate-2 hover:scale-105 hover:shadow-[8px_8px_0px_0px] hover:shadow-festival-orange active:rotate-0 active:scale-95 active:shadow-[4px_4px_0px_0px]"
            }`}
            style={{
              backgroundImage:
                "url(https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F9b311ff328f04653a2de85d9cc8ebda6)",
            }}
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
