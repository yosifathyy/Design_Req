import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles, Palette, Users, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { WiggleIcon } from "@/components/AnimatedElements";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/services", label: "Our Services", icon: Palette },
    { href: "/portfolio", label: "Portfolio", icon: Sparkles },
    { href: "/about", label: "About Us", icon: Users },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between p-6 bg-retro-cream/80 backdrop-blur-sm border-b-2 border-retro-purple/20">
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-retro-purple to-retro-teal rounded-xl flex items-center justify-center"
            whileHover={{
              scale: 1.1,
              rotate: 360,
            }}
            transition={{ duration: 0.6 }}
          >
            <WiggleIcon>
              <Sparkles className="w-6 h-6 text-white" />
            </WiggleIcon>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <h1 className="font-display text-2xl text-retro-purple">
              design requests
            </h1>
            <p className="text-xs text-retro-purple/70 font-medium">
              Expert Design Studio ✨
            </p>
          </motion.div>
        </Link>

        <div className="flex items-center space-x-8">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200",
                isActive(href)
                  ? "bg-retro-purple text-white shadow-lg"
                  : "text-retro-purple/80 hover:text-retro-purple hover:bg-retro-purple/10",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}

          <Button
            asChild
            className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Link to="/start-project">Start Your Project</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-retro-cream/95 backdrop-blur-sm border-b-2 border-retro-purple/20">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-retro-purple to-retro-teal rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl text-retro-purple">
                design requests
              </h1>
              <p className="text-xs text-retro-purple/70">Expert Studio</p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-retro-purple"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="p-4 border-t border-retro-purple/20 bg-retro-cream">
            <div className="space-y-3">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 w-full",
                    isActive(href)
                      ? "bg-retro-purple text-white"
                      : "text-retro-purple/80 hover:bg-retro-purple/10",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}

              <Button
                asChild
                className="w-full bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold py-3 rounded-xl shadow-lg mt-4"
                onClick={() => setIsOpen(false)}
              >
                <Link to="/start-project">Start Your Project</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
