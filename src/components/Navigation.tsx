import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Sparkles,
  Palette,
  Users,
  Phone,
  Eye,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { WiggleIcon } from "@/components/AnimatedElements";
import { GSAPHover, GSAPMagneticButton } from "@/components/GSAPAnimatedElements";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "#services", label: "Our Services", icon: Palette },
    { href: "#portfolio", label: "Portfolio", icon: Eye },
    { href: "#about", label: "About Us", icon: Users },
    { href: "#contact", label: "Contact", icon: MessageCircle },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.substring(1));
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsOpen(false);
  };

  const scrollToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between p-6 bg-retro-cream/80 backdrop-blur-sm border-b-2 border-retro-purple/20 sticky top-0 z-50">
        <GSAPMagneticButton
          onClick={scrollToHome}
          className="flex items-center space-x-3 group"
        >
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
        </button>

        <div className="flex items-center space-x-8">
          {navItems.map(({ href, label, icon: Icon }) => (
            <motion.div
              key={href}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => scrollToSection(href)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 text-retro-purple/80 hover:text-retro-purple hover:bg-retro-purple/10 cursor-pointer"
              >
                <WiggleIcon>
                  <Icon className="w-4 h-4" />
                </WiggleIcon>
                <span>{label}</span>
              </button>
            </motion.div>
          ))}

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse-glow"
            >
              <Link to="/start-project">🚀 Start Your Project</Link>
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-retro-cream/95 backdrop-blur-sm border-b-2 border-retro-purple/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={scrollToHome}
            className="flex items-center space-x-2"
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-retro-purple to-retro-teal rounded-lg flex items-center justify-center"
              whileHover={{
                scale: 1.1,
                rotate: 360,
              }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-display text-xl text-retro-purple">
                design requests
              </h1>
              <p className="text-xs text-retro-purple/70">Expert Studio</p>
            </div>
          </button>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-retro-purple"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="p-4 border-t border-retro-purple/20 bg-retro-cream"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              {navItems.map(({ href, label, icon: Icon }, index) => (
                <motion.button
                  key={href}
                  onClick={() => scrollToSection(href)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 w-full text-retro-purple/80 hover:bg-retro-purple/10 hover:text-retro-purple"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <WiggleIcon>
                    <Icon className="w-5 h-5" />
                  </WiggleIcon>
                  <span>{label}</span>
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold py-3 rounded-xl shadow-lg mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/start-project">🚀 Start Your Project</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
};

export default Navigation;