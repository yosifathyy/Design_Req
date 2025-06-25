import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, Clock, ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl lg:text-6xl text-retro-purple mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Have questions about our services? Need help with your project?
              We're here to help!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: MessageCircle,
                title: "Live Chat",
                description: "Instant support during business hours",
                action: "Start Chat",
              },
              {
                icon: Mail,
                title: "Email Support",
                description: "Get detailed help via email",
                action: "Send Email",
              },
              {
                icon: Clock,
                title: "Quick Start",
                description: "Jump right into your project",
                action: "Start Project",
              },
            ].map((contact, index) => (
              <Card
                key={index}
                className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 text-center"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-retro-purple to-retro-teal rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <contact.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-retro-purple mb-2">
                    {contact.title}
                  </h3>
                  <p className="text-retro-purple/80 mb-4">
                    {contact.description}
                  </p>
                  <Button
                    variant="outline"
                    className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
                  >
                    {contact.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="font-display text-2xl text-retro-purple mb-6 text-center">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-retro-purple font-medium"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="mt-2 border-retro-purple/30 focus:border-retro-purple"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-retro-purple font-medium"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="mt-2 border-retro-purple/30 focus:border-retro-purple"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="subject"
                    className="text-retro-purple font-medium"
                  >
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    className="mt-2 border-retro-purple/30 focus:border-retro-purple"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="message"
                    className="text-retro-purple font-medium"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your question or project..."
                    rows={5}
                    className="mt-2 border-retro-purple/30 focus:border-retro-purple resize-none"
                  />
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Send Message
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-retro-purple/80 mb-4">
              Ready to start your design project instead?
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-8 py-4 rounded-2xl"
            >
              <Link to="/start-project">Start Your Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
