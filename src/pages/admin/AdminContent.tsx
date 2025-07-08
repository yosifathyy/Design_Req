import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image,
  Video,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Globe,
  Settings,
  TestTube,
} from "lucide-react";

const AdminContent: React.FC = () => {
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

  const contentItems = [
    {
      id: "1",
      title: "Homepage Hero Section",
      type: "page",
      status: "published",
      lastModified: "2024-01-25",
      author: "Sarah Chen",
    },
    {
      id: "2",
      title: "Services Landing Page",
      type: "page",
      status: "draft",
      lastModified: "2024-01-24",
      author: "Mike Rodriguez",
    },
    {
      id: "3",
      title: "Design Process Blog Post",
      type: "blog",
      status: "published",
      lastModified: "2024-01-23",
      author: "Emma Wilson",
    },
    {
      id: "4",
      title: "Company Logo",
      type: "media",
      status: "published",
      lastModified: "2024-01-20",
      author: "David Kim",
    },
    {
      id: "5",
      title: "Portfolio Showcase Video",
      type: "media",
      status: "published",
      lastModified: "2024-01-18",
      author: "Sarah Chen",
    },
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case "page":
        return <Globe className="w-5 h-5" />;
      case "blog":
        return <FileText className="w-5 h-5" />;
      case "media":
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500 text-white";
      case "draft":
        return "bg-yellow-500 text-black";
      case "archived":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "from-festival-orange to-festival-coral";
      case "blog":
        return "from-festival-pink to-festival-magenta";
      case "media":
        return "from-festival-yellow to-festival-amber";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            CONTENT & CMS
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Manage website content, pages, and media
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-4 border-black">
            <Upload className="w-4 h-4 mr-2" />
            Media Library
          </Button>
          <Button
            onClick={() => navigate("/admin/content/create")}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Content Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center gap-4">
            <Globe className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {contentItems.filter((item) => item.type === "page").length}
              </p>
              <p className="text-sm font-medium text-black/80">Pages</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-pink to-festival-magenta p-6">
          <div className="flex items-center gap-4">
            <FileText className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-display font-bold text-white">
                {contentItems.filter((item) => item.type === "blog").length}
              </p>
              <p className="text-sm font-medium text-white/80">Blog Posts</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
          <div className="flex items-center gap-4">
            <Image className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {contentItems.filter((item) => item.type === "media").length}
              </p>
              <p className="text-sm font-medium text-black/80">Media Files</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            placeholder="Search content..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
        <select className="px-4 py-2 border-4 border-black bg-white font-medium">
          <option value="all">All Types</option>
          <option value="page">Pages</option>
          <option value="blog">Blog Posts</option>
          <option value="media">Media</option>
        </select>
        <select className="px-4 py-2 border-4 border-black bg-white font-medium">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Items */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black">Content Items</h3>
          {contentItems.map((item) => (
            <Card
              key={item.id}
              className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div
                    className={`p-3 bg-gradient-to-r ${getTypeColor(item.type)} border-4 border-black rounded`}
                  >
                    {getContentIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-black">{item.title}</h4>
                      <Badge
                        className={`${getStatusColor(item.status)} border-2 border-black`}
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-black/70 space-y-1">
                      <p>Type: {item.type}</p>
                      <p>Modified: {item.lastModified}</p>
                      <p>Author: {item.author}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-4 border-black"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-4 border-black"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-4 border-red-500 text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Features */}
        <div className="space-y-6">
          {/* A/B Testing */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-purple-400 to-purple-500">
              <div className="flex items-center gap-3">
                <TestTube className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">A/B Testing</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-festival-cream border-2 border-black">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black">
                      Hero CTA Button Test
                    </span>
                    <Badge className="bg-green-500 text-white border-2 border-black">
                      ACTIVE
                    </Badge>
                  </div>
                  <p className="text-sm text-black/70 mt-1">
                    Testing "Get Started" vs "Start Project"
                  </p>
                </div>
                <div className="p-3 bg-festival-cream border-2 border-black">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black">
                      Pricing Page Layout
                    </span>
                    <Badge className="bg-gray-500 text-white border-2 border-black">
                      DRAFT
                    </Badge>
                  </div>
                  <p className="text-sm text-black/70 mt-1">
                    Testing 3-column vs 2-column pricing
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-4 border-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Test
              </Button>
            </div>
          </Card>

          {/* Site Monitoring */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-green-400 to-green-500">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-black" />
                <h3 className="text-xl font-bold text-black">
                  Site Monitoring
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                  <p className="text-sm text-black/70">Uptime</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">1.2s</p>
                  <p className="text-sm text-black/70">Load Time</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Performance Score</span>
                  <span className="font-bold">94/100</span>
                </div>
                <div className="w-full h-3 bg-black/20 border-2 border-black">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "94%" }}
                  />
                </div>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-4 border-black"
                >
                  View Full Report
                </Button>
              </div>
            </div>
          </Card>

          {/* Media Library Quick Access */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
              <div className="flex items-center gap-3">
                <Image className="w-6 h-6 text-black" />
                <h3 className="text-xl font-bold text-black">Media Library</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square bg-festival-cream border-2 border-black flex items-center justify-center">
                  <Image className="w-8 h-8 text-black/50" />
                </div>
                <div className="aspect-square bg-festival-cream border-2 border-black flex items-center justify-center">
                  <Video className="w-8 h-8 text-black/50" />
                </div>
                <div className="aspect-square bg-festival-cream border-2 border-black flex items-center justify-center">
                  <FileText className="w-8 h-8 text-black/50" />
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-4 border-black"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
