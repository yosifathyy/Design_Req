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
      <nav className="hidden lg:flex items-center justify-between p-6 bg-retro-cream/90 backdrop-blur-md border-b-3 border-retro-purple/30 sticky top-0 z-50 shadow-lg">
        <button
          onClick={scrollToHome}
          className="flex items-center space-x-3 group"
        >
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-retro-purple to-retro-teal rounded-2xl flex items-center justify-center shadow-xl border-3 border-retro-purple/30"
            whileHover={{
              scale: 1.1,
              rotate: 360,
            }}
            transition={{ duration: 0.6 }}
          >
            <WiggleIcon>
              <Sparkles className="w-7 h-7 text-white" />
            </WiggleIcon>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <h1 className="font-display text-3xl text-retro-purple">
              design requests
            </h1>
            <p className="text-sm text-retro-purple/70 font-bold">
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
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold transition-all duration-200 text-retro-purple/80 hover:text-retro-purple hover:bg-retro-purple/15 cursor-pointer border-2 border-transparent hover:border-retro-purple/30 shadow-md hover:shadow-lg"
              >
                <WiggleIcon>
                  <Icon className="w-5 h-5" />
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
              className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 animate-pulse-glow border-3 border-retro-orange/50 text-lg"
            >
              <Link to="/start-project">🚀 Start Your Project</Link>
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-retro-cream/95 backdrop-blur-md border-b-3 border-retro-purple/30 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={scrollToHome}
            className="flex items-center space-x-2"
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-retro-purple to-retro-teal rounded-xl flex items-center justify-center shadow-lg border-2 border-retro-purple/30"
              whileHover={{
                scale: 1.1,
                rotate: 360,
              }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="font-display text-xl text-retro-purple">
                design requests
              </h1>
              <p className="text-xs text-retro-purple/70 font-bold">Expert Studio</p>
            </div>
          </button>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-retro-purple border-2 border-retro-purple/30 rounded-xl p-3 hover:bg-retro-purple/10"
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
            className="p-4 border-t-2 border-retro-purple/30 bg-retro-cream/95 backdrop-blur-md"
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
                  className="flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all duration-200 w-full text-retro-purple/80 hover:bg-retro-purple/15 hover:text-retro-purple border-2 border-retro-purple/20 hover:border-retro-purple/40 shadow-md hover:shadow-lg"
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
                  className="w-full bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold py-4 rounded-2xl shadow-xl mt-4 border-3 border-retro-orange/50 text-lg"
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