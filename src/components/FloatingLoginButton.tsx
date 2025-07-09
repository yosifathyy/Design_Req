import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingLoginButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const buttonRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  const { signIn, signUp, signOut, loading: isLoading, user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!isLogin && !formData.name) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.name);
      }
      setIsModalOpen(false);
      // Reset form
      setFormData({ email: "", password: "", confirmPassword: "", name: "" });
    } catch (error: any) {
      setErrors({ submit: error.message || "An error occurred" });
    }
  };

  // GSAP animations for hover and pulse effects
  useEffect(() => {
    if (!buttonRef.current || !pulseRef.current) return;

    // Continuous pulse animation
    gsap.to(pulseRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: "power2.out",
    });

    // Floating animation
    gsap.to(buttonRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  }, []);

  const handleHover = () => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      scale: 1.2,
      rotation: 360,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  };

  const handleHoverOut = () => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  };

  const handleClick = () => {
    if (!buttonRef.current) return;

    gsap.fromTo(
      buttonRef.current,
      { scale: 1.2 },
      {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      },
    );
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
      >
        {/* Pulse ring effect */}
        <div
          ref={pulseRef}
          className="absolute inset-0 bg-festival-orange rounded-full opacity-30"
          style={{
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />

        {user ? (
          // User logged in - show profile/logout button
          <button
            ref={buttonRef}
            onClick={handleLogout}
            onMouseEnter={handleHover}
            onMouseLeave={handleHoverOut}
            onMouseDown={handleClick}
            className="relative bg-gradient-to-r from-festival-pink to-festival-coral text-white rounded-full p-4 shadow-lg border-2 border-festival-black hover:shadow-xl transition-all duration-300 group"
          >
            <UserCircle className="w-6 h-6" />
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-festival-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {user.email} - Click to logout
            </div>
          </button>
        ) : (
          // User not logged in - show login dialog
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button
                ref={buttonRef}
                onMouseEnter={handleHover}
                onMouseLeave={handleHoverOut}
                onMouseDown={handleClick}
                className="relative bg-festival-orange hover:bg-festival-orange/90 text-white rounded-full p-4 shadow-lg border-2 border-festival-black hover:shadow-xl transition-all duration-300 group"
              >
                <LogIn className="w-6 h-6" />
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-festival-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Click to login
                </div>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-festival-cream border-2 border-festival-black">
              <DialogHeader>
                <DialogTitle className="text-center font-display text-2xl text-festival-black">
                  {isLogin ? "Welcome Back!" : "Join Us!"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-festival-black font-medium"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-festival-black/50 w-4 h-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={cn(
                          "pl-10 border-2 border-festival-black focus:border-festival-orange",
                          errors.name && "border-red-500",
                        )}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-festival-black font-medium"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-festival-black/50 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10 border-2 border-festival-black focus:border-festival-orange",
                        errors.email && "border-red-500",
                      )}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-festival-black font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-festival-black/50 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10 pr-10 border-2 border-festival-black focus:border-festival-orange",
                        errors.password && "border-red-500",
                      )}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-festival-black/50 hover:text-festival-black"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-festival-black font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-festival-black/50 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={cn(
                          "pl-10 border-2 border-festival-black focus:border-festival-orange",
                          errors.confirmPassword && "border-red-500",
                        )}
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-700 text-sm">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-festival-orange hover:bg-festival-orange/90 text-white border-2 border-festival-black font-bold"
                >
                  {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({
                        email: "",
                        password: "",
                        confirmPassword: "",
                        name: "",
                      });
                    }}
                    className="text-festival-black hover:text-festival-orange font-medium text-sm underline"
                  >
                    {isLogin
                      ? "Need an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-festival-black/70 hover:text-festival-orange text-sm underline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Open full login page
                  </Link>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </>
  );
};

export default FloatingLoginButton;
