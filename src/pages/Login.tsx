import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  Palette,
  Chrome,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !formRef.current || !titleRef.current) return;

    // Initial page animation
    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)" },
    );

    tl.fromTo(
      titleRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.3",
    );

    tl.fromTo(
      formRef.current.children,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.2",
    );
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake animation for errors
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success animation
    const successTl = gsap.timeline();
    successTl.to(formRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
    });
    successTl.to(formRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.4)",
    });

    setIsLoading(false);
    navigate("/dashboard");
  };

  const handleGoogleSignIn = () => {
    // Add click animation
    gsap.to(event?.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });

    // Smooth transition animation
    gsap.to(formRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        gsap.to(formRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-festival-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={`border-2 border-black ${i % 2 === 0 ? "bg-festival-orange" : "bg-festival-pink"}`}
            />
          ))}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-festival-yellow transform rotate-45 opacity-30" />
      <div className="absolute top-32 right-20 w-12 h-12 bg-festival-pink rounded-full opacity-30" />
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-festival-orange transform rotate-12 opacity-30" />

      <div ref={containerRef} className="relative z-10 w-full max-w-md">
        <Card className="border-6 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Palette className="w-8 h-8 text-festival-orange" />
                <Sparkles className="w-6 h-6 text-festival-pink" />
              </div>
              <h1
                ref={titleRef}
                className="text-4xl font-display font-bold text-black mb-2"
              >
                DESIGN REQUESTS
              </h1>
              <p className="text-lg text-black/70 font-medium">
                {isLogin
                  ? "Welcome back, creator!"
                  : "Join the creative community!"}
              </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-lg font-bold text-black"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12 border-4 border-black text-lg font-medium focus:ring-festival-orange focus:border-festival-orange bg-festival-cream"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-bold text-black">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 pl-12 border-4 border-black text-lg font-medium focus:ring-festival-orange focus:border-festival-orange bg-festival-cream"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-lg font-bold text-black"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="h-12 pl-12 pr-12 border-4 border-black text-lg font-medium focus:ring-festival-orange focus:border-festival-orange bg-festival-cream"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-lg font-bold text-black"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="h-12 pl-12 border-4 border-black text-lg font-medium focus:ring-festival-orange focus:border-festival-orange bg-festival-cream"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      className="border-2 border-black data-[state=checked]:bg-festival-orange"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium text-black"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-festival-orange hover:text-festival-coral"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-xl font-display font-bold bg-gradient-to-r from-festival-orange to-festival-coral hover:from-festival-coral hover:to-festival-orange border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    {isLogin ? "SIGNING IN..." : "CREATING ACCOUNT..."}
                  </div>
                ) : (
                  <>
                    {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                    <CheckCircle className="w-6 h-6 ml-2" />
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-black" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-black font-bold">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full h-12 border-4 border-black bg-white hover:bg-festival-cream text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
              >
                <Chrome className="w-5 h-5 mr-3" />
                Sign in with Google
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-black/70">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                onClick={toggleMode}
                className="text-festival-orange hover:text-festival-coral font-bold text-lg"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
