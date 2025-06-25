import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-retro-purple/80">
              Legal terms and conditions for using our design services
            </p>
          </div>

          <Card className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="prose prose-purple max-w-none">
                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Service Agreement
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  By using our design services, you agree to these terms and
                  conditions. Our expert team is committed to delivering
                  high-quality design work within agreed timelines.
                </p>

                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Project Delivery
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  We guarantee professional delivery of all design projects
                  according to the specifications and timeline agreed upon
                  during project initiation.
                </p>

                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Intellectual Property
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  Upon full payment, clients receive full rights to the
                  completed design work. Our team maintains portfolio rights for
                  promotional purposes.
                </p>

                <div className="bg-retro-purple/5 border border-retro-purple/20 rounded-lg p-6 mt-8">
                  <p className="text-retro-purple/80 text-center">
                    Complete terms of service documentation will be available
                    here. Contact our legal team for current terms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
