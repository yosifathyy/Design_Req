import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAdminUsers, updateAdminUser } from "@/lib/api";
import { updateUserRole, suspendUser, activateUser } from "@/lib/admin-api";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Shield,
  Settings,
  Zap,
  AlertCircle,
  Upload,
} from "lucide-react";

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    bio: "",
    skills: [] as string[],
    hourly_rate: null as number | null,
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const users = await getAdminUsers();
        const foundUser = users.find((u: any) => u.id === id);

        if (!foundUser) {
          setError("User not found");
          return;
        }

        setUser(foundUser);
        setFormData({
          name: foundUser.name || "",
          email: foundUser.email || "",
          role: foundUser.role || "user",
          status: foundUser.status || "active",
          bio: foundUser.bio || "",
          skills: Array.isArray(foundUser.skills) ? foundUser.skills : [],
          hourly_rate: foundUser.hourly_rate || null,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  useEffect(() => {
    if (!containerRef.current || loading) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update user role if changed
      if (formData.role !== user.role) {
        await updateUserRole(user.id, formData.role, "current-admin-id");
      }

      // Update user status if changed
      if (formData.status !== user.status) {
        if (formData.status === "suspended") {
          await suspendUser(user.id, "current-admin-id");
        } else if (formData.status === "active") {
          await activateUser(user.id, "current-admin-id");
        }
      }

      // Update other user data
      await updateAdminUser(user.id, {
        name: formData.name,
        email: formData.email,
        // Note: bio, skills, and hourly_rate would need to be added to updateAdminUser
      });

      // Show success and redirect
      navigate("/admin/users");
    } catch (err: any) {
      setError(err.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super-admin":
        return "bg-festival-magenta text-white";
      case "admin":
        return "bg-festival-orange text-black";
      case "designer":
        return "bg-festival-pink text-white";
      case "user":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super-admin":
        return <Shield className="w-3 h-3" />;
      case "admin":
        return <Settings className="w-3 h-3" />;
      case "designer":
        return <Zap className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "inactive":
        return "bg-yellow-500 text-black";
      case "suspended":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-festival-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-black">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-4 border-red-500 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] bg-white p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-black mb-2">User Not Found</h3>
          <p className="text-black/70 mb-6">
            {error || "The requested user could not be found."}
          </p>
          <Button
            onClick={() => navigate("/admin/users")}
            className="bg-red-500 hover:bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin/users")}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-black">
              Edit User
            </h1>
            <p className="text-black/70">User ID: {user.id}</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-festival-orange to-festival-coral border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-xl font-bold text-black">User Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-bold text-black"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-4 border-black bg-white"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-bold text-black"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border-4 border-black bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="role"
                    className="text-sm font-bold text-black"
                  >
                    Role
                  </Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border-4 border-black bg-white font-medium"
                  >
                    <option value="user">User</option>
                    <option value="designer">Designer</option>
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="status"
                    className="text-sm font-bold text-black"
                  >
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border-4 border-black bg-white font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-bold text-black">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="border-4 border-black bg-white"
                  placeholder="User biography..."
                />
              </div>

              {formData.role === "designer" && (
                <>
                  <div>
                    <Label className="text-sm font-bold text-black">
                      Skills
                    </Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        className="border-4 border-black bg-white"
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        variant="outline"
                        className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-2 border-black cursor-pointer hover:bg-red-50"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill} ✕
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="hourly_rate"
                      className="text-sm font-bold text-black"
                    >
                      Hourly Rate ($)
                    </Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={formData.hourly_rate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hourly_rate: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      className="border-4 border-black bg-white"
                      placeholder="0.00"
                    />
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* User Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-lg font-bold text-black">User Info</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-festival-orange border-4 border-black rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-black">
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Upload Avatar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Role</span>
                <Badge
                  className={`${getRoleColor(user.role)} border-2 border-black flex items-center gap-1`}
                >
                  {getRoleIcon(user.role)}
                  {user.role.replace("-", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Status</span>
                <Badge
                  className={`${getStatusColor(user.status)} border-2 border-black`}
                >
                  {user.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">XP</span>
                <span className="text-sm font-medium text-black">
                  {user.xp || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Level</span>
                <span className="text-sm font-medium text-black">
                  {user.level || 1}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Joined</span>
                <span className="text-sm text-black/70">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">Last Login</span>
                <span className="text-sm text-black/70">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
