import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BounceIn } from "@/components/AnimatedElements";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Shield, Sparkles } from "lucide-react";

interface AuthStepProps {
  onAuthSuccess: () => void;
  loading: boolean;
}

export const AuthStep = ({
  onAuthSuccess,
  loading: submissionLoading,
}: AuthStepProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login for:", loginData.email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login successful:", data);
      toast.success("Welcome back! 🎉");
      onAuthSuccess();
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting signup for:", signupData.email);

      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            name: signupData.name,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup response:", data);

      // Auto sign in after registration
      console.log("Attempting automatic sign in after registration...");
      try {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: signupData.email,
            password: signupData.password,
          });

        if (signInError) {
          console.error("Auto sign-in failed:", signInError);
          throw signInError;
        } else {
          console.log("Auto sign-in successful:", signInData);
          data.session = signInData.session;
          data.user = signInData.user || data.user;
        }
      } catch (autoSignInError) {
        console.error("Auto sign-in error:", autoSignInError);
        throw autoSignInError;
      }

      // Create user profile
      if (data.user) {
        console.log("Creating user profile...");
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: signupData.email,
            name: signupData.name,
          },
        ]);

        if (profileError) {
          if (
            profileError.code === "23505" ||
            profileError.message?.includes("duplicate key") ||
            profileError.message?.includes("users_email_key") ||
            profileError.message?.includes("users_pkey")
          ) {
            console.log(
              "User profile already exists, continuing with auth success",
            );
          } else {
            const errorMessage =
              profileError?.message ||
              profileError?.details ||
              profileError?.hint ||
              JSON.stringify(
                profileError,
                Object.getOwnPropertyNames(profileError),
              );
            console.error("Profile creation error:", errorMessage);
            toast.error(`Profile setup incomplete: ${errorMessage}`);
          }
        } else {
          console.log("User profile created successfully");
        }
      }

      toast.success("Account created successfully! 🎉");
      onAuthSuccess();
    } catch (error: any) {
      console.error("Signup failed:", error);

      if (error.message?.includes("User already registered")) {
        toast.error(
          "An account with this email already exists. Please try signing in instead.",
        );
        setTimeout(() => {
          setActiveTab("login");
          setLoginData({ email: signupData.email, password: "" });
        }, 1500);
      } else if (error.message?.includes("Password")) {
        toast.error("Password must be at least 6 characters long.");
      } else {
        const errorMessage =
          error?.message ||
          error?.details ||
          error?.hint ||
          JSON.stringify(error, Object.getOwnPropertyNames(error));
        toast.error(errorMessage || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = loading || submissionLoading;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Loading Overlay */}
      {submissionLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-retro-purple mx-auto mb-4"></div>
            <p className="text-lg font-medium text-retro-purple">
              Submitting your project...
            </p>
          </div>
        </div>
      )}

      <BounceIn>
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center space-x-2 bg-retro-purple/10 px-4 py-2 rounded-full mb-4">
            <Shield className="w-5 h-5 text-retro-purple" />
            <span className="text-sm font-heading text-retro-purple">
              Secure & Fast
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl text-retro-purple mb-3">
            Almost There! 🚀
          </h2>
          <p className="text-retro-purple/80 px-4">
            Sign in to submit your project and get matched with amazing
            designers
          </p>
        </div>
      </BounceIn>

      <div className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-retro-purple/10 rounded-2xl p-1">
            <TabsTrigger
              value="login"
              className="font-label font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-retro-purple"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="font-label font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-retro-purple"
            >
              Create Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="login-email"
                    className="font-label font-medium text-retro-purple"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-purple/60" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="pl-12 py-3 border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl font-body"
                      required
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className="font-label font-medium text-retro-purple"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-purple/60" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="pl-12 pr-12 py-3 border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl font-body"
                      required
                      disabled={isFormDisabled}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-purple/60 hover:text-retro-purple"
                      disabled={isFormDisabled}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-retro-purple to-retro-teal text-white font-heading text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isFormDisabled}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Sign In & Submit
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </TabsContent>

          <TabsContent value="signup">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-name"
                    className="font-label font-medium text-retro-purple"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-purple/60" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, name: e.target.value })
                      }
                      className="pl-12 py-3 border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl font-body"
                      required
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-email"
                    className="font-label font-medium text-retro-purple"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-purple/60" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      className="pl-12 py-3 border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl font-body"
                      required
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-password"
                    className="font-label font-medium text-retro-purple"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-purple/60" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      className="pl-12 pr-12 py-3 border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl font-body"
                      required
                      minLength={6}
                      disabled={isFormDisabled}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-purple/60 hover:text-retro-purple"
                      disabled={isFormDisabled}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-retro-orange to-retro-peach text-white font-heading text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isFormDisabled}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Account & Submit
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-retro-purple/60 font-body">
            Your project will be submitted immediately after authentication
          </p>
        </div>
      </div>
    </motion.div>
  );
};
