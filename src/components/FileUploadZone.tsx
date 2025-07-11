
import { useState, useCallback } from "react";
import { Upload, FileText, X, Image as ImageIcon, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const FileUploadZone = ({ 
  files, 
  onFilesChange, 
  maxFiles = 10,
  maxSizeMB = 10,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt']
}: FileUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(newFiles).forEach((file) => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxSizeMB}MB)`);
        return;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      });

      if (!isValidType) {
        errors.push(`${file.name} is not a supported file type`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    const totalFiles = [...files, ...validFiles];
    if (totalFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    onFilesChange(totalFiles);
  }, [files, onFilesChange, maxFiles, maxSizeMB, acceptedTypes]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div
        className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-retro-purple bg-retro-purple/10 scale-105' 
            : 'border-retro-purple/30 hover:border-retro-purple/60 hover:bg-retro-purple/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{
            y: dragActive ? -10 : [0, -5, 0],
            rotate: dragActive ? 0 : [0, 5, -5, 0],
          }}
          transition={{
            duration: dragActive ? 0.2 : 4,
            repeat: dragActive ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
            dragActive ? 'text-retro-purple' : 'text-retro-purple/60'
          }`} />
        </motion.div>
        
        <h3 className="font-bold text-xl text-retro-purple mb-2">
          {dragActive ? 'Drop files here! 🎯' : 'Drop files here or click to upload! 📁'}
        </h3>
        
        <p className="text-retro-purple/70 mb-4">
          Support for images, PDFs, documents (max {maxSizeMB}MB each)
        </p>
        
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="fileUpload"
          accept={acceptedTypes.join(',')}
        />
        
        <Button
          asChild
          className="bg-gradient-to-r from-retro-orange to-retro-peach text-white font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all"
        >
          <label htmlFor="fileUpload" className="cursor-pointer">
            <FileText className="w-4 h-4 mr-2" />
            Choose Files
          </label>
        </Button>
        
        <div className="mt-4 text-sm text-retro-purple/60">
          {files.length}/{maxFiles} files selected
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h4 className="font-bold text-lg text-retro-purple flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Uploaded Files ({files.length})
            </h4>
            
            <div className="grid gap-3">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-retro-purple/20 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-retro-purple">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-retro-purple truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-retro-purple/60">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-retro-purple/60 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
