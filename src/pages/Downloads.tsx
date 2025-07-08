import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRequests } from "@/lib/dashboard-data";
import {
  Download,
  Search,
  Filter,
  Image,
  FileText,
  Video,
  File,
  RotateCcw,
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  Eye,
} from "lucide-react";

const Downloads: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set(),
  );

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "all", name: "All Designs", count: mockRequests.length },
    {
      id: "logo",
      name: "Logos",
      count: mockRequests.filter((r) => r.category === "logo").length,
    },
    {
      id: "web-design",
      name: "Web Design",
      count: mockRequests.filter((r) => r.category === "web-design").length,
    },
    {
      id: "photoshop",
      name: "Photo Editing",
      count: mockRequests.filter((r) => r.category === "photoshop").length,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    if (gridRef.current) {
      const cards = gridRef.current.children;
      tl.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.9 },
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

  const filteredRequests = mockRequests
    .filter((request) => request.status === "delivered")
    .filter((request) => {
      if (selectedCategory === "all") return true;
      return request.category === selectedCategory;
    })
    .filter((request) => {
      if (!searchQuery) return true;
      return request.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || ""))
      return <Image className="w-5 h-5" />;
    if (["mp4", "avi", "mov", "webm"].includes(extension || ""))
      return <Video className="w-5 h-5" />;
    if (["pdf"].includes(extension || ""))
      return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const handleDownload = async (requestId: string, fileName: string) => {
    const fileId = `${requestId}-${fileName}`;
    setDownloadingFiles((prev) => new Set([...prev, fileId]));

    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setDownloadingFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });

    // Show success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50";
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span class="font-bold">Download started!</span>
      </div>
    `;

    document.body.appendChild(notification);

    gsap.fromTo(
      notification,
      { x: 400, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
    );

    setTimeout(() => {
      gsap.to(notification, {
        x: 400,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => document.body.removeChild(notification),
      });
    }, 3000);
  };

  const handleRequestRevision = (requestId: string) => {
    // Navigate to revision request form
    navigate(`/requests/${requestId}/revision`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-500 text-white border-2 border-black">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500 text-white border-2 border-black">
            <Clock className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      logo: "from-festival-orange to-festival-coral",
      "web-design": "from-festival-pink to-festival-magenta",
      photoshop: "from-festival-yellow to-festival-amber",
      "3d": "from-festival-cyan to-festival-blue",
      branding: "from-festival-purple to-festival-lavender",
      illustration: "from-festival-mint to-festival-green",
    };
    return (
      colors[category as keyof typeof colors] || "from-gray-400 to-gray-500"
    );
  };

  const mockFiles = [
    { name: "final-logo.png", size: "2.4 MB", type: "PNG" },
    { name: "logo-variations.pdf", size: "5.1 MB", type: "PDF" },
    { name: "brand-guidelines.pdf", size: "8.2 MB", type: "PDF" },
  ];

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

          <h1 className="text-5xl font-display font-bold text-black mb-2">
            DOWNLOADS CENTER
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Access your completed designs
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designs..."
              className="pl-12 h-12 border-4 border-black text-lg font-medium bg-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 ${
                  selectedCategory === category.id
                    ? "bg-festival-magenta text-white"
                    : "bg-white text-black"
                }`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Designs Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden hover:transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              {/* Thumbnail */}
              <div
                className={`h-48 bg-gradient-to-br ${getCategoryColor(request.category)} border-b-4 border-black relative overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-50">
                    {request.category === "logo" && "🎯"}
                    {request.category === "web-design" && "💻"}
                    {request.category === "photoshop" && "����"}
                    {request.category === "3d" && "🎲"}
                    {request.category === "branding" && "🏷️"}
                    {request.category === "illustration" && "🎨"}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  {getStatusBadge(request.status)}
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black text-white border-2 border-black">
                    {request.category.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
                  {request.title}
                </h3>
                <p className="text-black/70 text-sm mb-4 line-clamp-3">
                  {request.description}
                </p>

                {/* Files */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-bold text-black">
                    Files ({mockFiles.length})
                  </p>
                  {mockFiles.slice(0, 2).map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-festival-cream border-2 border-black"
                    >
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="text-sm font-medium text-black truncate max-w-32">
                            {file.name}
                          </p>
                          <p className="text-xs text-black/60">
                            {file.size} • {file.type}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(request.id, file.name)}
                        disabled={downloadingFiles.has(
                          `${request.id}-${file.name}`,
                        )}
                        size="sm"
                        className="h-8 w-8 p-0 bg-festival-orange hover:bg-festival-coral border-2 border-black"
                      >
                        {downloadingFiles.has(`${request.id}-${file.name}`) ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                  {mockFiles.length > 2 && (
                    <p className="text-xs text-black/60">
                      +{mockFiles.length - 2} more files
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(request.id, "all-files.zip")}
                    disabled={downloadingFiles.has(
                      `${request.id}-all-files.zip`,
                    )}
                    className="flex-1 bg-gradient-to-r from-festival-orange to-festival-coral hover:from-festival-coral hover:to-festival-orange border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                  >
                    {downloadingFiles.has(`${request.id}-all-files.zip`) ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </div>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleRequestRevision(request.id)}
                    variant="outline"
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
            <div className="text-6xl mb-4">📥</div>
            <h3 className="text-2xl font-bold text-black mb-2">
              No designs found
            </h3>
            <p className="text-black/70 mb-4">
              {searchQuery
                ? `No designs match "${searchQuery}"`
                : "No completed designs available for download yet."}
            </p>
            <Button
              onClick={() => navigate("/new-request")}
              className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Create New Request
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Downloads;
