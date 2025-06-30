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

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const isLast = index === totalCards - 1;

    // Set initial position - all cards start at the bottom
    gsap.set(card, {
      y: index * 50, // Slight offset for visual depth
      scale: 1 - index * 0.02, // Slightly smaller for depth
      zIndex: totalCards - index,
      rotation: testimonial.rotation,
    });

    // Create the stacking animation
    ScrollTrigger.create({
      trigger: card.parentElement,
      start: "top bottom",
      end: isLast ? "bottom center" : "bottom top",
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;

        if (!isLast) {
          // Cards slide up and stack
          const yMovement = -progress * (window.innerHeight * 0.8);
          const scaleMovement = 1 - progress * 0.1;
          const rotationMovement = testimonial.rotation * (1 - progress * 0.5);

          gsap.set(card, {
            y: yMovement + index * 50,
            scale: scaleMovement,
            rotation: rotationMovement,
            zIndex: totalCards - index + Math.floor(progress * 10),
          });
        } else {
          // Last card stays in place as the deck
          gsap.set(card, {
            y: index * 50,
            scale: 1,
            rotation: 0,
            zIndex: totalCards + 10,
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === card.parentElement) {
          trigger.kill();
        }
      });
    };
  }, [testimonial.rotation, index, totalCards]);

  return (
    <div className="flex items-center justify-center sticky top-32 w-full h-screen">
      <div
        ref={cardRef}
        className="relative w-full max-w-3xl"
        style={{
          transformOrigin: "center center",
        }}
      >
        <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
          {/* Twitter-like header */}
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 12H16M12 8V16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-semibold">Reply</span>
                </button>
                <button className="flex items-center gap-2 hover:text-festival-orange transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 1L21 5L17 9M3 11V9C3 7.89543 3.89543 7 5 7H21M7 23L3 19L7 15M21 13V15C21 16.1046 20.1046 17 19 17H3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-semibold">Retweet</span>
                </button>
                <button className="flex items-center gap-2 hover:text-festival-magenta transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.99887 7.05 2.99887C5.59096 2.99887 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.54887 7.04097 1.54887 8.5C1.54887 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-semibold">Like</span>
                </button>
              </div>
              <span className="text-sm text-black/50 font-medium">
                2:15 PM · Dec 15, 2024 · Design Love
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="bg-festival-cream relative py-64">
      <div className="max-w-7xl mx-auto px-20">
        {/* Sticky Header */}
        <div className="sticky top-0 flex items-center justify-center pt-64 w-full">
          <div className="absolute">
            <motion.h2
              className="flex items-center gap-16 font-display font-black text-[15rem] leading-none"
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
          </div>

          {/* Header Image Container */}
          <motion.div
            className="bg-white border-4 border-black rounded-3xl shadow-lg overflow-hidden relative w-full max-w-3xl aspect-[3/2] transform rotate-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-festival-orange/20 via-festival-pink/20 to-festival-yellow/20"></div>
            <div className="absolute inset-8 border-2 border-black/20 rounded-2xl bg-white/80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-festival-orange to-festival-pink rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-black">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.99887 7.05 2.99887C5.59096 2.99887 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.54887 7.04097 1.54887 8.5C1.54887 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Client Love Stories
                </h3>
                <p className="text-lg text-black/70 font-medium">
                  See what our amazing clients say about our design work
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial Cards */}
        <div>
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;