import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getDesignRequestById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  FileText,
  Download,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) {
        setError("No request ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getDesignRequestById(id);
        setRequest(data);
      } catch (err: any) {
        console.error("Error fetching request:", err?.message || err);
        setError(err?.message || "Failed to load request details");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "low":
        return <Clock className="w-4 h-4" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4" />;
      case "high":
        return <Zap className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-festival-cream p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-festival-cream p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/requests")}
              className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Requests
            </Button>
          </div>

          <Card className="border-4 border-red-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-black mb-2">
                Request Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error ||
                  "The request you're looking for doesn't exist or you don't have permission to view it."}
              </p>
              <Button
                onClick={() => navigate("/requests")}
                className="bg-festival-orange hover:bg-festival-coral"
              >
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-festival-cream p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/requests")}
              className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Requests
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-black">
                Request Details
              </h1>
              <p className="text-gray-600">
                View and manage your design request
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-2 border-black"
              onClick={() => navigate(`/chat?request=${request.id}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Overview */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-festival-yellow">
                <CardTitle className="flex items-center gap-2 font-display">
                  <FileText className="w-5 h-5" />
                  {request.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-black mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {request.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Category
                      </label>
                      <p className="font-semibold text-black">
                        {request.category}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Priority
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        {getPriorityIcon(request.priority)}
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            {request.files && request.files.length > 0 && (
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-festival-pink">
                  <CardTitle className="flex items-center gap-2 font-display">
                    <Download className="w-5 h-5" />
                    Attached Files ({request.files.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {request.files.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-festival-orange transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-black">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-festival-orange">
                <CardTitle className="font-display">Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Badge
                  className={`${getStatusColor(request.status)} text-lg px-3 py-1`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {request.status}
                </Badge>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-festival-cream">
                <CardTitle className="font-display">Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Price
                    </label>
                    <p className="font-bold text-green-600">${request.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created
                    </label>
                    <p className="font-medium text-black">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {request.designer_id && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Designer
                      </label>
                      <p className="font-medium text-black">Assigned</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-festival-magenta">
                <CardTitle className="font-display text-white">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/chat?request=${request.id}`)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open Chat
                </Button>

                {request.status === "delivered" && (
                  <Button
                    variant="outline"
                    className="w-full border-2 border-black"
                    onClick={() => navigate("/downloads")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Files
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
