import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialData {
  id: string;
  name: string;
  handle: string;
  content: string;
  avatar: string;
  rotation: number;
}

const testimonialsData: TestimonialData[] = [
  {
    id: "1",
    name: "Sarah Chen",
    handle: "@sarahdesigns",
    content:
      "Working with design requests was absolutely incredible! They transformed our brand identity completely. The attention to detail and creative vision exceeded all our expectations. Can't wait for our next project!",
    avatar: "SC",
    rotation: 2.5,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    handle: "@marcustech",
    content:
      "The UI/UX design for our mobile app is phenomenal. The team understood our vision perfectly and delivered something even better than we imagined. Professional, creative, and always on time!",
    avatar: "MR",
    rotation: 1.2,
  },
  {
    id: "3",
    name: "Emily Watson",
    handle: "@emilycreative",
    content:
      "From concept to completion, the design process was seamless. The branding package we received was comprehensive and beautifully executed. Our customers love the new look!",
    avatar: "EW",
    rotation: -1.8,
  },
  {
    id: "4",
    name: "David Kim",
    handle: "@davidstartup",
    content:
      "Outstanding design work! The logo and brand guidelines they created perfectly capture our company's essence. The whole team was responsive and incorporated our feedback brilliantly.",
    avatar: "DK",
    rotation: 2.1,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    handle: "@lisabiz",
    content:
      "The website design they created for us is absolutely stunning. Clean, modern, and user-friendly. Our conversion rates have improved significantly since the launch. Highly recommended!",
    avatar: "LT",
    rotation: -2.8,
  },
];

const TestimonialCard: React.FC<{
  testimonial: TestimonialData;
  index: number;
  totalCards: number;
}> = ({ testimonial, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !triggerRef.current) return;

    const card = cardRef.current;
    const trigger = triggerRef.current;

    // Set initial state
    gsap.set(card, {
      rotation: testimonial.rotation,
      zIndex: index + 1,
    });

    // Create pin animation for this card
    ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      end:
        index === totalCards - 1 ? "bottom bottom" : `+=${window.innerHeight}`,
      pin: card,
      pinSpacing: false,
      onEnter: () => {
        gsap.to(card, {
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });

    // Create stacking animation for next card
    if (index < totalCards - 1) {
      ScrollTrigger.create({
        trigger: trigger,
        start: "top top",
        end: `+=${window.innerHeight}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress > 0.2) {
            const stackProgress = gsap.utils.mapRange(0.2, 1, 0, 1, progress);

            // Find and animate the next card
            const nextCard = document.querySelector(
              `[data-card-index="${index + 1}"]`,
            ) as HTMLElement;
            if (nextCard) {
              const offset = (index + 1) * 6; // Small offset for stacking effect

              gsap.set(nextCard, {
                y: `${(1 - stackProgress) * 100}vh`,
                x: offset,
                y: offset * 0.5,
                rotation:
                  testimonialsData[index + 1].rotation * (1 - stackProgress),
                zIndex: (index + 1) * 10 + Math.floor(stackProgress * 10),
                scale: 0.98 + stackProgress * 0.02,
              });
            }

            // Push current card slightly back
            gsap.set(card, {
              scale: 1 - stackProgress * 0.02,
              opacity: 1 - stackProgress * 0.15,
              x: -offset * 0.3,
              y: -stackProgress * 8,
            });
          }
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === trigger || st.pin === card) {
          st.kill();
        }
      });
    };
  }, [testimonial.rotation, index, totalCards]);

  return (
    <div ref={triggerRef} className="w-full h-screen">
      <div
        ref={cardRef}
        data-card-index={index}
        className="w-full h-screen flex items-center justify-center p-4"
      >
        <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 overflow-hidden relative w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center p-6 border-b-2 border-black bg-gradient-to-r from-festival-cream to-festival-beige">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-festival-orange to-festival-pink border-2 border-black flex items-center justify-center text-white font-bold text-lg">
              {testimonial.avatar}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg text-black">
                  {testimonial.name}
                </h4>
                <div className="w-5 h-5 bg-festival-orange rounded-full border-2 border-black flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-black/70 font-medium">{testimonial.handle}</p>
            </div>
            <div className="text-festival-orange">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-festival-orange"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-black text-lg leading-relaxed font-medium">
              {testimonial.content}
            </p>
            <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-black/10">
              <div className="flex items-center gap-6 text-black/60">
                <button className="flex items-center gap-2 hover:text-festival-pink transition-colors">
                  <span className="font-semibold">Reply</span>
                </button>
                <button className="flex items-center gap-2 hover:text-festival-orange transition-colors">
                  <span className="font-semibold">Retweet</span>
                </button>
                <button className="flex items-center gap-2 hover:text-festival-magenta transition-colors">
                  <span className="font-semibold">Like</span>
                </button>
              </div>
              <span className="text-sm text-black/50 font-medium">
                2:15 PM · Dec 15, 2024
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialStacking: React.FC = () => {
  useEffect(() => {
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="bg-festival-cream">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <motion.h2
              className="flex items-center gap-8 font-display font-black text-[8rem] leading-none mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-black">Design</span>
              <motion.span
                className="bg-festival-amber text-white px-8 py-4 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block"
                whileHover={{ rotate: -1, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Love
              </motion.span>
            </motion.h2>
            <p className="text-xl text-black/70 font-medium">
              Scroll to see testimonials stack on each other
            </p>
          </div>
        </div>

        {/* Stacking Cards */}
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
            totalCards={testimonialsData.length}
          />
        ))}

        {/* Final section */}
        <div className="h-screen flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-6xl font-black text-black mb-4">
              Ready for your love story?
            </h3>
            <motion.button
              className="bg-festival-orange border-4 border-black text-white font-black px-8 py-4 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialStacking;
