import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, ExternalLink } from "lucide-react";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-retro-purple/80 max-w-3xl mx-auto">
              Explore our collection of stunning design work and see the
              transformative power of our expert team
            </p>
          </div>

          {/* Interactive Before & After Showcase Tool will be implemented here */}
          <div className="bg-white/60 backdrop-blur-sm border-2 border-retro-purple/20 rounded-3xl p-12 text-center mb-12">
            <Eye className="w-16 h-16 text-retro-purple/40 mx-auto mb-6" />
            <h3 className="font-display text-3xl text-retro-purple mb-4">
              Interactive Before & After Showcase
            </h3>
            <p className="text-lg text-retro-purple/80 mb-8 max-w-2xl mx-auto">
              Experience our dynamic portfolio with interactive sliders and
              animations that demonstrate our transformative design
              capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-semibold"
              >
                <Link to="/start-project">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Portfolio filters and grid will be implemented here */}
          <div className="text-center">
            <p className="text-retro-purple/60 mb-8">
              Portfolio showcase with filtering by service type coming soon...
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl"
            >
              <Link to="/start-project">
                Ready to Create Something Amazing?
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
