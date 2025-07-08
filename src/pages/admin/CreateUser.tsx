import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createAdminUser, uploadUserAvatar, createAuditLog } from "@/lib/api";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Shield,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const CreateUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
    bio: "",
    skills: "",
    hourlyRate: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let avatarUrl = "";

      // Upload avatar if provided
      if (avatarFile) {
        // Generate a temporary ID for avatar upload
        const tempId = Date.now().toString();
        avatarUrl = await uploadUserAvatar(avatarFile, tempId);
      }

      // Create user in database
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role as "user" | "designer" | "admin" | "super-admin",
        status: formData.status as "active" | "inactive" | "suspended",
        avatar_url: avatarUrl || null,
        bio: formData.bio.trim() || null,
        skills: formData.skills
          ? formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : null,
        hourly_rate: formData.hourlyRate
          ? parseFloat(formData.hourlyRate)
          : null,
      };

      const newUser = await createAdminUser(userData);

      // Create audit log
      await createAuditLog({
        action: "create_user",
        target_type: "user",
        target_id: newUser.id,
        details: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        user_id: currentUser?.id || "anonymous",
      });

      // Check if we're in mock mode
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isMockMode = !supabaseUrl || supabaseUrl.includes("placeholder");

      toast({
        title: "User Created Successfully",
        description: isMockMode
          ? `${newUser.name} has been added (mock mode - no database connected)`
          : `${newUser.name} has been added to the system`,
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Success</span>
          </div>
        ),
      });

      navigate("/admin/users");
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error Creating User",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
        action: (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Error</span>
          </div>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: previewUrl }));
    }
  };

  const roleOptions = [
    {
      value: "super-admin",
      label: "Super Admin",
      icon: Shield,
      color: "bg-red-500",
    },
    { value: "admin", label: "Admin", icon: Shield, color: "bg-orange-500" },
    {
      value: "designer",
      label: "Designer",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    { value: "client", label: "Client", icon: User, color: "bg-green-500" },
  ];

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    {
      value: "inactive",
      label: "Inactive",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "suspended",
      label: "Suspended",
      color: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="min-h-screen bg-festival-cream p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/users")}
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-black">
              Create New User
            </h1>
            <p className="text-festival-black/70">
              Add a new user to the system with appropriate permissions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-festival-yellow">
                  <CardTitle className="flex items-center gap-2 font-display">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-bold text-black"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter full name"
                        className={`border-2 ${errors.name ? "border-red-500" : "border-black"}`}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-bold text-black"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        className={`border-2 ${errors.email ? "border-red-500" : "border-black"}`}
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="role"
                        className="text-sm font-bold text-black"
                      >
                        Role *
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleInputChange("role", value)
                        }
                      >
                        <SelectTrigger
                          className={`border-2 ${errors.role ? "border-red-500" : "border-black"}`}
                        >
                          <SelectValue placeholder="Select user role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${role.color}`}
                                />
                                {role.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.role}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="status"
                        className="text-sm font-bold text-black"
                      >
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger className="border-2 border-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <Badge className={status.color}>
                                {status.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="bio"
                      className="text-sm font-bold text-black"
                    >
                      Bio/Description
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Enter user bio or description"
                      className="border-2 border-black min-h-[100px]"
                    />
                  </div>

                  {formData.role === "designer" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="skills"
                          className="text-sm font-bold text-black"
                        >
                          Skills (comma-separated)
                        </Label>
                        <Input
                          id="skills"
                          value={formData.skills}
                          onChange={(e) =>
                            handleInputChange("skills", e.target.value)
                          }
                          placeholder="e.g., Photoshop, Illustrator, 3D Design"
                          className="border-2 border-black"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="hourlyRate"
                          className="text-sm font-bold text-black"
                        >
                          Hourly Rate ($)
                        </Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={formData.hourlyRate}
                          onChange={(e) =>
                            handleInputChange("hourlyRate", e.target.value)
                          }
                          placeholder="50"
                          className="border-2 border-black"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Avatar Upload */}
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-festival-pink">
                  <CardTitle className="flex items-center gap-2 font-display">
                    <Upload className="w-5 h-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-black">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="bg-festival-yellow text-black font-bold text-xl">
                      {formData.name
                        ? formData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2 border-black w-full"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {avatarFile ? "Change Image" : "Upload Image"}
                    </Button>
                    <p className="text-xs text-festival-black/60 mt-2">
                      PNG, JPG up to 5MB
                    </p>
                    {avatarFile && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {avatarFile.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              {formData.name && (
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="bg-festival-orange">
                    <CardTitle className="font-display">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-black">
                          <AvatarImage src={formData.avatar} />
                          <AvatarFallback className="bg-festival-yellow text-black font-bold">
                            {formData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-black">
                            {formData.name}
                          </p>
                          <p className="text-sm text-festival-black/70">
                            {formData.email}
                          </p>
                        </div>
                      </div>
                      {formData.role && (
                        <Badge
                          className={
                            roleOptions.find((r) => r.value === formData.role)
                              ?.color + " text-white"
                          }
                        >
                          {
                            roleOptions.find((r) => r.value === formData.role)
                              ?.label
                          }
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t-4 border-black">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/users")}
              className="border-2 border-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || !formData.name || !formData.email || !formData.role
              }
              className="bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              {isLoading ? (
                <>Creating...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
