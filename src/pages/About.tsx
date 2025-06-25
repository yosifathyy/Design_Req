import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Award, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
              About Our Studio
            </h1>
            <p className="text-xl text-retro-purple/80 max-w-3xl mx-auto">
              Meet the expert team behind design requests and learn about our
              mission to deliver exceptional design services
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Users,
                title: "Expert Team",
                description: "15+ curated designers with proven track records",
                stat: "15+",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Serving clients across US & Europe",
                stat: "2",
              },
              {
                icon: Award,
                title: "Projects Delivered",
                description: "Successfully completed design projects",
                stat: "500+",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm border-2 border-retro-purple/20 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-retro-purple to-retro-teal rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="font-display text-3xl text-retro-purple mb-2">
                  {item.stat}
                </div>
                <h3 className="font-bold text-xl text-retro-purple mb-3">
                  {item.title}
                </h3>
                <p className="text-retro-purple/80">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-retro-purple/10 to-retro-teal/10 rounded-3xl p-12 backdrop-blur-sm border-2 border-retro-purple/20">
              <h2 className="font-display text-3xl text-retro-purple mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-retro-purple/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                We believe exceptional design should be accessible to everyone.
                Our curated team of expert designers works together to deliver
                professional, high-quality design services that help businesses
                and individuals bring their visions to life.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/start-project">
                  Work With Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
