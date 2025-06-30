import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import {
  BentoGrid,
  BentoCard,
  StatBentoCard,
  FeatureBentoCard,
  HeroBentoCard,
} from "@/components/BentoCards";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30 relative overflow-hidden flex flex-col">
      {/* Floating background elements */}
      <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-retro-pink/20 rounded-full blur-xl" />
      <FloatingElement className="absolute top-40 right-20 w-16 h-16 bg-retro-teal/30 rounded-full blur-lg" />
      <FloatingElement className="absolute bottom-20 left-1/4 w-12 h-12 bg-retro-orange/20 rounded-full blur-md" />

      <Navigation />

      {/* Hero Section */}
      <section
        id="home"
        className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <BounceIn delay={0.2} className="text-center mb-8 sm:mb-12">
            <motion.div
              className="inline-flex items-center space-x-2 bg-retro-purple/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8"
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <WiggleIcon>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-retro-purple" />
              </WiggleIcon>
              <span className="text-xs sm:text-sm font-medium text-retro-purple">
                Expert Design Studio Platform
              </span>
            </motion.div>
          </BounceIn>

          <BentoGrid className="mb-12 sm:mb-16">
            {/* Main Hero Card */}
            <HeroBentoCard delay={0.3}>
              <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-center text-center">
                <motion.h1
                  className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-retro-purple mb-4 sm:mb-6 leading-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Transform Your Ideas Into
                  <motion.span
                    className="bg-gradient-to-r from-retro-orange to-retro-peach bg-clip-text text-transparent block"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Stunning Designs
                  </motion.span>
                </motion.h1>

                <FadeInUp delay={0.7} className="mb-6 sm:mb-8">
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-retro-purple/80 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                    Connect with our curated team of expert designers. From
                    Photoshop magic to 3D masterpieces and memorable logos - we
                    bring your vision to life!
                  </p>
                </FadeInUp>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", damping: 15 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base lg:text-lg animate-pulse-glow w-full sm:w-auto"
                    >
                      <Link to="/start-project">
                        <WiggleIcon>
                          <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        </WiggleIcon>
                        Start Your Project
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-2xl transition-all duration-300 text-sm sm:text-base lg:text-lg w-full sm:w-auto"
                      onClick={() =>
                        document.getElementById("portfolio")?.scrollIntoView({
                          behavior: "smooth",
                        })
                      }
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      Watch Demo
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </HeroBentoCard>

            {/* Stats Cards */}
            <StatBentoCard
              stat="500+"
              label="Projects Delivered"
              icon={Target}
              delay={0.4}
            />
            <StatBentoCard
              stat="98%"
              label="Client Satisfaction"
              icon={Heart}
              delay={0.5}
            />
            <StatBentoCard
              stat="24h"
              label="Average Turnaround"
              icon={Clock}
              delay={0.6}
            />
            <StatBentoCard
              stat="15+"
              label="Expert Designers"
              icon={Users}
              delay={0.7}
            />
          </BentoGrid>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInUp className="text-center mb-12 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-retro-purple mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-retro-purple/80 max-w-2xl mx-auto px-4 sm:px-0">
              Our streamlined process makes getting professional design work
              effortless and fun!
            </p>
          </FadeInUp>

          <BentoGrid>
            <FeatureBentoCard
              title="Submit Your Brief"
              description="Tell us about your project using our AI-powered brief generator. It's like magic, but for design briefs!"
              icon={Upload}
              gradient="from-retro-purple/80 to-retro-purple/60"
              delay={0.2}
            />
            <FeatureBentoCard
              title="Get Matched"
              description="We assign the perfect designer from our expert team. Think of it as design matchmaking!"
              icon={Users}
              gradient="from-retro-teal/80 to-retro-teal/60"
              delay={0.3}
            />
            <FeatureBentoCard
              title="Collaborate"
              description="Work directly with your designer through secure messaging. It's like having a design buddy!"
              icon={MessageCircle}
              gradient="from-retro-orange/80 to-retro-orange/60"
              delay={0.4}
            />
            <FeatureBentoCard
              title="Receive Results"
              description="Get your professional designs delivered on time. Boom! Your vision comes to life!"
              icon={CheckCircle}
              gradient="from-retro-pink/80 to-retro-pink/60"
              delay={0.5}
            />
          </BentoGrid>
        </div>
      </section>

      {/* Our Services Section */}
      <section
        id="services"
        className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 bg-white/20 backdrop-blur-sm relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 100,
                duration: 0.8,
              },
            }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-4 sm:mb-6"
            >
              <Wand2 className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-retro-purple mx-auto" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-retro-purple mb-3 sm:mb-4">
              Our Magic Services ✨
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-retro-purple/80 max-w-2xl mx-auto px-4 sm:px-0">
              Professional design solutions that'll make your competitors
              jealous!
            </p>
          </motion.div>

          <StaggerContainer>
            <BentoGrid>
              {/* Photoshop Design Card */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-purple/20 via-retro-teal/20 to-retro-purple/20"
                  delay={0.2}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-purple to-retro-teal rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 },
                      }}
                    >
                      <Palette className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Photoshop Design 🎨
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
                      Photo editing, compositing, and digital art creation
                      that'll blow your mind!
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
                        className="w-full bg-gradient-to-r from-retro-purple to-retro-teal text-white font-semibold text-sm"
                      >
                        <Link to="/start-project">
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Start Photoshop Project
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
                  gradient="from-retro-teal/20 to-retro-mint/20"
                  delay={0.3}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-teal to-retro-mint rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      animate={{
                        rotateY: [0, 180, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Layers className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      3D Design 🎯
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
                      Mind-blowing 3D modeling and visualization!
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
                      variant="outline"
                      className="w-full border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white mt-auto text-sm"
                    >
                      <Link to="/start-project">Start 3D Project</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>

              {/* Logo Design Card */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-orange/20 to-retro-peach/20"
                  delay={0.4}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-orange to-retro-peach rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Brush className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Logo Design 🚀
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
                      Brand identity that stands out from the crowd!
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
                      variant="outline"
                      className="w-full border-retro-orange text-retro-orange hover:bg-retro-orange hover:text-white mt-auto text-sm"
                    >
                      <Link to="/start-project">Start Logo Project</Link>
                    </Button>
                  </div>
                </BentoCard>
              </StaggerChild>
            </BentoGrid>
          </StaggerContainer>
        </div>
      </section>

      {/* Portfolio Section */}
      <section
        id="portfolio"
        className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                damping: 10,
                stiffness: 100,
                duration: 1,
              },
            }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-4 sm:mb-6"
            >
              <Eye className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-retro-purple mx-auto" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-retro-purple mb-3 sm:mb-4">
              Portfolio Magic ✨
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-retro-purple/80 max-w-2xl mx-auto px-4 sm:px-0">
              See the transformative power of our expert design wizards!
            </p>
          </motion.div>

          <StaggerContainer>
            <BentoGrid>
              {/* Before & After Showcase */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-purple/20 via-retro-teal/20 to-retro-orange/20"
                  delay={0.2}
                  className="h-full"
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
                          className="flex items-center text-retro-purple/70"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TrendingUp className="w-3 h-3 text-retro-orange mr-2 flex-shrink-0" />
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
                        className="w-full bg-gradient-to-r from-retro-orange to-retro-peach text-white font-semibold text-sm"
                      >
                        <Link to="/start-project">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Start Your Transformation
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
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Interactive Preview 🎬
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
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
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Portfolio Highlights 🏆
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
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
                  gradient="from-retro-lavender/20 to-retro-mint/20"
                  delay={0.2}
                  className="h-full"
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
                    <h3 className="font-bold text-lg sm:text-xl text-retro-purple mb-2 sm:mb-3">
                      Our Mission 🎯
                    </h3>
                    <p className="text-retro-purple/80 mb-3 sm:mb-4 text-sm sm:text-base">
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
                          className="flex items-center text-retro-purple/70"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Heart className="w-3 h-3 text-retro-purple mr-2 flex-shrink-0" />
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
                        className="w-full bg-gradient-to-r from-retro-purple to-retro-teal text-white font-semibold text-sm"
                      >
                        <Link to="/start-project">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Join Our Mission
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
                  gradient="from-retro-orange/20 to-retro-peach/20"
                  delay={0.5}
                  className="h-full"
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
            <BentoGrid>
              {/* Contact Methods */}
              {[
                {
                  icon: MessageCircle,
                  title: "Live Chat 💬",
                  description: "Instant support during business hours",
                  action: "Start Chat",
                  gradient: "from-retro-purple/20 to-retro-teal/20",
                  features: [
                    "Instant Response",
                    "Business Hours",
                    "Expert Help",
                    "Real-time Chat",
                  ],
                },
                {
                  icon: Mail,
                  title: "Email Support 📧",
                  description: "Get detailed help via email",
                  action: "Send Email",
                  gradient: "from-retro-teal/20 to-retro-mint/20",
                  features: [
                    "Detailed Support",
                    "24/7 Received",
                    "File Attachments",
                    "Follow-up",
                  ],
                },
                {
                  icon: Phone,
                  title: "Quick Call 📱",
                  description: "Talk directly with our team",
                  action: "Call Now",
                  gradient: "from-retro-orange/20 to-retro-peach/20",
                  features: [
                    "Direct Contact",
                    "Voice Support",
                    "Screen Sharing",
                    "Personal Touch",
                  ],
                },
              ].map((contact, index) => (
                <StaggerChild key={index}>
                  <BentoCard
                    size="md"
                    gradient={contact.gradient}
                    delay={index * 0.1}
                    className="h-full"
                  >
                    <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                      <motion.div
                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <contact.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      </motion.div>
                      <h3 className="font-bold text-lg sm:text-xl text-white mb-2 sm:mb-3">
                        {contact.title}
                      </h3>
                      <p className="text-white/80 mb-3 sm:mb-4 text-sm sm:text-base">
                        {contact.description}
                      </p>
                      <div className="space-y-2 mb-4 flex-1">
                        {contact.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center text-xs sm:text-sm"
                          >
                            <CheckCircle className="w-3 h-3 text-white/60 mr-2 flex-shrink-0" />
                            <span className="text-white/70">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-white/30 text-white hover:bg-white hover:text-retro-purple mt-auto text-sm"
                      >
                        {contact.action}
                      </Button>
                    </div>
                  </BentoCard>
                </StaggerChild>
              ))}

              {/* Contact Form */}
              <StaggerChild>
                <BentoCard
                  size="md"
                  gradient="from-retro-lavender/20 to-retro-cream/20"
                  delay={0.4}
                  className="h-full"
                >
                  <div className="p-4 sm:p-5 lg:p-6 h-full">
                    <motion.div
                      className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-retro-purple to-retro-teal rounded-xl lg:rounded-2xl flex items-center justify-center"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Send className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl text-retro-purple">
                          Send us a Message! 💌
                        </h3>
                        <p className="text-retro-purple/70 text-sm">
                          Quick project inquiry form
                        </p>
                      </div>
                    </motion.div>

                    <form className="space-y-3 sm:space-y-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-retro-purple font-medium text-sm"
                        >
                          Full Name ✨
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your awesome name"
                          className="mt-1 border-retro-purple/30 focus:border-retro-purple rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-retro-purple font-medium text-sm"
                        >
                          Email Address 📧
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@awesome-email.com"
                          className="mt-1 border-retro-purple/30 focus:border-retro-purple rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="message"
                          className="text-retro-purple font-medium text-sm"
                        >
                          Message 💭
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your project..."
                          rows={3}
                          className="mt-1 border-retro-purple/30 focus:border-retro-purple rounded-xl resize-none text-sm"
                        />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Magic Message ✨
                        </Button>
                      </motion.div>
                    </form>
                  </div>
                </BentoCard>
              </StaggerChild>
            </BentoGrid>
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
