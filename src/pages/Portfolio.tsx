import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  ExternalLink,
  Star,
  Zap,
  Palette,
  Code,
  Smartphone,
  Globe,
  Camera,
  Layers,
} from "lucide-react";
import {
  GSAPFadeIn,
  GSAPSlideIn,
  GSAPStagger,
  GSAPHover,
  GSAPBounceIn,
  GSAPScaleIn,
  GSAPParallax,
  GSAPRevealText,
  GSAPMagneticButton,
} from "@/components/GSAPAnimatedElements";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Speed-controlled parallax elements
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

  // Staggered text effect with lag
  const useStaggeredText = (text: string, lagMultiplier = 0.1) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;

      const element = ref.current;
      const chars = text.split("");

      element.innerHTML = chars
        .map(
          (char, i) =>
            `<span style="display: inline-block; transform: translateY(100px); opacity: 0;">${char}</span>`,
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

  const portfolioItems = [
    {
      id: 1,
      title: "Groovy Records Store",
      category: "E-commerce",
      description:
        "Far out online store with psychedelic vibes and smooth user experience",
      image: "/api/placeholder/400/300",
      tags: ["React", "Node.js", "Stripe"],
      icon: <Globe className="w-6 h-6" />,
      color: "from-festival-orange to-festival-coral",
    },
    {
      id: 2,
      title: "Neon Dreams App",
      category: "Mobile App",
      description:
        "Radical mobile app with retro-futuristic design and killer features",
      image: "/api/placeholder/400/300",
      tags: ["React Native", "Firebase", "Redux"],
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-festival-pink to-festival-magenta",
    },
    {
      id: 3,
      title: "Vintage Photo Gallery",
      category: "Photography",
      description:
        "Totally tubular photo showcase with vintage filters and smooth transitions",
      image: "/api/placeholder/400/300",
      tags: ["Vue.js", "GSAP", "WebGL"],
      icon: <Camera className="w-6 h-6" />,
      color: "from-festival-yellow to-festival-amber",
    },
    {
      id: 4,
      title: "Retro Dashboard",
      category: "Web App",
      description:
        "Sick analytics dashboard with retro aesthetics and modern functionality",
      image: "/api/placeholder/400/300",
      tags: ["Next.js", "D3.js", "TypeScript"],
      icon: <Layers className="w-6 h-6" />,
      color: "from-festival-cream to-festival-beige",
    },
    {
      id: 5,
      title: "Disco Brand Identity",
      category: "Branding",
      description:
        "Funky fresh brand identity that brings the disco fever to modern times",
      image: "/api/placeholder/400/300",
      tags: ["Figma", "Illustrator", "Branding"],
      icon: <Palette className="w-6 h-6" />,
      color: "from-festival-orange to-festival-pink",
    },
    {
      id: 6,
      title: "Electric Code Editor",
      category: "Development",
      description:
        "Revolutionary code editor with electric syntax highlighting and smooth performance",
      image: "/api/placeholder/400/300",
      tags: ["Electron", "Monaco", "WebAssembly"],
      icon: <Code className="w-6 h-6" />,
      color: "from-festival-magenta to-festival-coral",
    },
  ];

  const categories = [
    "All",
    "E-commerce",
    "Mobile App",
    "Photography",
    "Web App",
    "Branding",
    "Development",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-festival-black via-gray-900 to-festival-black relative overflow-hidden">
      {/* Retro background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-festival-orange to-festival-pink rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-festival-yellow to-festival-magenta rounded-full blur-3xl"></div>
      </div>

      {/* Geometric shapes */}
      <GSAPParallax
        speed={0.3}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-20 h-20 border-4 border-festival-orange rotate-45 opacity-20"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-festival-pink rounded-full opacity-20"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border-4 border-festival-yellow opacity-20"></div>
        <div className="absolute bottom-20 right-40 w-12 h-12 bg-festival-magenta transform rotate-45 opacity-20"></div>
      </GSAPParallax>

      <Navigation />

      <div className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <GSAPBounceIn>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-festival-orange to-festival-pink p-1 rounded-full mb-6">
                <Star className="w-5 h-5 text-white ml-3" />
                <span className="text-white font-semibold px-4 py-2">
                  Portfolio Showcase
                </span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-1">
                  <Zap className="w-4 h-4 text-festival-orange" />
                </div>
              </div>
            </GSAPBounceIn>

            <GSAPRevealText
              text="Our Groovy Portfolio"
              className="font-display text-6xl lg:text-8xl mb-6 bg-gradient-to-r from-festival-orange via-festival-pink to-festival-yellow bg-clip-text text-transparent"
            />

            <GSAPFadeIn delay={0.5}>
              <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                Step into our far-out collection of radical projects that blend
                retro vibes with cutting-edge technology. Each piece is crafted
                with love, creativity, and a healthy dose of funk.
              </p>
            </GSAPFadeIn>

            <GSAPSlideIn direction="up" delay={0.8}>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category, index) => (
                  <GSAPHover key={category} animation="bounce">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-6 py-2 text-base cursor-pointer transition-all duration-300 border-2",
                        index === 0
                          ? "bg-gradient-to-r from-festival-orange to-festival-pink border-transparent text-white"
                          : "border-gray-600 text-gray-300 hover:border-festival-orange hover:text-festival-orange",
                      )}
                    >
                      {category}
                    </Badge>
                  </GSAPHover>
                ))}
              </div>
            </GSAPSlideIn>
          </div>

          {/* Portfolio Grid */}
          <GSAPStagger
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {portfolioItems.map((item, index) => (
              <GSAPHover key={item.id} animation="lift">
                <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-festival-orange transition-all duration-500">
                  {/* Image Container */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-60",
                        item.color,
                      )}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-6xl opacity-30">
                        {item.icon}
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-festival-orange hover:bg-festival-coral text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        className={cn(
                          "text-xs px-2 py-1 bg-gradient-to-r text-white",
                          item.color,
                        )}
                      >
                        {item.category}
                      </Badge>
                      {item.icon}
                    </div>

                    <h3 className="font-display text-xl text-white mb-2 group-hover:text-festival-orange transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GSAPHover>
            ))}
          </GSAPStagger>

          {/* Interactive Showcase Section */}
          <GSAPScaleIn>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-3xl p-12 text-center mb-12 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-8 grid-rows-8 h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-festival-orange"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <GSAPBounceIn delay={0.2}>
                  <div className="w-20 h-20 bg-gradient-to-r from-festival-orange to-festival-pink rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                </GSAPBounceIn>

                <GSAPRevealText
                  text="Interactive Before & After Showcase"
                  className="font-display text-4xl lg:text-5xl text-white mb-6"
                />

                <GSAPFadeIn delay={0.5}>
                  <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Experience our dynamic portfolio with interactive sliders
                    and mind-blowing animations that demonstrate our
                    transformative design capabilities.
                    <span className="text-festival-orange font-semibold">
                      {" "}
                      Prepare to be amazed!
                    </span>
                  </p>
                </GSAPFadeIn>

                <GSAPSlideIn direction="up" delay={0.8}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <GSAPMagneticButton className="bg-gradient-to-r from-festival-orange to-festival-coral text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                      <Eye className="w-5 h-5 mr-2 inline" />
                      View Gallery
                    </GSAPMagneticButton>

                    <GSAPMagneticButton className="border-2 border-festival-pink text-festival-pink hover:bg-festival-pink hover:text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300">
                      <ExternalLink className="w-5 h-5 mr-2 inline" />
                      Live Demos
                    </GSAPMagneticButton>
                  </div>
                </GSAPSlideIn>
              </div>
            </div>
          </GSAPScaleIn>

          {/* Call to Action */}
          <GSAPFadeIn>
            <div className="text-center">
              <h3 className="font-display text-3xl lg:text-4xl text-white mb-6">
                Ready to Create Something
                <span className="bg-gradient-to-r from-festival-yellow to-festival-orange bg-clip-text text-transparent">
                  {" "}
                  Totally Rad?
                </span>
              </h3>

              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Let's collaborate and bring your wildest ideas to life with our
                groovy team of designers and developers.
              </p>

              <GSAPMagneticButton>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-festival-pink via-festival-magenta to-festival-coral text-white font-bold px-12 py-6 rounded-2xl shadow-2xl text-lg hover:shadow-festival-pink/25 transition-all duration-500"
                >
                  <Link to="/start-project">
                    Start Your Project
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Link>
                </Button>
              </GSAPMagneticButton>
            </div>
          </GSAPFadeIn>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
