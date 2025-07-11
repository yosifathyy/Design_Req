
import { motion } from "framer-motion";
import { BounceIn } from "@/components/AnimatedElements";
import { FileUploadZone } from "@/components/FileUploadZone";

interface FileUploadStepProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUploadStep = ({ files, onFilesChange }: FileUploadStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BounceIn>
        <h2 className="font-display text-2xl md:text-3xl text-retro-purple mb-3 text-center">
          Share Your Inspiration! 📁✨
        </h2>
        <p className="text-retro-purple/80 text-center mb-6 md:mb-8 px-4">
          Upload any reference materials, existing files, or
          inspiration that'll help us create magic! (Optional)
        </p>
      </BounceIn>

      <FileUploadZone
        files={files}
        onFilesChange={onFilesChange}
        maxFiles={10}
        maxSizeMB={10}
        acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt', '.psd', '.ai', '.sketch', '.fig']}
      />
    </motion.div>
  );
};
