import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import {
  Sparkles,
  Palette,
  Layers,
  Upload,
  MessageCircle,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Award,
  ArrowRight,
  Play,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-cream via-retro-lavender/20 to-retro-mint/30">
      <Navigation />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-retro-pink/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-retro-teal/40 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-retro-orange/30 rounded-full blur-md"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-retro-purple/10 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-retro-purple" />
            <span className="text-sm font-medium text-retro-purple">
              Expert Design Studio Platform
            </span>
          </div>

          <h1 className="font-display text-5xl lg:text-7xl text-retro-purple mb-6 leading-tight">
            Transform Your Ideas Into
            <span className="bg-gradient-to-r from-retro-orange to-retro-peach bg-clip-text text-transparent block">
              Stunning Designs
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-retro-purple/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with our curated team of expert designers. From Photoshop
            magic to 3D masterpieces and memorable logos - we bring your vision
            to life with professional quality and lightning-fast delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <Link to="/start-project">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { number: "500+", label: "Projects Delivered" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "24h", label: "Average Turnaround" },
              { number: "15+", label: "Expert Designers" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-3xl lg:text-4xl text-retro-purple mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-retro-purple/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              How It Works
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Our streamlined process makes getting professional design work
              effortless
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Submit Your Brief",
                description:
                  "Tell us about your project using our AI-powered brief generator",
                color: "bg-retro-purple",
              },
              {
                step: "02",
                icon: Users,
                title: "Get Matched",
                description:
                  "We assign the perfect designer from our expert team",
                color: "bg-retro-teal",
              },
              {
                step: "03",
                icon: MessageCircle,
                title: "Collaborate",
                description:
                  "Work directly with your designer through secure messaging",
                color: "bg-retro-orange",
              },
              {
                step: "04",
                icon: CheckCircle,
                title: "Receive Results",
                description: "Get your professional designs delivered on time",
                color: "bg-retro-pink",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 ${step.color} rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 font-display text-4xl text-retro-purple/20">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-retro-purple mb-3">
                    {step.title}
                  </h3>
                  <p className="text-retro-purple/70">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Our Design Services
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Professional design solutions crafted by our expert team
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "Photoshop Design",
                description:
                  "Photo editing, compositing, and digital art creation",
                icon: Palette,
                features: [
                  "Photo Retouching",
                  "Digital Compositing",
                  "Graphic Design",
                  "Social Media Assets",
                ],
                gradient: "from-retro-purple to-retro-teal",
              },
              {
                title: "3D Design",
                description:
                  "3D modeling, rendering, and visualization services",
                icon: Layers,
                features: [
                  "3D Modeling",
                  "Product Visualization",
                  "Architectural Renders",
                  "Character Design",
                ],
                gradient: "from-retro-teal to-retro-mint",
              },
              {
                title: "Logo Design",
                description: "Brand identity and logo creation that stands out",
                icon: Sparkles,
                features: [
                  "Logo Creation",
                  "Brand Guidelines",
                  "Business Cards",
                  "Brand Assets",
                ],
                gradient: "from-retro-orange to-retro-peach",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-retro-purple mb-4">
                    {service.title}
                  </h3>
                  <p className="text-retro-purple/80 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-retro-purple/70"
                      >
                        <CheckCircle className="w-4 h-4 text-retro-teal mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white"
                  >
                    <Link to="/services">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              See the transformative power of our expert design team
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-retro-orange to-retro-peach rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-retro-purple">
                    Before & After Showcase
                  </h3>
                  <p className="text-retro-purple/70">
                    Interactive transformations
                  </p>
                </div>
              </div>
              <p className="text-lg text-retro-purple/80">
                Experience our interactive before & after showcase tool that
                demonstrates the transformative power of our design expertise.
                From rough concepts to polished masterpieces.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-retro-purple to-retro-teal text-white font-semibold px-6 py-3 rounded-xl"
              >
                <Link to="/portfolio">
                  View Full Portfolio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-retro-purple/20 to-retro-teal/20 rounded-3xl p-8 backdrop-blur-sm border-2 border-retro-purple/20">
                <div className="aspect-video bg-gradient-to-br from-retro-cream to-white rounded-2xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-retro-purple/40 mx-auto mb-4" />
                    <p className="text-retro-purple/60 font-medium">
                      Interactive Portfolio Preview
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-retro-purple/70">
                    Hover to see transformations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              Real feedback from satisfied clients around the world
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Director",
                company: "TechStart Inc.",
                content:
                  "The quality and speed of delivery exceeded our expectations. Our brand identity project was completed in record time.",
                rating: 5,
                avatar: "bg-retro-purple",
              },
              {
                name: "Mike Chen",
                role: "E-commerce Owner",
                company: "Digital Goods Co.",
                content:
                  "Amazing 3D product visualizations that boosted our conversion rates by 40%. Highly recommend!",
                rating: 5,
                avatar: "bg-retro-teal",
              },
              {
                name: "Emma Rodriguez",
                role: "Content Creator",
                company: "Creative Studios",
                content:
                  "Professional Photoshop work that transformed our social media presence. The team understands our vision perfectly.",
                rating: 5,
                avatar: "bg-retro-orange",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 border-retro-purple/20 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-retro-orange fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-retro-purple/80 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 ${testimonial.avatar} rounded-full flex items-center justify-center mr-4`}
                    >
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-retro-purple">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-retro-purple/70">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-4">
              Why Choose Our Studio
            </h2>
            <p className="text-xl text-retro-purple/80 max-w-2xl mx-auto">
              We're not just another marketplace - we're your dedicated design
              team
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                {
                  icon: Shield,
                  title: "Curated Expert Team",
                  description:
                    "Hand-picked professionals with proven track records, not random freelancers.",
                },
                {
                  icon: Clock,
                  title: "Lightning Fast Delivery",
                  description:
                    "Average 24-hour turnaround with our streamlined workflow and dedicated team.",
                },
                {
                  icon: Award,
                  title: "Quality Guaranteed",
                  description:
                    "Every project goes through our quality control process before delivery.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-retro-orange to-retro-peach rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-retro-purple mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-retro-purple/80">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-retro-lavender/30 to-retro-mint/30 rounded-3xl p-8 backdrop-blur-sm border-2 border-retro-purple/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-retro-purple to-retro-teal rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-display text-2xl text-retro-purple mb-4">
                    15+ Expert Designers
                  </h3>
                  <p className="text-retro-purple/80">
                    Our team includes specialists in Photoshop, 3D design, logo
                    creation, and more. Each project is matched with the perfect
                    expert for your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-retro-purple/10 to-retro-teal/10 rounded-3xl p-12 backdrop-blur-sm border-2 border-retro-purple/20">
            <h2 className="font-display text-4xl lg:text-5xl text-retro-purple mb-6">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl text-retro-purple/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust our expert team with
              their design needs. Start your project today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <Link to="/start-project">
                  Start Your Project Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-white font-semibold px-8 py-4 rounded-2xl"
              >
                <Link to="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-retro-purple/90 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl">design requests</h3>
                  <p className="text-sm text-white/70">Expert Design Studio</p>
                </div>
              </div>
              <p className="text-white/80">
                Professional design services by our curated team of experts.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link to="/services" className="hover:text-white">
                    Photoshop Design
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white">
                    3D Design
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white">
                    Logo Design
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-white">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disputes" className="hover:text-white">
                    Dispute Resolution
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>
              © 2024 design requests. All rights reserved. Expert design
              services you can trust.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
