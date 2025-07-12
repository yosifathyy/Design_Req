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
import { FileUploadZone } from "@/components/FileUploadZone";

interface FormData {
  projectName: string;
  description: string;
  style: string;
  customStyle?: string;
  timeline: string;
  budget: string;
  budgetAmount: number[];
  files: File[];
}

interface ProjectDetailsStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const ProjectDetailsStep = ({
  formData,
  setFormData,
}: ProjectDetailsStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BounceIn>
        <h2
          className="font-heading text-2xl md:text-3xl mb-3 text-center"
          style={{ color: "rgb(62, 48, 80)" }}
        >
          Tell us about your amazing project! 🚀
        </h2>
        <p
          className="text-center mb-6 md:mb-8 px-4 font-label"
          style={{ color: "rgba(62, 48, 80, 0.8)" }}
        >
          The more details you share, the better we can match you with the
          perfect designer
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
            className="font-label font-bold text-base md:text-lg mb-3 block"
            style={{ color: "rgb(62, 48, 80)" }}
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
            className="border-2 rounded-2xl py-3 text-base md:text-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: "rgba(62, 48, 80, 0.3)",
              backgroundColor: "white",
              color: "rgb(62, 48, 80)",
            }}
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
            className="font-label font-bold text-base md:text-lg mb-3 block"
            style={{ color: "rgb(62, 48, 80)" }}
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
          <Label
            className="font-label font-bold text-base md:text-lg mb-3 block"
            style={{ color: "rgb(62, 48, 80)" }}
          >
            Style Preference 🎨{" "}
            <span className="text-gray-400">(Optional)</span>
          </Label>
          <Select
            value={formData.style}
            onValueChange={(value) => {
              if (value === "other") {
                setFormData({ ...formData, style: value, customStyle: "" });
              } else {
                setFormData({
                  ...formData,
                  style: value,
                  customStyle: undefined,
                });
              }
            }}
          >
            <SelectTrigger className="border-3 border-retro-purple/30 rounded-2xl py-3 text-base md:text-lg">
              <SelectValue placeholder="Choose your vibe or skip this step!" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern & Clean 🏢</SelectItem>
              <SelectItem value="retro">Retro & Vintage 📼</SelectItem>
              <SelectItem value="playful">Playful & Fun 🎈</SelectItem>
              <SelectItem value="professional">
                Professional & Corporate 💼
              </SelectItem>
              <SelectItem value="artistic">Artistic & Creative 🎭</SelectItem>
              <SelectItem value="minimalist">Minimalist 🕳️</SelectItem>
              <SelectItem value="other">Other (specify below) ✍️</SelectItem>
            </SelectContent>
          </Select>
          {formData.style === "other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              <Input
                placeholder="Describe your preferred style..."
                value={formData.customStyle || ""}
                onChange={(e) =>
                  setFormData({ ...formData, customStyle: e.target.value })
                }
                className="border-3 border-retro-purple/30 focus:border-retro-purple rounded-2xl py-3 text-base md:text-lg"
                maxLength={100}
              />
              <div className="text-right text-sm text-retro-purple/60 mt-1">
                {(formData.customStyle || "").length}/100
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label
            className="font-label font-bold text-base md:text-lg mb-3 block"
            style={{ color: "rgb(62, 48, 80)" }}
          >
            Reference Files & Inspiration 📁✨
          </Label>
          <p
            className="text-sm md:text-base mb-4 font-body"
            style={{ color: "rgba(62, 48, 80, 0.7)" }}
          >
            Upload any reference materials, existing designs, or inspiration
            files to help us understand your vision better! (Optional)
          </p>
          <FileUploadZone
            files={formData.files}
            onFilesChange={(files) => setFormData({ ...formData, files })}
            maxFiles={10}
            maxSizeMB={10}
            acceptedTypes={[
              "image/*",
              ".pdf",
              ".doc",
              ".docx",
              ".txt",
              ".psd",
              ".ai",
              ".sketch",
              ".fig",
            ]}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
