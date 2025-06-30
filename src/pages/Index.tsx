import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import { RevealImageList } from "@/components/ui/reveal-images";
import Navigation from "@/components/Navigation";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import {
  BentoGrid,
  BentoCard,
  StatBentoCard,
  FeatureBentoCard,
  HeroBentoCard,
} from "@/components/BentoCards";
import RetroCards from "@/components/RetroCards";
import RetroHowItWorks from "@/components/RetroHowItWorks";
import {
  FadeInUp,
  BounceIn,
  SlideRotate,
  JumpIn,
  WiggleIcon,
  TiltCard,
  FloatingElement,
  StaggerContainer,
  StaggerChild,
} from "@/components/AnimatedElements";
import {
  GSAPFadeIn,
  GSAPSlideIn,
  GSAPBounceIn,
  GSAPScaleIn,
  GSAPFlipIn,
  GSAPStagger,
  GSAPHover,
  GSAPFloating,
  GSAPTypewriter,
  GSAPParallax,
  GSAPMagneticButton,
  GSAPRevealText,
} from "@/components/GSAPAnimatedElements";
import GSAPInteractiveBackground from "@/components/GSAPInteractiveBackground";
import HeroSectionNew from "@/components/HeroSectionNew";
import {
  Sparkles,
  Palette,
  Layers,
  Upload,
  MessageCircle,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Award,
  ArrowRight,
  Play,
  Target,
  Rocket,
  Heart,
  Globe,
  TrendingUp,
  Camera,
  Brush,
  Wand2,
  Eye,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Send,
  Award as Trophy,
  Lightbulb,
  Smile,
  Coffee,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  // State for image shuffle
  const [imageOrder, setImageOrder] = useState([0, 1, 2, 3]);
  const [isShuffling, setIsShuffling] = useState(false);

  const images = [
    "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aaddd793e76751328121_event-image-1.avif",
    "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aaddd92bb1ada35b5840_event-image-2.avif",
    "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aadd1a93d98874d5b679_event-image-3.avif",
    "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aaddb9d81bad24595e36_event-image-4.avif",
  ];

  // Custom hooks for smooth scrolling effects
  const useSpeedControl = (speed: number) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;

      const element = ref.current;

      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const yPos = progress * speed * 100 - 50;
          gsap.set(element, { y: yPos });
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, [speed]);

    return ref;
  };

  const useStaggeredText = (text: string, lagMultiplier = 0.1) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;

      const element = ref.current;
      const chars = text.split("");

      element.innerHTML = chars
        .map(
          (char, i) =>
            `<span style="display: inline-block; transform: translateY(100px); opacity: 0;">${char === " " ? "&nbsp;" : char}</span>`,
        )
        .join("");

      const spans = element.querySelectorAll("span");

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        onEnter: () => {
          spans.forEach((span, i) => {
            gsap.to(span, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: i * lagMultiplier,
              ease: "power2.out",
            });
          });
        },
        once: true,
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, [text, lagMultiplier]);

    return ref;
  };

  const shuffleImages = () => {
    if (isShuffling) return;

    setIsShuffling(true);

    // Create a new shuffled order
    const newOrder = [...imageOrder];
    for (let i = newOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }

    setImageOrder(newOrder);

    // Reset shuffling state after animation completes
    setTimeout(() => {
      setIsShuffling(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-festival-cream relative overflow-hidden flex flex-col">
      <GSAPInteractiveBackground
        particleCount={30}
        colors={["#ff6b35", "#ff1f7a", "#ffeb3b", "#ff8a5b", "#ffa726"]}
      />
      {/* GSAP Animated background shapes */}
      <GSAPFloating amplitude={15} duration={4}>
        <div className="absolute top-16 right-16 w-16 h-16 bg-festival-orange rotate-45 rounded-lg opacity-80"></div>
      </GSAPFloating>
      <GSAPFloating amplitude={20} duration={5}>
        <div className="absolute top-32 right-32 w-12 h-12 bg-festival-pink -rotate-12 rounded-lg opacity-70"></div>
      </GSAPFloating>
      <GSAPFloating amplitude={12} duration={3.5}>
        <div className="absolute bottom-32 left-16 w-14 h-14 bg-festival-yellow rotate-12 rounded-lg opacity-75"></div>
      </GSAPFloating>
      <GSAPParallax speed={0.3}>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-festival-coral rotate-45 rounded-lg opacity-60"></div>
      </GSAPParallax>
      <GSAPParallax speed={-0.2}>
        <div className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-festival-amber rotate-12 rounded-lg opacity-50"></div>
      </GSAPParallax>

      <Navigation />

      {/* New Insane Hero Section with GSAP Magic */}
      <HeroSectionNew />

      {/* Color Strip Divider */}
      <div className="w-full h-12 flex">
        <div className="flex-1 bg-festival-orange"></div>
        <div className="flex-1 bg-festival-pink"></div>
        <div className="flex-1 bg-festival-yellow"></div>
        <div className="flex-1 bg-festival-orange"></div>
      </div>

      {/* How It Works - Retro Style */}
      <RetroHowItWorks />

      {/* Our Services Section */}
      <section
        id="services"
        className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 bg-festival-cream relative"
      >
        <div className="max-w-7xl mx-auto">
          <GSAPBounceIn delay={0.1} className="text-center mb-12 sm:mb-16">
            <GSAPFloating amplitude={20} duration={4}>
              <div className="inline-block mb-4 sm:mb-6">
                <Wand2 className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-festival-orange mx-auto" />
              </div>
            </GSAPFloating>
            <GSAPRevealText
              text="Our Creative Magic ✨"
              className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-festival-black mb-4 sm:mb-6 tracking-tight"
              delay={0.2}
            />
            <GSAPFadeIn delay={0.4}>
              <p className="text-lg sm:text-xl text-festival-black/80 max-w-2xl mx-auto px-4 sm:px-0 font-medium">
                Professional design solutions that'll make your competitors
                absolutely jealous! 🔥
              </p>
            </GSAPFadeIn>
          </GSAPBounceIn>

          <GSAPSlideIn direction="up" delay={0.5} className="mt-8 mb-12">
            <RevealImageList />
          </GSAPSlideIn>

          <StaggerContainer>
            <BentoGrid>
              {/* Photoshop Design Card */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  delay={0.2}
                  className="h-full bg-festival-orange border-2 border-festival-black"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white border-2 border-festival-black rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 },
                      }}
                    >
                      <Palette className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-festival-black" />
                    </motion.div>
                    <h3 className="font-black text-lg sm:text-xl text-white mb-2 sm:mb-3 tracking-tight">
                      Photoshop Design 🎨
                    </h3>
                    <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base font-medium">
                      Mind-blowing photo editing, compositing, and digital art
                      that'll absolutely destroy the competition!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "Photo Retouching",
                        "Digital Compositing",
                        "Graphic Design",
                        "Social Media Assets",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center text-retro-purple/70"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckCircle className="w-3 h-3 text-retro-teal mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto"
                    >
                      <Button
                        asChild
                        className="w-full bg-white border-2 border-festival-black text-festival-black hover:bg-festival-black hover:text-white font-black text-sm tracking-wide uppercase"
                      >
                        <Link to="/start-project">
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Get Started
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* 3D Design Card */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  delay={0.3}
                  className="h-full bg-festival-pink border-2 border-festival-black"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white border-2 border-festival-black rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      animate={{
                        rotateY: [0, 180, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Layers className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-festival-black" />
                    </motion.div>
                    <h3 className="font-black text-lg sm:text-xl text-white mb-2 sm:mb-3 tracking-tight">
                      3D Design 🎯
                    </h3>
                    <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base font-medium">
                      Absolutely insane 3D modeling and visualization that'll
                      blow everyone's minds!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "3D Modeling",
                        "Product Visualization",
                        "Architectural Renders",
                        "Character Design",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm"
                        >
                          <Sparkles className="w-3 h-3 text-retro-teal mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      asChild
                      className="w-full bg-white border-2 border-festival-black text-festival-black hover:bg-festival-black hover:text-white font-black text-sm tracking-wide uppercase mt-auto"
                    >
                      <Link to="/start-project">Get Started</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* Logo Design Card */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  delay={0.4}
                  className="h-full bg-festival-yellow border-2 border-festival-black"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white border-2 border-festival-black rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Brush className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-festival-black" />
                    </motion.div>
                    <h3 className="font-black text-lg sm:text-xl text-festival-black mb-2 sm:mb-3 tracking-tight">
                      Logo Design 🚀
                    </h3>
                    <p className="text-festival-black/80 mb-3 sm:mb-4 text-sm sm:text-base font-medium">
                      Epic brand identity that'll absolutely dominate and stand
                      out from the crowd!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "Logo Creation",
                        "Brand Guidelines",
                        "Business Cards",
                        "Brand Assets",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm"
                        >
                          <Star className="w-3 h-3 text-retro-orange mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      asChild
                      className="w-full bg-festival-black border-2 border-festival-black text-white hover:bg-white hover:text-festival-black font-black text-sm tracking-wide uppercase mt-auto"
                    >
                      <Link to="/start-project">Get Started</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>
            </BentoGrid>
          </StaggerContainer>
        </div>
      </section>

      {/* Portfolio Section - Smooth Scrolling Showcase */}
      <section id="portfolio" className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

        {/* Wrapper for smooth scrolling content */}
        <div className="relative w-full">
          <div className="px-3 relative">

            {/* Heading Section - Layered Text Effect */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 z-20"
              style={{ transform: 'translateX(-50%) translateY(-150%)' }}
            >
              <p className="font-display text-6xl sm:text-8xl lg:text-[12rem] text-center leading-none m-0"
                 style={{
                   fontSize: 'clamp(60px, 15.5vw, 250px)',
                   color: '#111',
                   WebkitTextStroke: '2px white',
                   zIndex: -10
                 }}>
                smooooth
              </p>

              {/* Text Container with Multiple Layers */}
              <div className="relative">
                <p className="font-display text-6xl sm:text-8xl lg:text-[12rem] text-center leading-none m-0 text-white"
                   style={{ fontSize: 'clamp(60px, 15.5vw, 250px)' }}>
                  scrolling
                </p>

                {/* Layered scrolling text at different speeds */}
                {[
                  { speed: 0.95, ref: useSpeedControl(0.95) },
                  { speed: 0.9, ref: useSpeedControl(0.9) },
                  { speed: 0.85, ref: useSpeedControl(0.85) },
                  { speed: 0.8, ref: useSpeedControl(0.8) },
                  { speed: 0.75, ref: useSpeedControl(0.75) },
                  { speed: 0.7, ref: useSpeedControl(0.7) }
                ].map(({ speed, ref }) => (
                  <div
                    key={speed}
                    ref={ref}
                    className="absolute top-0 left-0 right-0 z-50 font-display text-6xl sm:text-8xl lg:text-[12rem] text-center leading-none m-0 pointer-events-none"
                    style={{
                      fontSize: 'clamp(60px, 15.5vw, 250px)',
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    scrolling
                  </div>
                ))}
              </div>
            </div>

            {/* Image Grid Section */}
            <section className="relative max-w-6xl mx-auto pt-[40vh] -z-10">
              <div className="grid grid-cols-3 grid-rows-3 gap-1 w-[70vw] mx-auto">

                {/* Image 1 */}
                <div
                  ref={useSpeedControl(1.0)}
                  className="relative aspect-square overflow-hidden col-start-1 row-start-1"
                >
                  <img
                    ref={useSpeedControl(1.2)}
                    src="https://images.unsplash.com/photo-1556856425-366d6618905d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fG5lb258ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60"
                    alt="Portfolio showcase"
                    className="absolute top-0 w-full h-[150%] object-cover"
                  />
                </div>

                {/* Image 2 */}
                <div
                  ref={useSpeedControl(1.7)}
                  className="relative aspect-square overflow-hidden col-start-3 row-start-2"
                >
                  <img
                    ref={useSpeedControl(1.2)}
                    src="https://images.unsplash.com/photo-1520271348391-049dd132bb7c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    alt="Portfolio showcase"
                    className="absolute top-0 w-full h-[150%] object-cover"
                  />
                </div>

                {/* Image 3 */}
                <div
                  ref={useSpeedControl(1.5)}
                  className="relative aspect-square overflow-hidden col-start-2 row-start-3"
                >
                  <img
                    ref={useSpeedControl(1.2)}
                    src="https://images.unsplash.com/photo-1609166214994-502d326bafee?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    alt="Portfolio showcase"
                    className="absolute top-0 w-full h-[150%] object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Title Section */}
            <section className="max-w-6xl mx-auto text-center flex items-center justify-center flex-col min-h-[50vh] py-20">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl text-center leading-tight m-0 mb-6"
                  style={{ fontSize: 'clamp(40px, 8vw, 100px)' }}>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-normal"
                      style={{ fontSize: 'clamp(20px, 3vw, 40px)' }}>
                  with{' '}
                </span>
                GSAP scrolling
              </h1>
              <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                Seamlessly integrated with GSAP and ScrollTrigger. Leveraging native scrolling - no "fake" scrollbars or event hijacking.
              </p>
            </section>

            {/* Speed Control Bars Section */}
            <section className="max-w-6xl mx-auto flex flex-wrap gap-16 py-20">
              <div className="flex-1 min-w-[300px] flex flex-col items-start justify-center">
                <div className="border-l border-white pl-8">
                  <h2 className="text-xl sm:text-2xl font-medium mb-4">Speed Control</h2>
                  <p className="leading-relaxed">
                    Animate elements along at different speeds, slow them down or make them whizz past.
                  </p>
                </div>
              </div>

              <div className="flex-1 min-w-[500px] flex w-full h-[60vh] items-end">
                {[
                  { speed: 0.8, ref: useSpeedControl(0.8) },
                  { speed: 0.9, ref: useSpeedControl(0.9) },
                  { speed: 1.0, ref: useSpeedControl(1.0) },
                  { speed: 1.1, ref: useSpeedControl(1.1) },
                  { speed: 1.2, ref: useSpeedControl(1.2) }
                ].map(({ speed, ref }, index) => (
                  <div
                    key={speed}
                    ref={ref}
                    className="rounded-lg mx-4 text-center flex-1 font-display text-2xl sm:text-3xl bg-gradient-to-t from-retro-orange to-retro-pink text-white flex items-end justify-center pb-4"
                    style={{
                      height: `${20 + index * 15}%`,
                      fontSize: 'clamp(16px, 3vw, 36px)'
                    }}
                  >
                    {speed}
                  </div>
                ))}
              </div>
            </section>

            {/* Parallax Slab Section */}
            <section className="flex items-center min-h-screen py-20">
              <div className="relative h-[500px] w-full max-h-[500px] overflow-hidden">
                <img
                  ref={useSpeedControl(1.3)}
                  src="https://assets.codepen.io/756881/smoothscroller-1.jpg"
                  alt="Parallax showcase"
                  className="absolute bottom-0 w-full h-[180%] object-cover"
                />
              </div>
            </section>

            {/* Staggered Text Section */}
            <section className="max-w-6xl mx-auto flex items-center flex-wrap gap-16 py-20">
              <div className="flex-1 min-w-[300px]">
                <div className="border-l border-white pl-8">
                  <h2 className="text-xl sm:text-2xl font-medium mb-4">Add some lag (the good kind!)</h2>
                  <p className="leading-relaxed">
                    loosen the connection to the scroll to give a feeling of 'follow through.'
                  </p>
                </div>
              </div>

              <div className="flex-1 min-w-[500px] flex items-center justify-center">
                <h3
                  ref={useStaggeredText("stagger...", 0.1)}
                  className="font-display text-4xl sm:text-6xl lg:text-8xl font-normal tracking-wide"
                  style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
                >
                  {/* Text will be populated by useStaggeredText hook */}
                </h3>
              </div>
            </section>

            {/* Parallax Images Section */}
            <section className="mt-[10vh] px-4 py-40 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-20 items-center justify-items-center max-w-6xl mx-auto">
              <div className="border-l border-white pl-8 lg:col-start-2 lg:row-start-1">
                <h2 className="text-xl sm:text-2xl font-medium mb-4">Easy parallax image effects</h2>
                <p className="leading-relaxed">
                  Pop your images in a container with overflow hidden, size them a little larger than the container and set data-speed to auto. GSAP does the rest.
                </p>
              </div>

              <div className="relative h-[80vh] overflow-hidden w-full lg:col-start-1 lg:row-start-1">
                <img
                  ref={useSpeedControl(1.4)}
                  src="https://assets.codepen.io/756881/neon3.jpg"
                  alt="Parallax effect"
                  className="absolute bottom-0 h-[140%] w-full object-cover"
                />
              </div>

              <div className="relative h-[80vh] overflow-hidden w-full lg:col-start-2 lg:row-start-2">
                <img
                  ref={useSpeedControl(1.2)}
                  src="https://assets.codepen.io/756881/neon2.jpg"
                  alt="Parallax effect"
                  className="absolute bottom-0 h-[140%] w-full object-cover"
                />
              </div>
            </section>

            {/* Spacer */}
            <div className="h-[10vh]"></div>
          </div>
        </div>

          <StaggerContainer>
            <BentoGrid>
              {/* Before & After Showcase */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  delay={0.2}
                  className="h-full bg-festival-orange/30 border border-festival-orange/50"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-orange to-retro-peach rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Before & After Showcase 🎭
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
                      Interactive transformations that demonstrate our design
                      magic!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "Photo Retouching",
                        "Logo Redesigns",
                        "Brand Makeovers",
                        "3D Transformations",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center text-festival-black/60"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TrendingUp className="w-3 h-3 text-festival-orange mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto"
                    >
                      <Button
                        asChild
                        className="w-full bg-festival-orange border-2 border-festival-black text-white font-bold text-sm"
                      >
                        <Link to="/start-project">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Get Started
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* Interactive Preview */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-teal/20 to-retro-mint/20"
                  delay={0.3}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-teal to-retro-mint rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-festival-black mb-2 sm:mb-3">
                      Interactive Preview 🎬
                    </h3>
                    <p className="text-festival-black/70 mb-3 sm:mb-4 text-sm sm:text-base">
                      See our design process in action with live previews!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "Live Design Process",
                        "Real-time Feedback",
                        "Version Comparisons",
                        "Interactive Tours",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm"
                        >
                          <Play className="w-3 h-3 text-retro-teal mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white mt-auto text-sm"
                    >
                      <Link to="/start-project">Watch Demo</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* Portfolio Stats */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-purple/20 to-retro-lavender/20"
                  delay={0.4}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-purple to-retro-lavender rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Trophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-festival-black mb-2 sm:mb-3">
                      Portfolio Highlights 🏆
                    </h3>
                    <p className="text-festival-black/70 mb-3 sm:mb-4 text-sm sm:text-base">
                      Stunning results from our expert design team!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "200+ Amazing Projects",
                        "Award-Winning Designs",
                        "Client Success Stories",
                        "Industry Recognition",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm"
                        >
                          <Trophy className="w-3 h-3 text-retro-purple mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white mt-auto text-sm"
                    >
                      <Link to="/start-project">View Gallery</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>
            </BentoGrid>
          </StaggerContainer>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 bg-white/20 backdrop-blur-sm relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: -30 }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: 1.2,
              },
            }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-4 sm:mb-6"
            >
              <Lightbulb className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-retro-purple mx-auto" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-retro-purple mb-3 sm:mb-4">
              About Our Amazing Studio 🌟
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-retro-purple/80 max-w-2xl mx-auto px-4 sm:px-0">
              Meet the expert team behind design requests and learn about our
              mission to deliver exceptional design services!
            </p>
          </motion.div>

          <StaggerContainer>
            <BentoGrid>
              {/* Mission Card */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  delay={0.2}
                  className="h-full bg-festival-pink/20 border border-festival-pink/30"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-purple to-retro-teal rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Heart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-festival-black mb-2 sm:mb-3">
                      Our Mission 🎯
                    </h3>
                    <p className="text-festival-black/70 mb-3 sm:mb-4 text-sm sm:text-base">
                      Making exceptional design accessible to everyone!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "Professional Quality",
                        "Expert Designers",
                        "Vision to Reality",
                        "Accessible Pricing",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center text-festival-black/60"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Heart className="w-3 h-3 text-festival-pink mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto"
                    >
                      <Button
                        asChild
                        className="w-full bg-festival-pink border-2 border-festival-black text-white font-bold text-sm"
                      >
                        <Link to="/start-project">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Get Started
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* Team Stats */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-teal/20 to-retro-mint/20"
                  delay={0.3}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-teal to-retro-mint rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Expert Team 👥
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
                      Our curated team of creative wizards!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "15+ Creative Wizards",
                        "5+ Years Experience",
                        "Global Talent Pool",
                        "Diverse Expertise",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm"
                        >
                          <Users className="w-3 h-3 text-retro-teal mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white mt-auto text-sm"
                    >
                      <Link to="/start-project">Meet Our Team</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* Global Reach */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-purple/20 to-retro-lavender/20"
                  delay={0.4}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-purple to-retro-lavender rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Globe className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Global Reach 🌍
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
                      Serving creative minds worldwide!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "50+ Countries Served",
                        "24/7 Support",
                        "Multiple Languages",
                        "Local Understanding",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm"
                        >
                          <Globe className="w-3 h-3 text-retro-purple mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white mt-auto text-sm"
                    >
                      <Link to="/start-project">Global Project</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* Values Card */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  delay={0.5}
                  className="h-full bg-festival-orange/20 border border-festival-orange/30"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-orange to-retro-peach rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{
                        rotate: 360,
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Smile className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Our Values 💫
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
                      Principles that guide everything we do!
                    </p>
                    <div className="space-y-2 mb-4 flex-1">
                      {[
                        "Creativity First",
                        "Quality Always",
                        "Client Happiness",
                        "Innovation Daily",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center text-retro-purple/70"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Star className="w-3 h-3 text-retro-orange mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-retro-orange text-retro-orange hover:bg-retro-orange hover:text-white mt-auto text-sm"
                    >
                      <Link to="/start-project">Share Our Values</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>
            </BentoGrid>
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative mx-auto"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -45 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
              transition: {
                type: "spring",
                damping: 10,
                stiffness: 80,
                duration: 1.5,
              },
            }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-4 sm:mb-6"
            >
              <MessageCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-retro-purple mx-auto" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-retro-purple mb-3 sm:mb-4">
              Get In Touch! 📞
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-retro-purple/80 max-w-2xl mx-auto px-4 sm:px-0">
              Have questions about our services? Need help with your project?
              We're here to help make magic happen! ���
            </p>
          </motion.div>

          <StaggerContainer>
            <div className="max-w-2xl mx-auto">
              {/* Contact Form */}
              <StaggerChild>
                <BentoCard
                  size="lg"
                  delay={0.2}
                  className="h-full bg-white border border-gray-200"
                >
                  <div className="p-6 sm:p-8 lg:p-10 h-full">
                    <motion.div
                      className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-retro-purple to-retro-teal rounded-xl lg:rounded-2xl flex items-center justify-center"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Send className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-xl sm:text-2xl text-retro-purple">
                          Send us a Message! ���
                        </h3>
                        <p className="text-retro-purple/70 text-sm sm:text-base">
                          Tell us about your amazing project ideas!
                        </p>
                      </div>
                    </motion.div>

                    <form className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <Label
                            htmlFor="name"
                            className="text-retro-purple font-medium"
                          >
                            Full Name ✨
                          </Label>
                          <Input
                            id="name"
                            placeholder="Your awesome name"
                            className="mt-2 border-retro-purple/30 focus:border-retro-purple rounded-xl"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-retro-purple font-medium"
                          >
                            Email Address 📧
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@awesome-email.com"
                            className="mt-2 border-retro-purple/30 focus:border-retro-purple rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="subject"
                          className="text-retro-purple font-medium"
                        >
                          Subject 🎯
                        </Label>
                        <Input
                          id="subject"
                          placeholder="What's this magical message about?"
                          className="mt-2 border-retro-purple/30 focus:border-retro-purple rounded-xl"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="message"
                          className="text-retro-purple font-medium"
                        >
                          Message 💭
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your amazing project ideas, questions, or just say hi! We love hearing from creative minds..."
                          rows={6}
                          className="mt-2 border-retro-purple/30 focus:border-retro-purple rounded-xl resize-none"
                        />
                      </div>
                      <motion.div
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          size="lg"
                          className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Send Magic Message ✨
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    </form>
                  </div>
                </BentoCard>
              </StaggerChild>
            </div>
          </StaggerContainer>

          {/* CTA Section */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8 },
            }}
            viewport={{ once: true }}
          >
            <TiltCard className="bg-gradient-to-br from-retro-purple/10 to-retro-teal/10 rounded-3xl p-8 backdrop-blur-sm border-2 border-retro-purple/20 inline-block">
              <p className="text-lg text-retro-purple/80 mb-4">
                Ready to start your design project instead? 🚀
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-bold px-8 py-4 rounded-2xl shadow-xl"
                >
                  <Link to="/start-project">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Your Project Now!
                  </Link>
                </Button>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Interactive Image Shuffle Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "rgb(243, 236, 210)",
          }}
        >
          {/* Rainbow Vertical Lines SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            viewBox="0 0 452 600"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Black outlines */}
            <path
              d="M426 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "472.353px, 127.747px" }}
            />
            <path
              d="M376 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "427.467px, 172.633px" }}
            />
            <path
              d="M326 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "375.83px, 224.27px" }}
            />
            <path
              d="M276 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "317.443px, 282.657px" }}
            />
            <path
              d="M226 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "252.306px, 347.794px" }}
            />
            <path
              d="M176 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "180.42px, 419.68px" }}
            />
            <path
              d="M126 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "101.783px, 498.317px" }}
            />
            <path
              d="M76 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "16.396px, 583.704px" }}
            />
            <path
              d="M26 0V600"
              stroke="black"
              strokeWidth="52"
              style={{ strokeDasharray: "0px, 999999px" }}
            />

            {/* Colored lines */}
            <path
              d="M426 0V600"
              stroke="#F97028"
              strokeWidth="48"
              style={{ strokeDasharray: "472.353px, 127.747px" }}
            />
            <path
              d="M376 0V600"
              stroke="#F489A3"
              strokeWidth="48"
              style={{ strokeDasharray: "427.467px, 172.633px" }}
            />
            <path
              d="M326 0V600"
              stroke="#F0BB0D"
              strokeWidth="48"
              style={{ strokeDasharray: "375.83px, 224.27px" }}
            />
            <path
              d="M276 0V600"
              stroke="#F3A20F"
              strokeWidth="48"
              style={{ strokeDasharray: "317.443px, 282.657px" }}
            />
            <path
              d="M226 0V600"
              stroke="#F97028"
              strokeWidth="48"
              style={{ strokeDasharray: "252.306px, 347.794px" }}
            />
            <path
              d="M176 0V600"
              stroke="#F489A3"
              strokeWidth="48"
              style={{ strokeDasharray: "180.42px, 419.68px" }}
            />
            <path
              d="M126 0V600"
              stroke="#F0BB0D"
              strokeWidth="48"
              style={{ strokeDasharray: "101.783px, 498.317px" }}
            />
            <path
              d="M76 0V600"
              stroke="#F3A20F"
              strokeWidth="48"
              style={{ strokeDasharray: "16.396px, 583.704px" }}
            />
            <path
              d="M26 0V600"
              stroke="#F97028"
              strokeWidth="48"
              style={{ strokeDasharray: "0px, 999999px" }}
            />
          </svg>
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Image Stack Container */}
            <div className="relative w-full aspect-[4/5] mb-6">
              {imageOrder.map((imageIndex, stackIndex) => {
                const zIndexes = [30, 20, 10, 0];
                const shadows = [
                  "shadow-xl",
                  "shadow-lg",
                  "shadow-md",
                  "shadow-sm",
                ];
                const rotations = [
                  [3, -3, 3],
                  [-2, 2, -2],
                  [2, -2, 2],
                  [-1, 1, -1],
                ];
                const scales = [
                  [1, 1.02, 1],
                  [1, 1.01, 1],
                  [1, 1.01, 1],
                  [1, 1, 1],
                ];

                return (
                  <motion.div
                    key={`image-${imageIndex}`}
                    className={`absolute inset-0 z-${zIndexes[stackIndex]}`}
                    style={{ zIndex: zIndexes[stackIndex] }}
                    animate={
                      isShuffling
                        ? {
                            rotate: [0, 360, 0],
                            scale: [1, 1.3, 1],
                            x: [0, Math.random() * 100 - 50, 0],
                            y: [0, Math.random() * 100 - 50, 0],
                          }
                        : {
                            rotate: rotations[stackIndex],
                            scale: scales[stackIndex],
                          }
                    }
                    transition={
                      isShuffling
                        ? {
                            duration: 1,
                            ease: "easeInOut",
                            delay: stackIndex * 0.1,
                          }
                        : {
                            duration: 4 + stackIndex,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: stackIndex,
                          }
                    }
                  >
                    <div
                      className={`w-full h-full border-2 border-black rounded-3xl ${shadows[stackIndex]} overflow-hidden bg-white`}
                    >
                      <img
                        src={images[imageIndex]}
                        alt={`Portfolio showcase ${imageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Shuffle Button */}
            <div className="flex flex-col items-center gap-4 relative z-50 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center ${isShuffling ? "bg-retro-orange" : "bg-retro-cream"} border-2 border-black rounded-full px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl font-bold text-black cursor-pointer relative z-50 ${isShuffling ? "opacity-75" : ""}`}
                style={{
                  pointerEvents: "auto",
                  touchAction: "manipulation",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  shuffleImages();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  console.log("Button pressed!");
                }}
              >
                <motion.div
                  animate={
                    isShuffling
                      ? {
                          rotate: [0, 720],
                          scale: [1, 1.3, 1],
                        }
                      : {
                          rotate: [0, 360],
                        }
                  }
                  transition={
                    isShuffling
                      ? {
                          duration: 1,
                          ease: "easeInOut",
                        }
                      : {
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }
                  }
                  className="mr-2 pointer-events-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-current pointer-events-none"
                  >
                    <path
                      d="M1 4V10H7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M23 20V14H17"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M20.5 8.99998C19.6855 6.75968 18.0244 4.92842 15.8739 3.89992C13.7235 2.87143 11.2553 2.72782 9 3.49998C7.7459 3.98238 6.59283 4.69457 5.6 5.59998L1 9.99998M23 14L18.4 18.4C16.6963 20.0855 14.3965 21.0308 12 21.0308C9.60347 21.0308 7.30368 20.0855 5.6 18.4C4.69459 17.4072 3.9824 16.2541 3.5 15"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                  </svg>
                </motion.div>
                <span className="font-bold tracking-tight pointer-events-none">
                  {isShuffling ? "Shuffling..." : "Shuffle"}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="bg-retro-purple/90 text-white px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <motion.div
                className="flex items-center space-x-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-display text-xl">design requests</h3>
                  <p className="text-sm text-white/70">Expert Design Studio</p>
                </div>
              </motion.div>
              <p className="text-white/80">
                Professional design services by our curated team of creative
                wizards! ✨
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                {[
                  { label: "Home", href: "#home" },
                  { label: "Services", href: "#services" },
                  { label: "Portfolio", href: "#portfolio" },
                  { label: "About", href: "#about" },
                  { label: "Contact", href: "#contact" },
                ].map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() =>
                        document
                          .getElementById(link.href.substring(1))
                          ?.scrollIntoView({
                            behavior: "smooth",
                          })
                      }
                      className="hover:text-white cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link to="/start-project" className="hover:text-white">
                    Photoshop Design
                  </Link>
                </li>
                <li>
                  <Link to="/start-project" className="hover:text-white">
                    3D Design
                  </Link>
                </li>
                <li>
                  <Link to="/start-project" className="hover:text-white">
                    Logo Design
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disputes" className="hover:text-white">
                    Dispute Resolution
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>
              © 2024 design requests. All rights reserved. Expert design
              services you can trust! Made with{" "}
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  color: ["#ff6b6b", "#4ecdc4", "#ff6b6b"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ❤️
              </motion.span>{" "}
              and lots of creativity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;