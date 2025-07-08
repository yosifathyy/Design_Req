import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockAdminUsers } from "@/lib/admin-data";
import { designCategories } from "@/lib/dashboard-data";
import {
  ArrowLeft,
  Plus,
  Save,
  Send,
  User,
  Calendar,
  DollarSign,
  FileText,
  Briefcase,
} from "lucide-react";

const CreateProject: React.FC = () => {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    clientName: "",
    clientEmail: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    budget: "",
    estimatedHours: "",
    dueDate: "",
    notes: "",
  });
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  const designers = mockAdminUsers.filter((user) => user.role === "designer");

  const handleInputChange = (field: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!projectData.title.trim()) {
      newErrors.title = "Project title is required";
    }
    if (!projectData.description.trim()) {
      newErrors.description = "Project description is required";
    }
    if (!projectData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    if (!projectData.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (!/\S+@\S+\.\S+/.test(projectData.clientEmail)) {
      newErrors.clientEmail = "Please enter a valid email";
    }
    if (!projectData.category) {
      newErrors.category = "Please select a category";
    }
    if (!projectData.budget || parseFloat(projectData.budget) <= 0) {
      newErrors.budget = "Please enter a valid budget";
    }
    if (!projectData.dueDate) {
      newErrors.dueDate = "Please select a due date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    const draftData = {
      ...projectData,
      designerId: selectedDesigner,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("draftProject", JSON.stringify(draftData));

    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white p-4 border-4 border-black z-50";
    notification.textContent = "Project saved as draft!";
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleCreateProject = () => {
    if (!validateForm()) {
      return;
    }

    // Create project logic
    const newProject = {
      id: `proj-${Date.now()}`,
      ...projectData,
      designerId: selectedDesigner,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      budget: parseFloat(projectData.budget),
      estimatedHours: projectData.estimatedHours
        ? parseFloat(projectData.estimatedHours)
        : undefined,
      timeline: [
        {
          id: "1",
          type: "created",
          description: "Project created by admin",
          timestamp: new Date().toISOString(),
          userId: "admin-1",
          userName: "Admin",
        },
      ],
      tasks: [],
      assets: [],
    };

    // Show success animation
    const successEl = document.createElement("div");
    successEl.className =
      "fixed inset-0 flex items-center justify-center z-50 bg-black/50";
    successEl.innerHTML = `
      <div class="bg-white border-4 border-black p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div class="text-6xl mb-4">🎯</div>
        <h3 class="text-2xl font-bold text-black mb-2">Project Created!</h3>
        <p class="text-black/70">New project has been successfully created</p>
        <div class="w-16 h-16 bg-festival-orange rounded-full mx-auto flex items-center justify-center border-4 border-black mt-4">
          <span class="text-xl font-bold text-black">+15</span>
        </div>
        <p class="text-sm text-black/60 mt-2">You earned 15 XP!</p>
      </div>
    `;
    document.body.appendChild(successEl);

    setTimeout(() => {
      document.body.removeChild(successEl);
      navigate("/admin/projects");
    }, 2500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "from-red-500 to-red-600";
      case "high":
        return "from-festival-pink to-festival-magenta";
      case "medium":
        return "from-festival-orange to-festival-coral";
      case "low":
        return "from-festival-yellow to-festival-amber";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin/projects")}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold text-black">
              CREATE NEW PROJECT
            </h1>
            <p className="text-xl text-black/70 font-medium">
              Set up a new design project for a client
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Details */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
              <h3 className="text-xl font-bold text-black">Project Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Project Title *
                </Label>
                <Input
                  value={projectData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter project title..."
                  className="border-4 border-black bg-festival-cream"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-black">
                  Description *
                </Label>
                <Textarea
                  value={projectData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the project requirements..."
                  className="border-4 border-black bg-festival-cream"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-bold text-black">
                    Budget ($) *
                  </Label>
                  <Input
                    type="number"
                    value={projectData.budget}
                    onChange={(e) =>
                      handleInputChange("budget", e.target.value)
                    }
                    placeholder="0.00"
                    className="border-4 border-black bg-festival-cream"
                  />
                  {errors.budget && (
                    <p className="text-red-600 text-sm mt-1">{errors.budget}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-bold text-black">
                    Estimated Hours
                  </Label>
                  <Input
                    type="number"
                    value={projectData.estimatedHours}
                    onChange={(e) =>
                      handleInputChange("estimatedHours", e.target.value)
                    }
                    placeholder="0"
                    className="border-4 border-black bg-festival-cream"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-bold text-black">
                  Due Date *
                </Label>
                <Input
                  type="date"
                  value={projectData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="border-4 border-black bg-festival-cream"
                />
                {errors.dueDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
              <h3 className="text-xl font-bold text-white">
                Category & Priority
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Project Category *
                </Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {designCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleInputChange("category", category.id)}
                      className={`p-3 border-4 border-black text-left transition-all duration-200 hover:transform hover:translate-x-1 hover:translate-y-1 ${
                        projectData.category === category.id
                          ? `${category.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                          : "bg-white hover:bg-festival-cream shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    >
                      <div className="text-xl mb-1">{category.icon}</div>
                      <div className="font-bold text-black text-sm">
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-black">Priority</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {(["low", "medium", "high", "urgent"] as const).map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => handleInputChange("priority", priority)}
                        className={`p-3 border-4 border-black text-center transition-all duration-200 hover:transform hover:translate-x-1 hover:translate-y-1 ${
                          projectData.priority === priority
                            ? `bg-gradient-to-br ${getPriorityColor(priority)} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                            : "bg-white hover:bg-festival-cream shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        }`}
                      >
                        <div className="font-bold text-black capitalize">
                          {priority}
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Client & Assignment */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
              <h3 className="text-xl font-bold text-black">
                Client Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Client Name *
                </Label>
                <Input
                  value={projectData.clientName}
                  onChange={(e) =>
                    handleInputChange("clientName", e.target.value)
                  }
                  placeholder="Client or company name..."
                  className="border-4 border-black bg-festival-cream"
                />
                {errors.clientName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.clientName}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-black">
                  Client Email *
                </Label>
                <Input
                  type="email"
                  value={projectData.clientEmail}
                  onChange={(e) =>
                    handleInputChange("clientEmail", e.target.value)
                  }
                  placeholder="client@example.com"
                  className="border-4 border-black bg-festival-cream"
                />
                {errors.clientEmail && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.clientEmail}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-blue-400 to-blue-500">
              <h3 className="text-xl font-bold text-white">
                Designer Assignment
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Assign Designer (Optional)
                </Label>
                <select
                  value={selectedDesigner}
                  onChange={(e) => setSelectedDesigner(e.target.value)}
                  className="w-full p-3 border-4 border-black bg-festival-cream"
                >
                  <option value="">Assign later</option>
                  {designers.map((designer) => (
                    <option key={designer.id} value={designer.id}>
                      {designer.name} - {designer.skills?.join(", ")}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDesigner && (
                <div className="p-3 bg-festival-cream border-2 border-black">
                  {(() => {
                    const designer = designers.find(
                      (d) => d.id === selectedDesigner,
                    );
                    return (
                      <div>
                        <h4 className="font-bold text-black">
                          {designer?.name}
                        </h4>
                        <p className="text-sm text-black/70">
                          Skills: {designer?.skills?.join(", ")}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-green-400 to-green-500">
              <h3 className="text-xl font-bold text-black">Additional Notes</h3>
            </div>
            <div className="p-6">
              <Textarea
                value={projectData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes or requirements..."
                className="border-4 border-black bg-festival-cream"
                rows={4}
              />
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleCreateProject}
              className="text-xl font-display font-bold px-8 py-4 h-auto bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <Briefcase className="w-6 h-6 mr-3" />
              CREATE PROJECT
              <Plus className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
