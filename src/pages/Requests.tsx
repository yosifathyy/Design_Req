import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { getDesignRequests } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRequests, designCategories } from "@/lib/dashboard-data";
import {
  Search,
  Plus,
  MessageCircle,
  Download,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  ArrowLeft,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";

const Requests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch requests when component mounts or filter changes
    const fetchRequests = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getDesignRequests(
          user.id,
          statusFilter !== "all" ? statusFilter : undefined,
        );
        setRequests(data);
      } catch (error: any) {
        console.error("Error fetching requests:", error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user, statusFilter]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      tl.fromTo(
        cards,
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
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "draft":
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: FileText,
          label: "Draft",
        };
      case "submitted":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          icon: Clock,
          label: "Submitted",
        };
      case "in-progress":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          icon: Clock,
          label: "In Progress",
        };
      case "completed":
        return {
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: CheckCircle,
          label: "Completed",
        };
      case "delivered":
        return {
          color: "bg-purple-500",
          textColor: "text-purple-700",
          bgColor: "bg-purple-50",
          icon: Truck,
          label: "Delivered",
        };
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: FileText,
          label: "Unknown",
        };
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return (
      designCategories.find((cat) => cat.id === categoryId) || {
        name: "Unknown",
        icon: "❓",
        color: "bg-gray-400",
      }
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "from-festival-yellow to-festival-amber";
      case "medium":
        return "from-festival-orange to-festival-coral";
      case "high":
        return "from-festival-pink to-festival-magenta";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const filteredProjects = requests.filter((request) =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getProjectsByStatus = (status: string) => {
    if (status === "all") return filteredProjects;
    return filteredProjects.filter((project) => project.status === status);
  };

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch = request.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockRequests.length,
    draft: mockRequests.filter((r) => r.status === "draft").length,
    submitted: mockRequests.filter((r) => r.status === "submitted").length,
    "in-progress": mockRequests.filter((r) => r.status === "in-progress")
      .length,
    completed: mockRequests.filter((r) => r.status === "completed").length,
    delivered: mockRequests.filter((r) => r.status === "delivered").length,
  };

  const handleChatClick = (requestId: string) => {
    navigate(`/chat?request=${requestId}`);
  };

  const handleDownloadClick = (requestId: string) => {
    navigate(`/downloads?request=${requestId}`);
  };

  const handleViewDetails = (requestId: string) => {
    // Navigate to detailed view
    navigate(`/requests/${requestId}`);
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
        className="relative z-10 max-w-7xl mx-auto px-4 py-8"
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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-display font-bold text-black mb-2">
                MY REQUESTS
              </h1>
              <p className="text-xl text-black/70 font-medium">
                Track and manage your design projects
              </p>
            </div>

            <Button
              onClick={() => navigate("/new-request")}
              className="bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 text-lg font-bold px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              NEW REQUEST
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="pl-12 h-12 border-4 border-black text-lg font-medium bg-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? "default" : "outline"}
                className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 ${
                  statusFilter === status
                    ? "bg-festival-magenta text-white"
                    : "bg-white text-black"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                ({count})
              </Button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-festival-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div ref={cardsRef} className="space-y-4">
            {filteredProjects.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const categoryInfo = getCategoryInfo(request.category);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={request.id}
                  className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`p-4 rounded border-4 border-black ${statusConfig.bgColor}`}
                        >
                          <StatusIcon
                            className={`w-6 h-6 ${statusConfig.textColor}`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-black">
                              {request.title}
                            </h3>
                            <Badge
                              className={`${statusConfig.color} text-white border-2 border-black font-bold`}
                            >
                              {statusConfig.label}
                            </Badge>
                          </div>

                          <p className="text-black/70 font-medium mb-3 line-clamp-2">
                            {request.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-black/60">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded ${categoryInfo.color}`}
                              />
                              <span>{categoryInfo.name}</span>
                            </div>
                            <div className="w-1 h-1 bg-black rounded-full" />
                            <span>
                              Created: {formatDate(request.createdAt)}
                            </span>
                            <div className="w-1 h-1 bg-black rounded-full" />
                            <div
                              className={`px-2 py-1 bg-gradient-to-r ${getPriorityColor(request.priority)} border-2 border-black text-black font-bold text-xs uppercase`}
                            >
                              {request.priority} Priority
                            </div>
                            <div className="w-1 h-1 bg-black rounded-full" />
                            <span>${request.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl mb-2">{categoryInfo.icon}</div>
                        <div className="text-sm text-black/60">
                          ID: #{request.id}
                        </div>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-black">
                          Progress:
                        </span>
                        <div className="flex-1 h-2 bg-black/20 border-2 border-black rounded-none overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getPriorityColor(request.priority)} transition-all duration-300`}
                            style={{
                              width:
                                request.status === "draft"
                                  ? "10%"
                                  : request.status === "submitted"
                                    ? "25%"
                                    : request.status === "in-progress"
                                      ? "60%"
                                      : request.status === "completed"
                                        ? "90%"
                                        : "100%",
                            }}
                          />
                        </div>
                        <span className="text-sm text-black/60">
                          {request.status === "draft"
                            ? "10%"
                            : request.status === "submitted"
                              ? "25%"
                              : request.status === "in-progress"
                                ? "60%"
                                : request.status === "completed"
                                  ? "90%"
                                  : "100%"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewDetails(request.id)}
                          variant="outline"
                          size="sm"
                          className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>

                        {(request.status === "in-progress" ||
                          request.status === "completed") && (
                          <Button
                            onClick={() => handleChatClick(request.id)}
                            variant="outline"
                            size="sm"
                            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        )}

                        {request.status === "delivered" && (
                          <Button
                            onClick={() => handleDownloadClick(request.id)}
                            className="bg-gradient-to-r from-festival-orange to-festival-coral hover:from-festival-coral hover:to-festival-orange border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>

                      <div className="text-sm text-black/60">
                        Updated: {formatDate(request.updatedAt)}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-black mb-2">
              No requests found
            </h3>
            <p className="text-black/70 mb-6">
              {searchQuery
                ? `No requests match "${searchQuery}"`
                : statusFilter === "all"
                  ? "You haven't submitted any design requests yet."
                  : `No ${statusFilter.replace("-", " ")} requests at the moment.`}
            </p>
            <Button
              onClick={() => navigate("/new-request")}
              className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Request
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Requests;
