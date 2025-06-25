import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import CartoonyCursor from "@/components/CartoonyCursor";
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
      <CartoonyCursor />

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
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                  {["Logo Creation", "Brand Guidelines"].map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Star className="w-3 h-3 text-retro-orange mr-2" />
                      {feature}
                    </div>
                  ))}
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

      {/* Portfolio Showcase */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <JumpIn className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Portfolio Magic
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              See the transformative power of our expert design wizards!
            </p>
          </JumpIn>

          <BentoGrid>
            <BentoCard
              size="lg"
              gradient="from-retro-purple/10 via-retro-teal/10 to-retro-orange/10"
              delay={0.2}
            >
              <div className="p-8 h-full flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-retro-orange to-retro-peach rounded-2xl flex items-center justify-center"
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
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-2xl text-retro-purple">
                      Before & After Showcase
                    </h3>
                    <p className="text-retro-purple/70">
                      Interactive transformations that'll amaze you!
                    </p>
                  </div>
                </div>
                <p className="text-lg text-retro-purple/80 mb-6">
                  Experience our interactive before & after showcase tool that
                  demonstrates the transformative power of our design expertise.
                  From rough concepts to polished masterpieces!
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-semibold px-6 py-3 rounded-xl w-fit"
                  >
                    <Link to="/portfolio">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Portfolio Magic
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </BentoCard>

            <BentoCard size="md" delay={0.3}>
              <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                <motion.div
                  className="aspect-video bg-gradient-to-br from-retro-cream to-white rounded-2xl flex items-center justify-center mb-4 w-full border-2 border-retro-purple/20"
                  whileHover={{
                    scale: 1.05,
                    rotateY: 10,
                  }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Play className="w-12 h-12 text-retro-purple/40 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-retro-purple/60 font-medium text-sm">
                      Interactive Preview
                    </p>
                  </div>
                </motion.div>
                <p className="text-sm text-retro-purple/70">
                  Hover to see the magic happen!
                </p>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-6 py-20 bg-white/20 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto">
          <SlideRotate direction="right" className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Happy Clients Everywhere!
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Real feedback from satisfied clients around the globe!
            </p>
          </SlideRotate>

          <StaggerContainer>
            <BentoGrid>
              {[
                {
                  name: "Sarah Johnson",
                  role: "Marketing Director",
                  company: "TechStart Inc.",
                  content:
                    "The quality and speed blew our minds! Our brand identity project was completed in record time. 🚀",
                  rating: 5,
                  avatar: "bg-retro-purple",
                },
                {
                  name: "Mike Chen",
                  role: "E-commerce Owner",
                  company: "Digital Goods Co.",
                  content:
                    "Amazing 3D visualizations boosted our conversion rates by 40%! These designers are wizards! ✨",
                  rating: 5,
                  avatar: "bg-retro-teal",
                },
                {
                  name: "Emma Rodriguez",
                  role: "Content Creator",
                  company: "Creative Studios",
                  content:
                    "Professional Photoshop work transformed our social media presence. The team gets our vision perfectly! 💯",
                  rating: 5,
                  avatar: "bg-retro-orange",
                },
              ].map((testimonial, index) => (
                <StaggerChild key={index}>
                  <BentoCard size="md" delay={index * 0.1}>
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.1,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Star className="w-4 h-4 text-retro-orange fill-current" />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-retro-purple/80 mb-6 italic flex-1">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <motion.div
                          className={`w-12 h-12 ${testimonial.avatar} rounded-full flex items-center justify-center mr-4`}
                          whileHover={{
                            scale: 1.2,
                            rotate: 360,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="text-white font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </span>
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-retro-purple">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-retro-purple/70">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoCard>
                </StaggerChild>
              ))}
            </BentoGrid>
          </StaggerContainer>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <BounceIn className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Why We're Absolutely Amazing
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              We're not just another marketplace - we're your dedicated design
              dream team! 🎨
            </p>
          </BounceIn>

          <BentoGrid>
            <BentoCard
              size="lg"
              gradient="from-retro-lavender/20 to-retro-mint/20"
              delay={0.2}
            >
              <div className="p-8 h-full flex items-center">
                <div className="w-1/2 space-y-6">
                  {[
                    {
                      icon: Shield,
                      title: "Curated Expert Team",
                      description:
                        "Hand-picked professionals with proven track records, not random freelancers.",
                    },
                    {
                      icon: Clock,
                      title: "Lightning Fast",
                      description:
                        "Average 24-hour turnaround with our streamlined workflow.",
                    },
                    {
                      icon: Award,
                      title: "Quality Guaranteed",
                      description:
                        "Every project goes through our quality control process.",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-retro-orange to-retro-peach rounded-xl flex items-center justify-center flex-shrink-0"
                        whileHover={{
                          rotate: 360,
                          scale: 1.2,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg text-retro-purple mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-retro-purple/80 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="w-1/2 flex justify-center">
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-48 h-48 bg-gradient-to-br from-retro-purple to-retro-teal rounded-3xl flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Users className="w-24 h-24 text-white" />
                      </motion.div>
                      {/* Floating sparkles */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </div>
                    <motion.div
                      className="absolute -bottom-4 -right-4 bg-retro-orange rounded-2xl p-3"
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Wand2 className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </BentoCard>

            <StatBentoCard
              stat="15+"
              label="Expert Designers"
              icon={Users}
              delay={0.3}
            />
            <StatBentoCard
              stat="100%"
              label="Satisfaction Rate"
              icon={Heart}
              delay={0.4}
            />
          </BentoGrid>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <TiltCard className="bg-gradient-to-br from-retro-purple/10 to-retro-teal/10 rounded-3xl p-12 backdrop-blur-sm border-2 border-retro-purple/20 relative overflow-hidden">
              {/* Animated background elements */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(267, 50%, 70%, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(182, 44%, 56%, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(267, 50%, 70%, 0.1) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 2px, transparent 2px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="grid lg:grid-cols-4 gap-8 mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.div
                className="flex items-center space-x-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
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

            {[
              {
                title: "Services",
                links: [
                  "Photoshop Design",
                  "3D Design",
                  "Logo Design",
                  "Brand Identity",
                ],
              },
              {
                title: "Company",
                links: ["About Us", "Portfolio", "Contact", "Careers"],
              },
              {
                title: "Legal",
                links: [
                  "Terms of Service",
                  "Privacy Policy",
                  "Dispute Resolution",
                  "Refund Policy",
                ],
              },
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-white/80">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      whileHover={{ x: 5, color: "#ffffff" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to="/services" className="hover:text-white">
                        {link}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border-t border-white/20 pt-8 text-center text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;