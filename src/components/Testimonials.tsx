import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface TestimonialData {
  id: string;
  name: string;
  handle: string;
  content: string;
  avatar: string;
  color: string;
}

const testimonialsData: TestimonialData[] = [
  {
    id: "1",
    name: "Sarah Chen",
    handle: "@sarahdesigns",
    content:
      "Working with design requests was absolutely incredible! They transformed our brand identity completely. The attention to detail and creative vision exceeded all our expectations. Can't wait for our next project!",
    avatar: "SC",
    color: "from-festival-orange to-festival-pink",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    handle: "@marcustech",
    content:
      "The UI/UX design for our mobile app is phenomenal. The team understood our vision perfectly and delivered something even better than we imagined. Professional, creative, and always on time!",
    avatar: "MR",
    color: "from-festival-pink to-festival-amber",
  },
  {
    id: "3",
    name: "Emily Watson",
    handle: "@emilycreative",
    content:
      "From concept to completion, the design process was seamless. The branding package we received was comprehensive and beautifully executed. Our customers love the new look!",
    avatar: "EW",
    color: "from-festival-yellow to-festival-coral",
  },
  {
    id: "4",
    name: "David Kim",
    handle: "@davidstartup",
    content:
      "Outstanding design work! The logo and brand guidelines they created perfectly capture our company's essence. The whole team was responsive and incorporated our feedback brilliantly.",
    avatar: "DK",
    color: "from-festival-coral to-festival-magenta",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    handle: "@lisabiz",
    content:
      "The website design they created for us is absolutely stunning. Clean, modern, and user-friendly. Our conversion rates have improved significantly since the launch. Highly recommended!",
    avatar: "LT",
    color: "from-festival-magenta to-festival-orange",
  },
];

const TestimonialCard: React.FC<{
  testimonial: TestimonialData;
  index: number;
}> = ({ testimonial, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotateX: -15,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          transition: {
            duration: 0.8,
            delay: index * 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      whileHover={{
        scale: 1.02,
        y: -10,
        rotateY: 5,
        transition: { duration: 0.3 },
      }}
      className="group"
    >
      <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden transform group-hover:-rotate-1">
        {/* Header with gradient background */}
        <div
          className={`p-6 border-b-4 border-black bg-gradient-to-r ${testimonial.color}`}
        >
          <div className="flex items-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-white border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-lg"
              whileHover={{
                rotate: 360,
                scale: 1.1,
                transition: { duration: 0.6 },
              }}
            >
              {testimonial.avatar}
            </motion.div>
            <div className="ml-6">
              <h4 className="font-black text-2xl text-white mb-1 drop-shadow-lg">
                {testimonial.name}
              </h4>
              <p className="text-white/90 font-bold text-lg drop-shadow">
                {testimonial.handle}
              </p>
            </div>
            <motion.div
              className="ml-auto"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-black">✨</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.p
            className="text-black text-xl leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 + 0.4, duration: 0.6 }}
          >
            "{testimonial.content}"
          </motion.p>

          {/* Rating stars */}
          <motion.div
            className="flex items-center mt-6 gap-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="text-festival-amber text-2xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.2 + 0.8 + i * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 180,
                  transition: { duration: 0.3 },
                }}
              >
                ⭐
              </motion.span>
            ))}
            <span className="ml-3 text-black/70 font-bold">5.0</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const FloatingShape: React.FC<{ className: string; delay?: number }> = ({
  className,
  delay = 0,
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const Testimonials: React.FC = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="relative py-20 bg-gradient-to-br from-festival-cream via-festival-beige to-festival-cream overflow-hidden">
      {/* Floating background elements */}
      <FloatingShape
        className="absolute top-20 left-20 w-16 h-16 bg-festival-orange/20 rounded-full"
        delay={0}
      />
      <FloatingShape
        className="absolute top-40 right-32 w-12 h-12 bg-festival-pink/20 rotate-45"
        delay={1}
      />
      <FloatingShape
        className="absolute bottom-40 left-1/4 w-20 h-20 bg-festival-yellow/20 rounded-xl"
        delay={2}
      />
      <FloatingShape
        className="absolute top-1/2 right-20 w-8 h-8 bg-festival-coral/20 rounded-full"
        delay={1.5}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isHeaderInView ? { scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <span className="text-6xl">💕</span>
          </motion.div>

          <motion.h2
            className="font-display font-black text-6xl md:text-8xl lg:text-9xl text-black mb-6 tracking-tight"
            initial={{ opacity: 0, rotateX: -90 }}
            animate={isHeaderInView ? { opacity: 1, rotateX: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Client{" "}
            <span className="bg-gradient-to-r from-festival-orange via-festival-pink to-festival-yellow bg-clip-text text-transparent">
              Love
            </span>
          </motion.h2>

          <motion.p
            className="text-2xl md:text-3xl text-black/80 font-bold max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Real stories from real clients who absolutely{" "}
            <span className="text-festival-magenta">adore</span> our work! 🎨
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="bg-gradient-to-r from-festival-orange to-festival-pink text-white font-black text-2xl px-12 py-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-rotate-1">
              Join Our Happy Clients! 🚀
            </button>
          </motion.div>

          <motion.p
            className="mt-6 text-xl text-black/70 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to create your own success story?
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
