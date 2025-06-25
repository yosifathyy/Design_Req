import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Palette, Layers, Sparkles } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
            Our Design Services
          </h1>
          <p className="text-xl text-retro-purple/80 mb-12 max-w-3xl mx-auto">
            Professional design solutions crafted by our expert team
          </p>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Photoshop Design",
                icon: Palette,
                gradient: "from-retro-purple to-retro-teal",
                description:
                  "Photo editing, compositing, and digital art creation",
              },
              {
                title: "3D Design",
                icon: Layers,
                gradient: "from-retro-teal to-retro-mint",
                description:
                  "3D modeling, rendering, and visualization services",
              },
              {
                title: "Logo Design",
                icon: Sparkles,
                gradient: "from-retro-orange to-retro-peach",
                description: "Brand identity and logo creation that stands out",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm border-2 border-retro-purple/20 rounded-2xl p-8"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl text-retro-purple mb-4">
                  {service.title}
                </h3>
                <p className="text-retro-purple/80 mb-6">
                  {service.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
                >
                  <Link to="/start-project">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Link to="/start-project">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;
