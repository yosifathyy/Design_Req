
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BounceIn } from "@/components/AnimatedElements";

interface FormData {
  projectName: string;
  description: string;
  style: string;
}

interface ProjectDetailsStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const ProjectDetailsStep = ({ formData, setFormData }: ProjectDetailsStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BounceIn>
        <h2 className="font-display text-2xl md:text-3xl text-retro-purple mb-3 text-center">
          Tell us about your amazing project! 🚀
        </h2>
        <p className="text-retro-purple/80 text-center mb-6 md:mb-8 px-4">
          The more details you share, the better we can match you
          with the perfect designer
        </p>
      </BounceIn>

      <div className="space-y-6 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label
            htmlFor="projectName"
            className="text-retro-purple font-bold text-base md:text-lg mb-3 block"
          >
            Project Name ✨ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            placeholder="e.g., Logo for tech startup that'll change the world!"
            value={formData.projectName}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectName: e.target.value,
              })
            }
            className="border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl py-3 text-base md:text-lg"
            maxLength={100}
            required
          />
          <div className="text-right text-sm text-retro-purple/60 mt-1">
            {formData.projectName.length}/100
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label
            htmlFor="description"
            className="text-retro-purple font-bold text-base md:text-lg mb-3 block"
          >
            Project Description 📝 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your vision, goals, and any specific requirements. Don't hold back - we love creative details!"
            rows={5}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl resize-none text-base md:text-lg"
            maxLength={1000}
            required
          />
          <div className="text-right text-sm text-retro-purple/60 mt-1">
            {formData.description.length}/1000
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="text-retro-purple font-bold text-base md:text-lg mb-3 block">
            Style Preference 🎨 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.style}
            onValueChange={(value) =>
              setFormData({ ...formData, style: value })
            }
            required
          >
            <SelectTrigger className="border-3 border-retro-purple/30 rounded-2xl py-3 text-base md:text-lg">
              <SelectValue placeholder="Choose your vibe!" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">
                Modern & Clean 🏢
              </SelectItem>
              <SelectItem value="retro">
                Retro & Vintage 📼
              </SelectItem>
              <SelectItem value="playful">
                Playful & Fun 🎈
              </SelectItem>
              <SelectItem value="professional">
                Professional & Corporate 💼
              </SelectItem>
              <SelectItem value="artistic">
                Artistic & Creative 🎭
              </SelectItem>
              <SelectItem value="minimalist">
                Minimalist 🕳️
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    </motion.div>
  );
};
