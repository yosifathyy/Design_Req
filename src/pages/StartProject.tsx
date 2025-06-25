import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navigation from "@/components/Navigation";
import { BentoGrid, BentoCard } from "@/components/BentoCards";
import {
  FadeInUp,
  BounceIn,
  WiggleIcon,
  TiltCard,
  FloatingElement,
} from "@/components/AnimatedElements";
import {
  Sparkles,
  Upload,
  Zap,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Palette,
  Layers,
  Clock,
  DollarSign,
  Wand2,
  Rocket,
  Star,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const StartProject = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    style: "",
    timeline: "",
    budget: "",
    files: [] as File[],
  });

  const projectTypes = [
    {
      id: "photoshop",
      title: "Photoshop Design",
      description: "Photo editing, compositing, digital art",
      icon: Palette,
      gradient: "from-retro-purple to-retro-teal",
    },
    {
      id: "3d",
      title: "3D Design",
      description: "3D modeling, rendering, visualization",
      icon: Layers,
      gradient: "from-retro-teal to-retro-mint",
    },
    {
      id: "logo",
      title: "Logo Design",
      description: "Brand identity and logo creation",
      icon: Sparkles,
      gradient: "from-retro-orange to-retro-peach",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        files: [...formData.files, ...Array.from(e.target.files)],
      });
    }
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30 relative overflow-hidden">
      <CartoonyCursor />

      {/* Floating background elements */}
      <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-retro-pink/20 rounded-full blur-xl" />
      <FloatingElement className="absolute top-40 right-20 w-16 h-16 bg-retro-teal/30 rounded-full blur-lg" />
      <FloatingElement className="absolute bottom-20 left-1/4 w-12 h-12 bg-retro-orange/20 rounded-full blur-md" />

      <Navigation />

      <div className="px-6 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <BounceIn className="text-center mb-12">
            <motion.div
              className="inline-flex items-center space-x-2 bg-retro-purple/10 px-4 py-2 rounded-full mb-6"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <WiggleIcon>
                <Zap className="w-4 h-4 text-retro-purple" />
              </WiggleIcon>
              <span className="text-sm font-medium text-retro-purple">
                AI-Powered Brief Generator
              </span>
            </motion.div>
            <h1 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Start Your Design Project
            </h1>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Our intelligent system will help you create the perfect project
              brief for our expert designers! ✨
            </p>
          </BounceIn>

          {/* Progress Bar */}
          <FadeInUp delay={0.2} className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((num) => (
                <motion.div
                  key={num}
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
                    step >= num
                      ? "bg-retro-purple text-white"
                      : "bg-retro-purple/20 text-retro-purple/60"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  animate={step === num ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: step === num ? 2 : 0 }}
                >
                  {step > num ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    num
                  )}
                </motion.div>
              ))}
            </div>
            <div className="w-full bg-retro-purple/20 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-retro-purple to-retro-teal h-3 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </FadeInUp>

          {/* Step Content in Bento Layout */}
          <TiltCard className="border-3 border-retro-purple/30 bg-white/60 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-8">
              {/* Step 1: Project Type */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BounceIn>
                    <h2 className="font-display text-3xl text-retro-purple mb-3 text-center">
                      What type of design magic do you need? 🎨
                    </h2>
                    <p className="text-retro-purple/80 text-center mb-8">
                      Choose the service that best fits your project needs
                    </p>
                  </BounceIn>

                  <BentoGrid className="grid-cols-1 md:grid-cols-3">
                    {projectTypes.map((type, index) => (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TiltCard
                          className={`cursor-pointer transition-all duration-300 border-3 hover:shadow-xl ${
                            projectType === type.id
                              ? "border-retro-purple bg-retro-purple/10 shadow-2xl"
                              : "border-retro-purple/30 hover:border-retro-purple/60"
                          }`}
                          onClick={() => setProjectType(type.id)}
                        >
                          <Card className="border-0 bg-transparent">
                            <CardContent className="p-6 text-center">
                              <motion.div
                                className={`w-20 h-20 bg-gradient-to-br ${type.gradient} rounded-3xl mx-auto mb-4 flex items-center justify-center`}
                                whileHover={{
                                  rotate: 360,
                                  scale: 1.1,
                                }}
                                transition={{ duration: 0.6 }}
                              >
                                <type.icon className="w-10 h-10 text-white" />
                              </motion.div>
                              <h3 className="font-bold text-xl text-retro-purple mb-2">
                                {type.title}
                              </h3>
                              <p className="text-sm text-retro-purple/70">
                                {type.description}
                              </p>
                              {projectType === type.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="mt-3"
                                >
                                  <CheckCircle className="w-6 h-6 text-retro-purple mx-auto" />
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </TiltCard>
                      </motion.div>
                    ))}
                  </BentoGrid>
                </motion.div>
              )}

              {/* Step 2: Project Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BounceIn>
                    <h2 className="font-display text-3xl text-retro-purple mb-3 text-center">
                      Tell us about your amazing project! 🚀
                    </h2>
                    <p className="text-retro-purple/80 text-center mb-8">
                      The more details you share, the better we can match you
                      with the perfect designer
                    </p>
                  </BounceIn>

                  <div className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label
                        htmlFor="projectName"
                        className="text-retro-purple font-bold text-lg mb-3 block"
                      >
                        Project Name ✨
                      </Label>
                      <Input
                        id="projectName"
                        placeholder="e.g., Logo for tech startup that'll change the world!"
                        value={formData.projectName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectName: e.target.value,
                          })
                        }
                        className="border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl py-3 text-lg"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label
                        htmlFor="description"
                        className="text-retro-purple font-bold text-lg mb-3 block"
                      >
                        Project Description 📝
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your vision, goals, and any specific requirements. Don't hold back - we love creative details!"
                        rows={5}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl resize-none text-lg"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label className="text-retro-purple font-bold text-lg mb-3 block">
                        Style Preference 🎨
                      </Label>
                      <Select
                        value={formData.style}
                        onValueChange={(value) =>
                          setFormData({ ...formData, style: value })
                        }
                      >
                        <SelectTrigger className="border-3 border-retro-purple/30 rounded-2xl py-3 text-lg">
                          <SelectValue placeholder="Choose your vibe!" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">
                            Modern & Clean 🏢
                          </SelectItem>
                          <SelectItem value="retro">
                            Retro & Vintage 📼
                          </SelectItem>
                          <SelectItem value="playful">
                            Playful & Fun 🎈
                          </SelectItem>
                          <SelectItem value="professional">
                            Professional & Corporate 💼
                          </SelectItem>
                          <SelectItem value="artistic">
                            Artistic & Creative 🎭
                          </SelectItem>
                          <SelectItem value="minimalist">
                            Minimalist 🕳️
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Timeline & Budget */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BounceIn>
                    <h2 className="font-display text-3xl text-retro-purple mb-3 text-center">
                      Timeline & Budget Magic! ⏰💰
                    </h2>
                    <p className="text-retro-purple/80 text-center mb-8">
                      Help us understand your project constraints so we can work
                      our magic perfectly
                    </p>
                  </BounceIn>

                  <div className="space-y-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label className="text-retro-purple font-bold text-xl mb-6 block flex items-center">
                        <Clock className="w-6 h-6 mr-2" />
                        When do you need this completed? 🏃‍♂️
                      </Label>
                      <RadioGroup
                        value={formData.timeline}
                        onValueChange={(value) =>
                          setFormData({ ...formData, timeline: value })
                        }
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {[
                          {
                            value: "rush",
                            title: "Rush (24h) ⚡",
                            description: "Need it yesterday? We got you!",
                            emoji: "🚀",
                          },
                          {
                            value: "standard",
                            title: "Standard (3-5 days) 📅",
                            description: "Perfect balance of speed & quality",
                            emoji: "⭐",
                          },
                          {
                            value: "flexible",
                            title: "Flexible (1-2 weeks) 🌱",
                            description: "No rush, take your time",
                            emoji: "🌸",
                          },
                          {
                            value: "large",
                            title: "Large Project (2-4 weeks) 🏗️",
                            description: "Complex masterpiece incoming",
                            emoji: "🎨",
                          },
                        ].map((option, index) => (
                          <motion.div
                            key={option.value}
                            className="flex items-center space-x-3 p-6 border-3 border-retro-purple/30 rounded-2xl hover:border-retro-purple/60 transition-all duration-300 hover:shadow-lg cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                            />
                            <div className="text-3xl">{option.emoji}</div>
                            <Label
                              htmlFor={option.value}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-bold text-retro-purple text-lg">
                                {option.title}
                              </div>
                              <div className="text-retro-purple/70">
                                {option.description}
                              </div>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label className="text-retro-purple font-bold text-xl mb-6 block flex items-center">
                        <DollarSign className="w-6 h-6 mr-2" />
                        What's your budget range? 💸
                      </Label>
                      <RadioGroup
                        value={formData.budget}
                        onValueChange={(value) =>
                          setFormData({ ...formData, budget: value })
                        }
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {[
                          {
                            value: "50-150",
                            title: "$50 - $150 💫",
                            description: "Perfect for basic magic",
                            emoji: "✨",
                          },
                          {
                            value: "150-300",
                            title: "$150 - $300 🌟",
                            description: "Standard wizardry level",
                            emoji: "🎯",
                          },
                          {
                            value: "300-500",
                            title: "$300 - $500 🔥",
                            description: "Premium spell casting",
                            emoji: "💎",
                          },
                          {
                            value: "500+",
                            title: "$500+ 🚀",
                            description: "Master-level sorcery",
                            emoji: "👑",
                          },
                        ].map((option, index) => (
                          <motion.div
                            key={option.value}
                            className="flex items-center space-x-3 p-6 border-3 border-retro-purple/30 rounded-2xl hover:border-retro-purple/60 transition-all duration-300 hover:shadow-lg cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                            />
                            <div className="text-3xl">{option.emoji}</div>
                            <Label
                              htmlFor={option.value}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-bold text-retro-purple text-lg">
                                {option.title}
                              </div>
                              <div className="text-retro-purple/70">
                                {option.description}
                              </div>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: File Upload */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BounceIn>
                    <h2 className="font-display text-3xl text-retro-purple mb-3 text-center">
                      Share Your Inspiration! 📁✨
                    </h2>
                    <p className="text-retro-purple/80 text-center mb-8">
                      Upload any reference materials, existing files, or
                      inspiration that'll help us create magic!
                    </p>
                  </BounceIn>

                  <div className="space-y-8">
                    {/* Upload Area */}
                    <motion.div
                      className="border-3 border-dashed border-retro-purple/30 rounded-2xl p-12 text-center hover:border-retro-purple/60 transition-all duration-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-retro-purple/5 to-retro-teal/5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Upload className="w-16 h-16 text-retro-purple/60 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="font-bold text-xl text-retro-purple mb-3">
                        Drop files here or click to upload! 🎯
                      </h3>
                      <p className="text-retro-purple/70 mb-6">
                        Support for images, PDFs, documents (max 10MB each)
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="fileUpload"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          asChild
                          className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-3 rounded-2xl"
                        >
                          <label
                            htmlFor="fileUpload"
                            className="cursor-pointer"
                          >
                            <FileText className="w-5 h-5 mr-2" />
                            Choose Amazing Files
                          </label>
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Uploaded Files */}
                    {formData.files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h4 className="font-bold text-xl text-retro-purple mb-4 flex items-center">
                          <Star className="w-5 h-5 mr-2" />
                          Uploaded Files ({formData.files.length}) 🎉
                        </h4>
                        <div className="space-y-3">
                          {formData.files.map((file, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center justify-between p-4 bg-retro-purple/10 rounded-2xl border-2 border-retro-purple/20 hover:shadow-lg transition-all duration-300"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-retro-purple" />
                                <span className="font-medium text-retro-purple">
                                  {file.name}
                                </span>
                                <span className="text-sm text-retro-purple/60 bg-retro-purple/10 px-2 py-1 rounded-full">
                                  {(file.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-retro-purple/60 hover:text-retro-purple hover:bg-retro-purple/10"
                                >
                                  Remove
                                </Button>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <motion.div
                className="flex justify-between items-center mt-12 pt-8 border-t-2 border-retro-purple/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-6 py-3 rounded-2xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                </motion.div>

                {step < 4 ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={nextStep}
                      disabled={
                        (step === 1 && !projectType) ||
                        (step === 2 &&
                          (!formData.projectName || !formData.description)) ||
                        (step === 3 && (!formData.timeline || !formData.budget))
                      }
                      className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg animate-pulse-glow">
                      <WiggleIcon>
                        <Rocket className="w-5 h-5 mr-2" />
                      </WiggleIcon>
                      Submit Project Magic!
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </TiltCard>

          {/* Help Section */}
          <FadeInUp delay={0.6} className="mt-12 text-center">
            <TiltCard className="border-3 border-retro-teal/30 bg-retro-teal/10 backdrop-blur-sm rounded-2xl">
              <Card className="border-0 bg-transparent">
                <CardContent className="p-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Wand2 className="w-12 h-12 text-retro-teal mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-bold text-2xl text-retro-purple mb-3">
                    Need Help Getting Started? 🤝
                  </h3>
                  <p className="text-retro-purple/80 mb-6 text-lg">
                    Our team of design wizards is here to help you create the
                    perfect project brief!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="border-2 border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white font-bold px-8 py-3 rounded-2xl"
                    >
                      <Link to="/contact">
                        <Heart className="w-4 h-4 mr-2" />
                        Contact Our Magic Team
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </TiltCard>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};

export default StartProject;
