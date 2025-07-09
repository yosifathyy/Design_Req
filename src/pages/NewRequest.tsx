import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import {
  createDesignRequest,
  uploadFile,
  saveFileMetadata,
  updateUserXP,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { designCategories } from "@/lib/dashboard-data";
import {
  Upload,
  X,
  FileText,
  Image,
  Video,
  File,
  CheckCircle,
  Sparkles,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const NewRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!containerRef.current || !formRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    const sections = formRef.current.querySelectorAll(".form-section");
    tl.fromTo(
      sections,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.3",
    );
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    // Animate file additions
    setTimeout(() => {
      const newFileElements = document.querySelectorAll(
        ".file-item:nth-last-child(-n+" + newFiles.length + ")",
      );
      gsap.fromTo(
        newFileElements,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
      );
    }, 50);
  };

  const removeFile = (index: number) => {
    const fileElement = document.querySelector(
      `.file-item:nth-child(${index + 1})`,
    );
    if (fileElement) {
      gsap.to(fileElement, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setFiles((prev) => prev.filter((_, i) => i !== index));
        },
      });
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (file.type.startsWith("video/")) return <Video className="w-6 h-6" />;
    if (file.type.includes("pdf")) return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      gsap.to(formRef.current, {
        x: "-10px, 10px, -10px, 10px, 0px",
        duration: 0.4,
        ease: "power2.inOut",
      });
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the design request
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: "submitted",
        user_id: user.id,
        price: calculatePrice(formData.category, formData.priority),
      };

      const newRequest = await createDesignRequest(requestData);

      // 2. Upload files if any
      const filePromises = files.map(async (file) => {
        const { path, url } = await uploadFile(
          file,
          `requests/${newRequest.id}`,
        );

        // Save file metadata
        return saveFileMetadata({
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          request_id: newRequest.id,
          uploaded_by: user.id,
        });
      });

      if (files.length > 0) {
        await Promise.all(filePromises);
      }

      // 3. Award XP to the user
      await updateUserXP(user.id, 10);

      // Success handling below
    } catch (error: any) {
      console.error("Error creating request:", error?.message || error);
      setIsSubmitting(false);

      // Show user-friendly error message
      const errorMessage =
        error?.message ||
        "An unexpected error occurred while creating your request.";

      // Create error notification
      const errorEl = document.createElement("div");
      errorEl.className =
        "fixed top-4 right-4 z-50 bg-red-50 border-2 border-red-500 p-4 rounded-lg shadow-lg max-w-md";
      errorEl.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="text-red-500 text-xl">⚠️</div>
          <div>
            <h4 class="font-bold text-red-800 mb-1">Request Creation Failed</h4>
            <p class="text-red-700 text-sm">${errorMessage}</p>
            <p class="text-red-600 text-xs mt-2">Please check that your database is properly set up.</p>
          </div>
        </div>
      `;

      document.body.appendChild(errorEl);

      // Remove error after 5 seconds
      setTimeout(() => {
        errorEl.remove();
      }, 5000);

      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Success animation
    const successEl = document.createElement("div");
    successEl.className =
      "fixed inset-0 flex items-center justify-center z-50 bg-black/50";
    successEl.innerHTML = `
      <div class="bg-white border-4 border-black p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-display font-bold text-black mb-2">Request Submitted!</h3>
        <p class="text-black/70 mb-4">You earned +10 XP</p>
        <div class="w-16 h-16 bg-festival-orange rounded-full mx-auto flex items-center justify-center border-4 border-black">
          <span class="text-2xl font-bold text-black">+10</span>
        </div>
      </div>
    `;

    document.body.appendChild(successEl);

    gsap.fromTo(
      successEl.children[0],
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(successEl, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                document.body.removeChild(successEl);
                navigate("/design-dashboard");
              },
            });
          }, 2000);
        },
      },
    );

    setIsSubmitting(false);
  };

  // Calculate price based on category and priority
  const calculatePrice = (category: string, priority: string): number => {
    let basePrice = 0;

    // Base price by category
    switch (category) {
      case "logo":
        basePrice = 299;
        break;
      case "web-design":
        basePrice = 599;
        break;
      case "3d":
        basePrice = 499;
        break;
      case "photoshop":
        basePrice = 150;
        break;
      case "branding":
        basePrice = 399;
        break;
      case "illustration":
        basePrice = 249;
        break;
      default:
        basePrice = 199;
    }

    // Adjust for priority
    switch (priority) {
      case "high":
        return basePrice * 1.5;
      case "medium":
        return basePrice;
      case "low":
        return basePrice * 0.8;
      default:
        return basePrice;
    }
  };

  const priorityColors = {
    low: "from-festival-yellow to-festival-amber",
    medium: "from-festival-orange to-festival-coral",
    high: "from-festival-pink to-festival-magenta",
  };

  return (
    <div className="min-h-screen bg-festival-cream relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-festival-orange transform rotate-45" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-festival-pink rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-festival-yellow transform rotate-12" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-4xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/design-dashboard")}
            variant="outline"
            className="mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-5xl font-display font-bold text-black mb-2">
            NEW REQUEST
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Tell us about your creative vision
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-yellow-100 border-4 border-black text-black">
              <p className="font-bold">
                You need to be logged in to submit a request.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="mt-2 bg-black text-white"
              >
                Go to Login
              </Button>
            </div>
          )}
        </div>

        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-8">
          {/* Title Section */}
          <Card className="form-section border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
            <div className="space-y-4">
              <Label htmlFor="title" className="text-xl font-bold text-black">
                Project Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="h-14 border-4 border-black text-lg font-medium bg-festival-cream"
                placeholder="e.g., Modern Logo for Tech Startup"
                maxLength={100}
              />
              <div className="flex justify-between items-center">
                {errors.title && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </div>
                )}
                <div className="text-sm text-black/60 ml-auto">
                  {formData.title.length}/100
                </div>
              </div>
            </div>
          </Card>

          {/* Description Section */}
          <Card className="form-section border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
            <div className="space-y-4">
              <Label
                htmlFor="description"
                className="text-xl font-bold text-black"
              >
                Project Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="min-h-32 border-4 border-black text-lg font-medium bg-festival-cream resize-none"
                placeholder="Describe your project in detail. Include style preferences, colors, target audience, and any specific requirements..."
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </div>
                )}
                <div className="text-sm text-black/60 ml-auto">
                  {formData.description.length}/1000
                </div>
              </div>
            </div>
          </Card>

          {/* Category Selection */}
          <Card className="form-section border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
            <div className="space-y-4">
              <Label className="text-xl font-bold text-black">
                Design Category *
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {designCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleInputChange("category", category.id)}
                    className={`p-4 border-4 border-black text-left transition-all duration-200 hover:transform hover:translate-x-1 hover:translate-y-1 ${
                      formData.category === category.id
                        ? `${category.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                        : "bg-white hover:bg-festival-cream shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-bold text-black">{category.name}</div>
                  </button>
                ))}
              </div>
              {errors.category && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </div>
              )}
            </div>
          </Card>

          {/* Priority Selection */}
          <Card className="form-section border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
            <div className="space-y-4">
              <Label className="text-xl font-bold text-black">Priority</Label>
              <div className="grid grid-cols-3 gap-4">
                {(["low", "medium", "high"] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handleInputChange("priority", priority)}
                    className={`p-4 border-4 border-black text-center transition-all duration-200 hover:transform hover:translate-x-1 hover:translate-y-1 ${
                      formData.priority === priority
                        ? `bg-gradient-to-br ${priorityColors[priority]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                        : "bg-white hover:bg-festival-cream shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    <div className="font-bold text-black capitalize">
                      {priority}
                    </div>
                    <div className="text-sm text-black/70 mt-1">
                      {priority === "low" && "7-14 days"}
                      {priority === "medium" && "3-7 days"}
                      {priority === "high" && "1-3 days"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* File Upload */}
          <Card className="form-section border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
            <div className="space-y-4">
              <Label className="text-xl font-bold text-black">
                Reference Files (Optional)
              </Label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-4 border-dashed p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-festival-orange bg-festival-orange/10"
                    : "border-black/30 bg-festival-cream"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.psd,.ai"
                />

                <Upload className="w-12 h-12 mx-auto mb-4 text-black/50" />
                <p className="text-lg font-bold text-black mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-black/60 mb-4">
                  Supports: Images, Videos, PDFs, Documents
                </p>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  Choose Files
                </Button>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-black">
                    Uploaded Files ({files.length})
                  </p>
                  <div className="grid gap-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="file-item flex items-center justify-between p-3 bg-festival-cream border-2 border-black"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="font-medium text-black truncate max-w-64">
                              {file.name}
                            </p>
                            <p className="text-sm text-black/60">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeFile(index)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-black hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-2xl font-display font-bold px-12 py-6 h-auto bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  SUBMITTING...
                </div>
              ) : (
                <>
                  SUBMIT REQUEST
                  <CheckCircle className="w-8 h-8 ml-3" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;
