import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Disputes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Dispute Resolution
            </h1>
            <p className="text-xl text-retro-purple/80">
              Our commitment to fair and transparent conflict resolution
            </p>
          </div>

          <Card className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="prose prose-purple max-w-none">
                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Resolution Process
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  We are committed to resolving any issues quickly and fairly.
                  Our customer success team works directly with clients to
                  address concerns and find satisfactory solutions.
                </p>

                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Quality Guarantee
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  All projects are backed by our quality guarantee. If you're
                  not satisfied with the results, we'll work with you to make it
                  right or provide a full refund.
                </p>

                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Contact Support
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  For any disputes or concerns, please contact our support team
                  immediately. We aim to resolve all issues within 24 hours.
                </p>

                <div className="bg-retro-purple/5 border border-retro-purple/20 rounded-lg p-6 mt-8 text-center">
                  <p className="text-retro-purple/80 mb-4">
                    Need help resolving an issue? Our team is here to help.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-semibold"
                  >
                    <Link to="/contact">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Disputes;
