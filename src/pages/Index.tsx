import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { BentoGrid, BentoCard, StatBentoCard, FeatureBentoCard, HeroBentoCard } from "@/components/BentoCards";
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
  Users,
  Clock,
  Star,
  Zap,
  Heart,
  Rocket,
  ArrowRight,
  CheckCircle,
  Trophy,
  Target,
  Wand2,
  Crown,
  Gift,
  Camera,
  Brush,
  Scissors,
  Lightbulb,
  MessageCircle,
  Eye,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/30 to-retro-mint/20 relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingElement className="absolute top-20 left-10 w-32 h-32 bg-retro-pink/20 rounded-full blur-2xl" />
      <FloatingElement className="absolute top-60 right-20 w-24 h-24 bg-retro-teal/30 rounded-full blur-xl" />
      <FloatingElement className="absolute bottom-40 left-1/4 w-20 h-20 bg-retro-orange/25 rounded-full blur-lg" />
      <FloatingElement className="absolute top-1/3 right-1/3 w-16 h-16 bg-retro-purple/20 rounded-full blur-md" />

      <Navigation />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <BounceIn className="text-center mb-16">
              <motion.div
                className="inline-flex items-center space-x-2 bg-retro-purple/15 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border-3 border-retro-purple/30"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <WiggleIcon>
                  <Crown className="w-5 h-5 text-retro-purple" />
                </WiggleIcon>
                <span className="font-bold text-retro-purple">Premium Design Studio</span>
                <WiggleIcon>
                  <Sparkles className="w-5 h-5 text-retro-orange" />
                </WiggleIcon>
              </motion.div>
              
              <h1 className="font-display text-6xl lg:text-8xl text-retro-purple mb-8 leading-tight">
                <span className="gradient-text">design requests</span>
              </h1>
              
              <motion.p 
                className="text-2xl lg:text-3xl text-retro-purple/80 mb-12 max-w-4xl mx-auto font-medium leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Transform your vision into stunning reality with our expert design team! 
                <span className="text-retro-orange font-bold"> ✨ Professional • Fast • Magical ✨</span>
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-10 py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl border-3 border-retro-orange/50 animate-pulse-glow"
                  >
                    <Link to="/start-project">
                      <Rocket className="w-6 h-6 mr-3" />
                      Start Your Magic Project
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-3 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-bold px-8 py-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg backdrop-blur-sm bg-white/60"
                  >
                    <Link to="/portfolio">
                      <Eye className="w-5 h-5 mr-2" />
                      View Amazing Work
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </BounceIn>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <StaggerContainer>
              <BentoGrid>
                <StaggerChild>
                  <StatBentoCard
                    stat="500+"
                    label="Projects Completed"
                    icon={Trophy}
                    delay={0}
                  />
                </StaggerChild>
                <StaggerChild>
                  <StatBentoCard
                    stat="15+"
                    label="Expert Designers"
                    icon={Users}
                    delay={0.1}
                  />
                </StaggerChild>
                <StaggerChild>
                  <StatBentoCard
                    stat="24h"
                    label="Average Delivery"
                    icon={Zap}
                    delay={0.2}
                  />
                </StaggerChild>
                <StaggerChild>
                  <StatBentoCard
                    stat="100%"
                    label="Satisfaction Rate"
                    icon={Heart}
                    delay={0.3}
                  />
                </StaggerChild>
              </BentoGrid>
            </StaggerContainer>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <FadeInUp className="text-center mb-16">
              <motion.div
                className="inline-flex items-center space-x-2 bg-retro-teal/15 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-3 border-retro-teal/30"
                whileHover={{ scale: 1.05 }}
              >
                <WiggleIcon>
                  <Wand2 className="w-5 h-5 text-retro-teal" />
                </WiggleIcon>
                <span className="font-bold text-retro-teal">Our Magic Services</span>
              </motion.div>
              <h2 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
                Design Services That <span className="text-retro-orange">Wow!</span>
              </h2>
              <p className="text-xl text-retro-purple/80 max-w-3xl mx-auto">
                From stunning logos to mind-blowing 3D renders - we've got all your design needs covered! 🎨
              </p>
            </FadeInUp>

            <BentoGrid>
              <FeatureBentoCard
                title="Photoshop Magic"
                description="Photo editing, digital art, and compositing that'll make your jaw drop! Transform ordinary images into extraordinary masterpieces."
                icon={Camera}
                gradient="from-retro-purple/80 to-retro-teal/80"
                delay={0}
              />
              <FeatureBentoCard
                title="3D Wizardry"
                description="Mind-bending 3D modeling, rendering, and visualization that brings your wildest ideas to life in stunning detail."
                icon={Layers}
                gradient="from-retro-teal/80 to-retro-mint/80"
                delay={0.1}
              />
              <FeatureBentoCard
                title="Logo Brilliance"
                description="Brand identity and logo design that makes your business unforgettable. Stand out from the crowd with style!"
                icon={Sparkles}
                gradient="from-retro-orange/80 to-retro-peach/80"
                delay={0.2}
              />
              <FeatureBentoCard
                title="Creative Editing"
                description="Video editing, motion graphics, and creative content that captivates and engages your audience like never before."
                icon={Scissors}
                gradient="from-retro-pink/80 to-retro-purple/80"
                delay={0.3}
              />
            </BentoGrid>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-20 bg-gradient-to-r from-retro-purple/10 via-retro-teal/10 to-retro-orange/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <FadeInUp className="text-center mb-16">
              <motion.div
                className="inline-flex items-center space-x-2 bg-retro-orange/15 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-3 border-retro-orange/30"
                whileHover={{ scale: 1.05 }}
              >
                <WiggleIcon>
                  <Lightbulb className="w-5 h-5 text-retro-orange" />
                </WiggleIcon>
                <span className="font-bold text-retro-orange">Simple Process</span>
              </motion.div>
              <h2 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
                How The Magic <span className="text-retro-teal">Happens!</span>
              </h2>
              <p className="text-xl text-retro-purple/80 max-w-3xl mx-auto">
                Getting amazing design work has never been easier! Follow these simple steps to design greatness! 🚀
              </p>
            </FadeInUp>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Share Your Vision",
                  description: "Tell us about your project, upload inspiration, and let us know your style preferences. The more details, the better!",
                  icon: MessageCircle,
                  gradient: "from-retro-purple to-retro-teal",
                },
                {
                  step: "02", 
                  title: "We Work Our Magic",
                  description: "Our expert designers get to work, crafting your vision with professional tools and creative expertise. Sit back and relax!",
                  icon: Brush,
                  gradient: "from-retro-teal to-retro-mint",
                },
                {
                  step: "03",
                  title: "Receive Amazing Results",
                  description: "Get your stunning design delivered fast! We include revisions to make sure everything is absolutely perfect.",
                  icon: Gift,
                  gradient: "from-retro-orange to-retro-peach",
                },
              ].map((step, index) => (
                <SlideRotate
                  key={index}
                  delay={index * 0.2}
                  direction={index % 2 === 0 ? "left" : "right"}
                >
                  <TiltCard className="h-full">
                    <Card className="border-3 border-retro-purple/30 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                      <CardContent className="p-8 text-center h-full flex flex-col">
                        <motion.div
                          className="relative mb-6"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-3xl mx-auto flex items-center justify-center shadow-lg`}>
                            <step.icon className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-retro-orange rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                            <span className="font-bold text-white text-sm">{step.step}</span>
                          </div>
                        </motion.div>
                        <h3 className="font-display text-2xl text-retro-purple mb-4">
                          {step.title}
                        </h3>
                        <p className="text-retro-purple/80 flex-1 leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </SlideRotate>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Preview */}
        <section id="portfolio" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <FadeInUp className="text-center mb-16">
              <motion.div
                className="inline-flex items-center space-x-2 bg-retro-pink/15 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-3 border-retro-pink/30"
                whileHover={{ scale: 1.05 }}
              >
                <WiggleIcon>
                  <Star className="w-5 h-5 text-retro-pink" />
                </WiggleIcon>
                <span className="font-bold text-retro-pink">Amazing Work</span>
              </motion.div>
              <h2 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
                Portfolio <span className="text-retro-pink">Showcase!</span>
              </h2>
              <p className="text-xl text-retro-purple/80 max-w-3xl mx-auto mb-8">
                Check out some of our incredible design transformations! Each project tells a story of creativity and excellence. ✨
              </p>
            </FadeInUp>

            <HeroBentoCard delay={0.2}>
              <div className="p-12 text-center h-full flex flex-col justify-center">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Eye className="w-24 h-24 text-retro-purple/40 mx-auto mb-8" />
                </motion.div>
                <h3 className="font-display text-4xl text-retro-purple mb-6">
                  Interactive Portfolio Coming Soon! 🎨
                </h3>
                <p className="text-xl text-retro-purple/80 mb-8 max-w-2xl mx-auto">
                  Get ready for an amazing interactive showcase with before/after sliders, 
                  3D previews, and stunning animations that demonstrate our design magic!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-bold px-8 py-4 rounded-2xl shadow-xl"
                    >
                      <Link to="/portfolio">
                        <Eye className="w-5 h-5 mr-2" />
                        Explore Portfolio
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      asChild
                      variant="outline"
                      className="border-3 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-bold px-8 py-4 rounded-2xl"
                    >
                      <Link to="/start-project">
                        <Rocket className="w-5 h-5 mr-2" />
                        Start Your Project
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </HeroBentoCard>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-6 py-20 bg-gradient-to-r from-retro-mint/10 via-retro-teal/10 to-retro-purple/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <FadeInUp>
                <motion.div
                  className="inline-flex items-center space-x-2 bg-retro-mint/15 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-3 border-retro-mint/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <WiggleIcon>
                    <Users className="w-5 h-5 text-retro-teal" />
                  </WiggleIcon>
                  <span className="font-bold text-retro-teal">About Our Team</span>
                </motion.div>
                <h2 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
                  Meet The <span className="text-retro-teal">Dream Team!</span>
                </h2>
                <p className="text-xl text-retro-purple/80 mb-8 leading-relaxed">
                  We're a passionate team of 15+ expert designers from around the world, 
                  united by our love for creating stunning visual experiences. Every project 
                  gets our full attention and creative energy! 🌟
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { number: "500+", label: "Happy Clients" },
                    { number: "15+", label: "Expert Designers" },
                    { number: "24h", label: "Avg Delivery" },
                    { number: "100%", label: "Satisfaction" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border-3 border-retro-teal/30"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="font-display text-3xl text-retro-purple mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-retro-purple/70 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-retro-teal to-retro-mint text-white font-bold px-8 py-4 rounded-2xl shadow-xl"
                  >
                    <Link to="/about">
                      <Users className="w-5 h-5 mr-2" />
                      Learn More About Us
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </FadeInUp>

              <JumpIn delay={0.3}>
                <div className="relative">
                  <motion.div
                    className="w-full h-96 bg-gradient-to-br from-retro-purple/20 to-retro-teal/20 rounded-3xl border-3 border-retro-purple/30 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <motion.div
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
                      <Palette className="w-32 h-32 text-retro-purple/40" />
                    </motion.div>
                  </motion.div>
                  <FloatingElement className="absolute -top-4 -right-4 w-16 h-16 bg-retro-orange/30 rounded-full blur-lg" />
                  <FloatingElement className="absolute -bottom-4 -left-4 w-12 h-12 bg-retro-pink/30 rounded-full blur-md" />
                </div>
              </JumpIn>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <FadeInUp className="text-center mb-16">
              <motion.div
                className="inline-flex items-center space-x-2 bg-retro-orange/15 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-3 border-retro-orange/30"
                whileHover={{ scale: 1.05 }}
              >
                <WiggleIcon>
                  <Phone className="w-5 h-5 text-retro-orange" />
                </WiggleIcon>
                <span className="font-bold text-retro-orange">Get In Touch</span>
              </motion.div>
              <h2 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
                Ready To Start Your <span className="text-retro-orange">Design Journey?</span>
              </h2>
              <p className="text-xl text-retro-purple/80 max-w-3xl mx-auto mb-12">
                Let's bring your vision to life! Our team is excited to work with you and create something absolutely amazing! 🎨✨
              </p>
            </FadeInUp>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <BounceIn delay={0.2}>
                <TiltCard>
                  <Card className="border-3 border-retro-purple/30 bg-white/70 backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-10 text-center">
                      <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-retro-orange to-retro-peach rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Rocket className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="font-display text-3xl text-retro-purple mb-6">
                        Start Your Project Now!
                      </h3>
                      <p className="text-lg text-retro-purple/80 mb-8">
                        Ready to transform your ideas into stunning reality? 
                        Our intelligent project wizard will guide you through every step!
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          asChild
                          size="lg"
                          className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-10 py-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-xl animate-pulse-glow"
                        >
                          <Link to="/start-project">
                            <Sparkles className="w-6 h-6 mr-3" />
                            Begin The Magic
                            <ArrowRight className="w-6 h-6 ml-3" />
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </BounceIn>

              <SlideRotate delay={0.4} direction="right">
                <TiltCard>
                  <Card className="border-3 border-retro-teal/30 bg-white/70 backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-10 text-center">
                      <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-retro-teal to-retro-mint rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl"
                        whileHover={{ rotate: -360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <MessageCircle className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="font-display text-3xl text-retro-purple mb-6">
                        Have Questions?
                      </h3>
                      <p className="text-lg text-retro-purple/80 mb-8">
                        Our friendly team is here to help! Get in touch and we'll 
                        answer all your questions about our design services.
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="border-3 border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white font-bold px-10 py-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-xl"
                        >
                          <Link to="/contact">
                            <Heart className="w-6 h-6 mr-3" />
                            Contact Our Team
                            <ArrowRight className="w-6 h-6 ml-3" />
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </SlideRotate>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-retro-purple/90 to-retro-teal/90 backdrop-blur-sm text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-8 mb-12">
              <div>
                <motion.div
                  className="flex items-center space-x-3 mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl">design requests</h3>
                    <p className="text-sm opacity-80">Expert Design Studio</p>
                  </div>
                </motion.div>
                <p className="text-white/80 leading-relaxed">
                  Transforming visions into stunning reality with our expert design team. 
                  Professional, fast, and absolutely magical! ✨
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">Services</h4>
                <ul className="space-y-2 text-white/80">
                  <li><Link to="/services" className="hover:text-white transition-colors">Photoshop Design</Link></li>
                  <li><Link to="/services" className="hover:text-white transition-colors">3D Design</Link></li>
                  <li><Link to="/services" className="hover:text-white transition-colors">Logo Design</Link></li>
                  <li><Link to="/services" className="hover:text-white transition-colors">Creative Editing</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">Company</h4>
                <ul className="space-y-2 text-white/80">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">Legal</h4>
                <ul className="space-y-2 text-white/80">
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/disputes" className="hover:text-white transition-colors">Dispute Resolution</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-8 text-center">
              <p className="text-white/80">
                © 2025 design requests. All rights reserved. Made with{" "}
                <Heart className="w-4 h-4 inline text-retro-peach" /> by our amazing team!
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;