import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Reset form data when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setLoginData({ email: "", password: "" });
      setSignupData({ name: "", email: "", password: "" });
      setLoading(false);
      setShowPassword(false);
    }
  }, [isOpen]);

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
      onSuccess();
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle specific error cases
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
          emailRedirectTo: undefined, // Skip email confirmation
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup response:", data);

      // For seamless experience, always attempt automatic sign in after registration
      console.log("Attempting automatic sign in after registration...");
      try {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: signupData.email,
            password: signupData.password,
          });

        if (signInError) {
          console.error("Auto sign-in failed:", signInError);
          throw signInError; // This will cause the registration to fail and show login
        } else {
          console.log("Auto sign-in successful:", signInData);
          // Update data to include session for further processing
          data.session = signInData.session;
          data.user = signInData.user || data.user;
        }
      } catch (autoSignInError) {
        console.error("Auto sign-in error:", autoSignInError);
        throw autoSignInError; // This will cause the registration to fail and show login
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
          const errorMessage =
            profileError?.message ||
            profileError?.details ||
            profileError?.hint ||
            JSON.stringify(
              profileError,
              Object.getOwnPropertyNames(profileError),
            );
          console.error("Profile creation error:", errorMessage);

          // If it's a duplicate user, that's actually fine since auth user was created
          if (
            profileError.message?.includes("duplicate key") ||
            profileError.message?.includes("users_email_key")
          ) {
            console.log(
              "User profile already exists, continuing with auth success",
            );
          } else {
            toast.error(`Profile setup incomplete: ${errorMessage}`);
          }
          // Don't throw here as the auth user was created successfully
        } else {
          console.log("User profile created successfully");
        }
      }

      toast.success(
        "Account created and logged in! Submitting your project... 🎉",
      );
      onSuccess();
    } catch (error: any) {
      console.error("Signup failed:", error);

      // Handle specific signup error cases
      if (error.message?.includes("User already registered")) {
        toast.error(
          "An account with this email already exists. Please try signing in instead.",
        );
        // Auto-switch to login tab for better UX
        setTimeout(() => {
          const loginTab = document.querySelector(
            '[data-value="login"]',
          ) as HTMLElement;
          if (loginTab) {
            loginTab.click();
            // Pre-fill the email
            setLoginData({ email: signupData.email, password: "" });
          }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-retro-purple">
            Complete Your Project Submission
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
