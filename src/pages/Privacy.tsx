import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-retro-purple/80">
              How we protect and handle your personal information
            </p>
          </div>

          <Card className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="prose prose-purple max-w-none">
                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Data Protection
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  We implement robust security measures to protect your personal
                  information and project files. All data is encrypted and
                  stored securely.
                </p>

                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  Information Collection
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  We collect only necessary information to provide our design
                  services, including project requirements, contact details, and
                  payment information.
                </p>

                <h2 className="font-bold text-xl text-retro-purple mb-4">
                  File Security
                </h2>
                <p className="text-retro-purple/80 mb-6">
                  All uploaded files and project materials are handled with the
                  highest security standards and are only accessible to your
                  assigned design team.
                </p>

                <div className="bg-retro-purple/5 border border-retro-purple/20 rounded-lg p-6 mt-8">
                  <p className="text-retro-purple/80 text-center">
                    Complete privacy policy documentation will be available
                    here. Your privacy and data security are our top priorities.
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

export default Privacy;
