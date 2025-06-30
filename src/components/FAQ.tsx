import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
  buttonText?: string;
  buttonLink?: string;
}

const faqData: FAQItem[] = [
  {
    question: "What types of design services do you offer?",
    answer:
      "We offer a comprehensive range of design services including web design, mobile app design, logo and branding, UI/UX design, print design, and 3D visualizations. Our expert designers work with businesses of all sizes to create stunning visual solutions that drive results.",
    buttonText: "Start Your Project",
    buttonLink: "/start-project",
  },
  {
    question: "How does the design request process work?",
    answer:
      "Our streamlined process is simple: Submit your design brief through our platform, get matched with expert designers, collaborate on revisions, and receive your final files. We provide unlimited revisions until you're 100% satisfied with the results.",
  },
  {
    question: "What's included in each design package?",
    answer:
      "Each package includes professional design consultation, multiple concept variations, unlimited revisions, high-resolution final files in various formats, and ongoing support. We also provide brand guidelines and style sheets for branding projects.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on complexity and scope. Simple designs like logos typically take 3-5 business days, while comprehensive branding packages or web designs can take 1-3 weeks. We always provide clear timelines upfront and keep you updated throughout the process.",
  },
  {
    question: "Can I request revisions and changes?",
    answer:
      "Absolutely! We believe in getting your design perfect. All our packages include unlimited revisions until you're completely satisfied. We work closely with you throughout the design process to ensure the final result exceeds your expectations and perfectly matches your vision.",
  },
  {
    question: "Do you offer ongoing design support?",
    answer:
      "Yes! We provide ongoing design support and maintenance packages for our clients. Whether you need regular updates, seasonal campaigns, or additional design assets, we're here to support your growing business with consistent, high-quality design work.",
  },
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section className="bg-black text-white py-16 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-festival-orange rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-festival-pink rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-festival-yellow rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Header Section */}
          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="lg:sticky lg:top-8">
              <motion.h2
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="block text-white">Frequently Asked</span>
                <motion.span
                  className="block bg-festival-orange text-black px-4 py-2 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block mt-2"
                  whileHover={{ rotate: -1, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Questions
                </motion.span>
              </motion.h2>

              {/* Decorative Image Placeholder */}
              <motion.div
                className="relative w-full max-w-md aspect-square rounded-3xl border-4 border-black shadow-lg overflow-hidden bg-gradient-to-br from-festival-cream to-festival-beige"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-festival-orange/20 to-festival-pink/20"></div>
                <div className="absolute inset-4 border-2 border-black/20 rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4 top-1/2 bg-white/80 rounded-xl border-2 border-black/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-festival-orange rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-black">
                      <span className="text-2xl font-bold text-black">?</span>
                    </div>
                    <p className="text-sm font-semibold text-black">
                      Got Questions?
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {faqData.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Background SVG Effect */}
                  <div className="absolute inset-0 opacity-80">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 400 200"
                      className="absolute inset-0"
                    >
                      <path
                        d="M390 190C390 194.4 386.4 198 382 198H18C13.6 198 10 194.4 10 190V18C10 13.6 13.6 10 18 10H60C61.7 10 63 11.3 63 13C63 14.7 64.3 16 66 16H382C386.4 16 390 19.6 390 24V190Z"
                        fill="hsl(var(--festival-cream))"
                        stroke="hsl(var(--festival-black))"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="relative bg-white/5 rounded-xl border-2 border-white/20 overflow-hidden backdrop-blur-sm">
                    {/* Question Header */}
                    <motion.button
                      className="w-full p-6 flex items-center justify-between bg-festival-amber text-black border-b-4 border-black hover:bg-festival-yellow transition-colors duration-200"
                      onClick={() => toggleItem(index)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <h3 className="text-lg md:text-xl font-bold text-left">
                        {item.question}
                      </h3>
                      <motion.div
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center ml-4"
                        animate={{ rotate: openItems.includes(index) ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Plus size={20} />
                      </motion.div>
                    </motion.button>

                    {/* Answer Content */}
                    <AnimatePresence>
                      {openItems.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            className="p-6 bg-white/95"
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <div className="bg-white rounded-xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 mb-6">
                              <p className="text-gray-800 text-base leading-relaxed mb-4">
                                {item.answer}
                              </p>

                              {item.buttonText && item.buttonLink && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <Button
                                    asChild
                                    className="bg-festival-pink hover:bg-festival-magenta text-white border-4 border-black rounded-full px-8 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-all duration-200"
                                  >
                                    <a
                                      href={item.buttonLink}
                                      className="cursor-pointer"
                                    >
                                      {item.buttonText}
                                    </a>
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
