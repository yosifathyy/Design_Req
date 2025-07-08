import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockAdminUsers } from "@/lib/admin-data";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Settings,
  Zap,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

const UsersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [users, setUsers] = useState(mockAdminUsers);

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !tableRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    const userCards = tableRef.current.children;
    tl.fromTo(
      userCards,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.2)",
      },
      "-=0.3",
    );
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

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
        return <UserCheck className="w-3 h-3" />;
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

  const handleUserAction = (userId: string, action: string) => {
    const userCard = document.querySelector(`[data-user-id="${userId}"]`);
    if (userCard) {
      gsap.to(userCard, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    switch (action) {
      case "edit":
        console.log("Edit user:", userId);
        break;
      case "suspend":
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, status: "suspended" as const }
              : user,
          ),
        );
        break;
      case "activate":
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: "active" as const } : user,
          ),
        );
        break;
      case "delete":
        gsap.to(userCard, {
          x: 100,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setUsers((prev) => prev.filter((user) => user.id !== userId));
          },
        });
        break;
    }
  };

  const roleStats = {
    all: users.length,
    "super-admin": users.filter((u) => u.role === "super-admin").length,
    admin: users.filter((u) => u.role === "admin").length,
    designer: users.filter((u) => u.role === "designer").length,
    user: users.filter((u) => u.role === "user").length,
  };

  const statusStats = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            USER MANAGEMENT
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>

          <Button
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button className="bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <UserCheck className="w-6 h-6 text-festival-orange" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
                Total Users
              </p>
              <p className="text-2xl font-display font-bold text-black">
                {users.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-green-400 to-green-500 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
                Active Users
              </p>
              <p className="text-2xl font-display font-bold text-black">
                {statusStats.active}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-pink to-festival-magenta p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <Zap className="w-6 h-6 text-festival-pink" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
                Designers
              </p>
              <p className="text-2xl font-display font-bold text-black">
                {roleStats.designer}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded border-2 border-black">
              <Shield className="w-6 h-6 text-festival-yellow" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
                Admins
              </p>
              <p className="text-2xl font-display font-bold text-black">
                {roleStats.admin + roleStats["super-admin"]}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border-4 border-black bg-white font-medium"
          >
            <option value="all">All Roles ({roleStats.all})</option>
            <option value="super-admin">
              Super Admin ({roleStats["super-admin"]})
            </option>
            <option value="admin">Admin ({roleStats.admin})</option>
            <option value="designer">Designer ({roleStats.designer})</option>
            <option value="user">User ({roleStats.user})</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-4 border-black bg-white font-medium"
          >
            <option value="all">All Status ({statusStats.all})</option>
            <option value="active">Active ({statusStats.active})</option>
            <option value="inactive">Inactive ({statusStats.inactive})</option>
            <option value="suspended">
              Suspended ({statusStats.suspended})
            </option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div
        ref={tableRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            data-user-id={user.id}
            className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            <div className="p-6">
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-festival-orange border-4 border-black rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-black">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-black">{user.name}</h3>
                    <p className="text-sm text-black/70">{user.email}</p>
                  </div>
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <Badge
                    className={`${getRoleColor(user.role)} border-2 border-black font-bold flex items-center gap-1`}
                  >
                    {getRoleIcon(user.role)}
                    {user.role.replace("-", " ").toUpperCase()}
                  </Badge>
                  <Badge
                    className={`${getStatusColor(user.status)} border-2 border-black font-bold`}
                  >
                    {user.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-xs text-black/60 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      Last login {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Designer Skills */}
                {user.role === "designer" && user.skills && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-black">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-2 border-black text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Assignments */}
                {user.assignedProjects && user.assignedProjects.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-black">
                      Assigned Projects: {user.assignedProjects.length}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUserAction(user.id, "edit")}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>

                {user.status === "active" ? (
                  <Button
                    onClick={() => handleUserAction(user.id, "suspend")}
                    variant="outline"
                    size="sm"
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                  >
                    <UserX className="w-3 h-3 mr-1" />
                    Suspend
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUserAction(user.id, "activate")}
                    className="bg-green-500 hover:bg-green-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                    size="sm"
                  >
                    <UserCheck className="w-3 h-3 mr-1" />
                    Activate
                  </Button>
                )}

                <Button
                  onClick={() => handleUserAction(user.id, "delete")}
                  variant="outline"
                  size="sm"
                  className="border-4 border-red-500 text-red-500 hover:bg-red-50 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] hover:translate-x-1 hover:translate-y-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-black mb-2">No users found</h3>
          <p className="text-black/70 mb-6">
            {searchQuery
              ? `No users match "${searchQuery}"`
              : "No users match the selected filters."}
          </p>
          <Button className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Plus className="w-5 h-5 mr-2" />
            Add First User
          </Button>
        </Card>
      )}
    </div>
  );
};

export default UsersManagement;
