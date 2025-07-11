import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BounceIn, TiltCard } from "@/components/AnimatedElements";
import { CheckCircle, Palette, Layers, Sparkles, Globe } from "lucide-react";

interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
}

interface ProjectTypeStepProps {
  projectType: string;
  setProjectType: (type: string) => void;
  playClickSound: () => void;
  playHoverSound: () => void;
}

const projectTypes: ProjectType[] = [
  {
    id: "photoshop",
    title: "Photoshop Request",
    description: "Photo editing, compositing, digital art",
    icon: Palette,
    gradient: "from-retro-purple to-retro-teal",
  },
  {
    id: "3d",
    title: "3D Request",
    description: "3D modeling, rendering, visualization",
    icon: Layers,
    gradient: "from-retro-teal to-retro-mint",
  },
  {
    id: "design",
    title: "Design Request",
    description: "Logos, branding, graphic design",
    icon: Sparkles,
    gradient: "from-retro-orange to-retro-peach",
  },
  {
    id: "website",
    title: "Website Request",
    description: "Web design, UI/UX, landing pages",
    icon: Globe,
    gradient: "from-retro-pink to-retro-lavender",
  },
];

export const ProjectTypeStep = ({
  projectType,
  setProjectType,
  playClickSound,
  playHoverSound,
}: ProjectTypeStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BounceIn>
        <h2 className="font-heading text-2xl md:text-3xl text-retro-purple mb-3 text-center">
          What type of design magic do you need? 🎨
        </h2>
        <p className="text-retro-purple/80 text-center mb-6 md:mb-8 px-4 font-label">
          Choose the service that best fits your project needs
        </p>
      </BounceIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {projectTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              playClickSound();
              setProjectType(type.id);
            }}
            onMouseEnter={() => {
              playHoverSound();
            }}
            className="cursor-pointer"
          >
            <TiltCard
              className={`transition-all duration-300 border-3 hover:shadow-xl ${
                projectType === type.id
                  ? "border-retro-purple bg-retro-purple/10 shadow-2xl"
                  : "border-retro-purple/30 hover:border-retro-purple/60"
              }`}
            >
              <Card className="border-0 bg-transparent">
                <CardContent className="p-4 md:p-6 text-center">
                  <motion.div
                    className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${type.gradient} rounded-3xl mx-auto mb-4 flex items-center justify-center`}
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <type.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </motion.div>
                  <h3 className="font-label font-bold text-lg md:text-xl text-retro-purple mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-retro-purple/70 font-body">
                    {type.description}
                  </p>
                  {projectType === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-3"
                    >
                      <CheckCircle className="w-6 h-6 text-retro-purple mx-auto" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
