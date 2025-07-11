
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeInUp, TiltCard } from "@/components/AnimatedElements";
import { Wand2, Heart } from "lucide-react";

export const HelpSection = () => {
  return (
    <FadeInUp delay={0.6} className="mt-8 md:mt-12 text-center">
      <TiltCard className="border-3 border-retro-teal/30 bg-retro-teal/10 backdrop-blur-sm rounded-2xl">
        <Card className="border-0 bg-transparent">
          <CardContent className="p-6 md:p-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Wand2 className="w-10 h-10 md:w-12 md:h-12 text-retro-teal mx-auto mb-4" />
            </motion.div>
            <h3 className="font-bold text-xl md:text-2xl text-retro-purple mb-3">
              Need Help Getting Started? 🤝
            </h3>
            <p className="text-retro-purple/80 mb-6 text-base md:text-lg">
              Our team of design wizards is here to help you create the
              perfect project brief!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                variant="outline"
                className="border-2 border-retro-teal text-retro-teal hover:bg-retro-teal hover:text-white font-bold px-6 md:px-8 py-3 rounded-2xl"
              >
                <Link to="/contact">
                  <Heart className="w-4 h-4 mr-2" />
                  Contact Our Magic Team
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </TiltCard>
    </FadeInUp>
  );
};
