import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  Download,
  CreditCard,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Client Dashboard
            </h1>
            <p className="text-xl text-retro-purple/80">
              Manage your projects, communications, and files
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Active Projects",
                value: "3",
                icon: Clock,
                color: "from-retro-orange to-retro-peach",
              },
              {
                title: "Completed",
                value: "12",
                icon: CheckCircle,
                color: "from-retro-teal to-retro-mint",
              },
              {
                title: "Messages",
                value: "5",
                icon: MessageSquare,
                color: "from-retro-purple to-retro-lavender",
              },
              {
                title: "Files",
                value: "24",
                icon: Download,
                color: "from-retro-pink to-retro-peach",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-retro-purple/70 mb-1">
                        {stat.title}
                      </p>
                      <p className="font-display text-2xl text-retro-purple">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-retro-purple">
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Logo Design - TechStart",
                      status: "In Progress",
                      updated: "2 hours ago",
                    },
                    {
                      name: "3D Product Render",
                      status: "Review",
                      updated: "1 day ago",
                    },
                    {
                      name: "Photo Editing - Campaign",
                      status: "Completed",
                      updated: "3 days ago",
                    },
                  ].map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-retro-purple/20 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-retro-purple">
                          {project.name}
                        </h4>
                        <p className="text-sm text-retro-purple/70">
                          {project.updated}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === "Completed"
                            ? "bg-retro-mint/20 text-retro-teal"
                            : project.status === "Review"
                              ? "bg-retro-orange/20 text-retro-orange"
                              : "bg-retro-purple/20 text-retro-purple"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
                >
                  View All Projects
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-retro-purple">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-retro-orange to-retro-peach text-white font-semibold py-3 rounded-xl"
                  >
                    <Link to="/start-project">
                      <FileText className="w-4 h-4 mr-2" />
                      Start New Project
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white py-3"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white py-3"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Files
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-retro-orange text-retro-orange hover:bg-retro-orange hover:text-white py-3"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-retro-purple/60 mb-4">
              This is a preview of the client dashboard. Full functionality
              coming soon.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
            >
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
