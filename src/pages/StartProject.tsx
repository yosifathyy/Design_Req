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
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-retro-purple/10 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-retro-purple" />
              <span className="text-sm font-medium text-retro-purple">
                AI-Powered Brief Generator
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Start Your Design Project
            </h1>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Our intelligent system will help you create the perfect project
              brief for our expert designers
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                    step >= num
                      ? "bg-retro-purple text-white"
                      : "bg-retro-purple/20 text-retro-purple/60"
                  }`}
                >
                  {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                </div>
              ))}
            </div>
            <div className="w-full bg-retro-purple/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-retro-purple to-retro-teal h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              {/* Step 1: Project Type */}
              {step === 1 && (
                <div>
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-display text-2xl text-retro-purple mb-2">
                      What type of design do you need?
                    </CardTitle>
                    <p className="text-retro-purple/80">
                      Choose the service that best fits your project needs
                    </p>
                  </CardHeader>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {projectTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                          projectType === type.id
                            ? "border-retro-purple bg-retro-purple/5"
                            : "border-retro-purple/20 hover:border-retro-purple/40"
                        }`}
                        onClick={() => setProjectType(type.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl mx-auto mb-4 flex items-center justify-center`}
                          >
                            <type.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-lg text-retro-purple mb-2">
                            {type.title}
                          </h3>
                          <p className="text-sm text-retro-purple/70">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {step === 2 && (
                <div>
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-display text-2xl text-retro-purple mb-2">
                      Tell us about your project
                    </CardTitle>
                    <p className="text-retro-purple/80">
                      Provide details so we can match you with the right
                      designer
                    </p>
                  </CardHeader>

                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="projectName"
                        className="text-retro-purple font-medium"
                      >
                        Project Name
                      </Label>
                      <Input
                        id="projectName"
                        placeholder="e.g., Logo for tech startup"
                        value={formData.projectName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectName: e.target.value,
                          })
                        }
                        className="mt-2 border-retro-purple/30 focus:border-retro-purple"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="description"
                        className="text-retro-purple font-medium"
                      >
                        Project Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your vision, goals, and any specific requirements..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="mt-2 border-retro-purple/30 focus:border-retro-purple resize-none"
                      />
                    </div>

                    <div>
                      <Label className="text-retro-purple font-medium">
                        Style Preference
                      </Label>
                      <Select
                        value={formData.style}
                        onValueChange={(value) =>
                          setFormData({ ...formData, style: value })
                        }
                      >
                        <SelectTrigger className="mt-2 border-retro-purple/30">
                          <SelectValue placeholder="Choose a style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern & Clean</SelectItem>
                          <SelectItem value="retro">Retro & Vintage</SelectItem>
                          <SelectItem value="playful">Playful & Fun</SelectItem>
                          <SelectItem value="professional">
                            Professional & Corporate
                          </SelectItem>
                          <SelectItem value="artistic">
                            Artistic & Creative
                          </SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Timeline & Budget */}
              {step === 3 && (
                <div>
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-display text-2xl text-retro-purple mb-2">
                      Timeline & Budget
                    </CardTitle>
                    <p className="text-retro-purple/80">
                      Help us understand your project constraints
                    </p>
                  </CardHeader>

                  <div className="space-y-8">
                    <div>
                      <Label className="text-retro-purple font-medium mb-4 block">
                        <Clock className="w-4 h-4 inline mr-2" />
                        When do you need this completed?
                      </Label>
                      <RadioGroup
                        value={formData.timeline}
                        onValueChange={(value) =>
                          setFormData({ ...formData, timeline: value })
                        }
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="rush" id="rush" />
                          <Label
                            htmlFor="rush"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              Rush (24h)
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              Express delivery
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label
                            htmlFor="standard"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              Standard (3-5 days)
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              Regular timeline
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="flexible" id="flexible" />
                          <Label
                            htmlFor="flexible"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              Flexible (1-2 weeks)
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              No rush needed
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="large" id="large" />
                          <Label
                            htmlFor="large"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              Large Project (2-4 weeks)
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              Complex work
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-retro-purple font-medium mb-4 block">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        What's your budget range?
                      </Label>
                      <RadioGroup
                        value={formData.budget}
                        onValueChange={(value) =>
                          setFormData({ ...formData, budget: value })
                        }
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="50-150" id="budget1" />
                          <Label
                            htmlFor="budget1"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              $50 - $150
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              Basic projects
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="150-300" id="budget2" />
                          <Label
                            htmlFor="budget2"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              $150 - $300
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              Standard work
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="300-500" id="budget3" />
                          <Label
                            htmlFor="budget3"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              $300 - $500
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              Premium quality
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border border-retro-purple/30 rounded-lg">
                          <RadioGroupItem value="500+" id="budget4" />
                          <Label
                            htmlFor="budget4"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-retro-purple">
                              $500+
                            </div>
                            <div className="text-sm text-retro-purple/70">
                              Complex projects
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: File Upload */}
              {step === 4 && (
                <div>
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-display text-2xl text-retro-purple mb-2">
                      Upload Reference Files
                    </CardTitle>
                    <p className="text-retro-purple/80">
                      Share any reference materials, existing files, or
                      inspiration
                    </p>
                  </CardHeader>

                  <div className="space-y-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-retro-purple/30 rounded-lg p-8 text-center hover:border-retro-purple/50 transition-colors">
                      <Upload className="w-12 h-12 text-retro-purple/40 mx-auto mb-4" />
                      <h3 className="font-medium text-retro-purple mb-2">
                        Drop files here or click to upload
                      </h3>
                      <p className="text-sm text-retro-purple/70 mb-4">
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
                      <Button
                        asChild
                        variant="outline"
                        className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
                      >
                        <label htmlFor="fileUpload" className="cursor-pointer">
                          <FileText className="w-4 h-4 mr-2" />
                          Choose Files
                        </label>
                      </Button>
                    </div>

                    {/* Uploaded Files */}
                    {formData.files.length > 0 && (
                      <div>
                        <h4 className="font-medium text-retro-purple mb-3">
                          Uploaded Files ({formData.files.length})
                        </h4>
                        <div className="space-y-2">
                          {formData.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-retro-purple/5 rounded-lg border border-retro-purple/20"
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className="w-4 h-4 text-retro-purple" />
                                <span className="text-sm text-retro-purple">
                                  {file.name}
                                </span>
                                <span className="text-xs text-retro-purple/60">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-retro-purple/60 hover:text-retro-purple"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-retro-purple/20">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !projectType) ||
                      (step === 2 &&
                        (!formData.projectName || !formData.description)) ||
                      (step === 3 && (!formData.timeline || !formData.budget))
                    }
                    className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-semibold px-6 py-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Submit Project
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <Card className="border-2 border-retro-teal/20 bg-retro-teal/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-retro-purple mb-2">
                  Need Help Getting Started?
                </h3>
                <p className="text-retro-purple/80 mb-4">
                  Our team is here to help you create the perfect project brief
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white"
                >
                  <Link to="/contact">Contact Our Team</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartProject;
