import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30 relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-retro-pink/20 rounded-full blur-xl" />
      <FloatingElement className="absolute top-40 right-20 w-16 h-16 bg-retro-teal/30 rounded-full blur-lg" />
      <FloatingElement className="absolute bottom-20 left-1/4 w-12 h-12 bg-retro-orange/20 rounded-full blur-md" />

      <Navigation />

      {/* Hero Section with Bento Layout */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <BounceIn delay={0.2} className="text-center mb-12">
            <motion.div
              className="inline-flex items-center space-x-2 bg-retro-purple/10 px-4 py-2 rounded-full mb-8"
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <WiggleIcon>
                <Sparkles className="w-4 h-4 text-retro-purple" />
              </WiggleIcon>
              <span className="text-sm font-medium text-retro-purple">
                Expert Design Studio Platform
              </span>
            </motion.div>
          </BounceIn>

          <BentoGrid className="mb-16">
            {/* Main Hero Card */}
            <HeroBentoCard delay={0.3}>
              <div className="p-8 h-full flex flex-col justify-center text-center">
                <motion.h1
                  className="font-display text-4xl lg:text-6xl text-retro-purple mb-6 leading-tight"
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

                <FadeInUp delay={0.7} className="mb-8">
                  <p className="text-lg lg:text-xl text-retro-purple/80 max-w-2xl mx-auto leading-relaxed">
                    Connect with our curated team of expert designers. From
                    Photoshop magic to 3D masterpieces and memorable logos - we
                    bring your vision to life!
                  </p>
                </FadeInUp>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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
                      size="lg"
                      className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg animate-pulse-glow"
                    >
                      <Link to="/start-project">
                        <WiggleIcon>
                          <Rocket className="w-5 h-5 mr-2" />
                        </WiggleIcon>
                        Start Your Project
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
                    >
                      <Play className="w-5 h-5 mr-2" />
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

      {/* How It Works with Bento Cards */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInUp className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              How It Works
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
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

      {/* Services with Creative Bento Layout */}
      <section className="px-6 py-20 bg-white/20 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto">
          <SlideRotate direction="left" className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Our Magic Services
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Professional design solutions that'll make your competitors
              jealous!
            </p>
          </SlideRotate>

          <BentoGrid>
            {/* Large Photoshop Card */}
            <BentoCard
              size="lg"
              gradient="from-retro-purple/20 via-retro-teal/20 to-retro-purple/20"
              delay={0.2}
            >
              <div className="p-8 h-full flex flex-col">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-retro-purple to-retro-teal rounded-3xl flex items-center justify-center mb-6"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    transition: { duration: 0.6 },
                  }}
                >
                  <Palette className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="font-bold text-3xl text-retro-purple mb-4">
                  Photoshop Design
                </h3>
                <p className="text-retro-purple/80 mb-6 text-lg">
                  Photo editing, compositing, and digital art creation that'll
                  blow your mind!
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
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
                      <CheckCircle className="w-4 h-4 text-retro-teal mr-2" />
                      <span className="text-sm">{feature}</span>
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
                    className="w-full bg-gradient-to-r from-retro-purple to-retro-teal text-white font-semibold"
                  >
                    <Link to="/services">
                      <Camera className="w-4 h-4 mr-2" />
                      Explore Photoshop
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </BentoCard>

            {/* 3D Design Card */}
            <BentoCard
              size="md"
              gradient="from-retro-teal/20 to-retro-mint/20"
              delay={0.3}
            >
              <div className="p-6 h-full flex flex-col">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-retro-teal to-retro-mint rounded-2xl flex items-center justify-center mb-4"
                  animate={{
                    rotateY: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Layers className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-bold text-xl text-retro-purple mb-3">
                  3D Design
                </h3>
                <p className="text-retro-purple/80 mb-4">
                  Mind-blowing 3D modeling and visualization!
                </p>
                <div className="space-y-2 mb-4">
                  {["3D Modeling", "Product Visualization"].map(
                    (feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Sparkles className="w-3 h-3 text-retro-teal mr-2" />
                        {feature}
                      </div>
                    ),
                  )}
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white mt-auto"
                >
                  <Link to="/services">Learn More</Link>
                </Button>
              </div>
            </BentoCard>

            {/* Logo Design Card */}
            <BentoCard
              size="md"
              gradient="from-retro-orange/20 to-retro-peach/20"
              delay={0.4}
            >
              <div className="p-6 h-full flex flex-col">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-retro-orange to-retro-peach rounded-2xl flex items-center justify-center mb-4"
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Brush className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-bold text-xl text-retro-purple mb-3">
                  Logo Design
                </h3>
                <p className="text-retro-purple/80 mb-4">
                  Brand identity that stands out from the crowd!
                </p>
                <div className="space-y-2 mb-4">
                  {["Logo Creation", "Brand Guidelines"].map(
                    (feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Star className="w-3 h-3 text-retro-orange mr-2" />
                        {feature}
                      </div>
                    ),
                  )}
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-retro-orange text-retro-orange hover:bg-retro-orange hover:text-white mt-auto"
                >
                  <Link to="/services">Get Started</Link>
                </Button>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <TiltCard className="bg-gradient-to-br from-retro-purple/10 to-retro-teal/10 rounded-3xl p-12 backdrop-blur-sm border-2 border-retro-purple/20 relative overflow-hidden">
              <motion.h2
                className="font-display text-4xl lg:text-5xl text-retro-purple mb-6 relative z-10"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(267, 50%, 70%, 0.3)",
                    "0 0 40px rgba(267, 50%, 70%, 0.5)",
                    "0 0 20px rgba(267, 50%, 70%, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Ready to Transform Your Ideas?
              </motion.h2>
              <p className="text-xl text-retro-purple/80 mb-8 max-w-2xl mx-auto relative z-10">
                Join hundreds of satisfied clients who trust our expert team
                with their design needs. Let's create something amazing
                together! 🎉
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg animate-pulse-glow"
                  >
                    <Link to="/start-project">
                      <WiggleIcon>
                        <Rocket className="w-5 h-5 mr-2" />
                      </WiggleIcon>
                      Start Your Project Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-8 py-4 rounded-2xl"
                  >
                    <Link to="/portfolio">
                      <Globe className="w-5 h-5 mr-2" />
                      View Our Magic
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </TiltCard>
          </FadeInUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-retro-purple/90 text-white px-6 py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
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
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link to="/services" className="hover:text-white">
                    Photoshop Design
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white">
                    3D Design
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white">
                    Logo Design
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-white">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
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
