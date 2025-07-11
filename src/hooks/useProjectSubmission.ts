
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProjectFormData {
  projectType: string;
  projectName: string;
  description: string;
  style: string;
  timeline: string;
  budget: string;
  files: File[];
}

export const useProjectSubmission = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const mapTimelineToPriority = (timeline: string): string => {
    switch (timeline) {
      case "rush": return "high";
      case "standard": return "medium";
      case "flexible": return "low";
      case "large": return "medium";
      default: return "medium";
    }
  };

  const mapBudgetToPrice = (budget: string): number => {
    switch (budget) {
      case "50-150": return 100;
      case "150-300": return 225;
      case "300-500": return 400;
      case "500+": return 750;
      default: return 0;
    }
  };

  const uploadFiles = async (files: File[], requestId: string, userId: string) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${requestId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          request_id: requestId,
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          uploaded_by: userId,
        });

      if (dbError) throw dbError;

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const submitProject = async (formData: ProjectFormData, userId: string) => {
    setLoading(true);

    try {
      // Create the design request
      const { data: request, error: requestError } = await supabase
        .from('design_requests')
        .insert({
          user_id: userId,
          category: formData.projectType,
          title: formData.projectName,
          description: formData.description,
          style: formData.style,
          priority: mapTimelineToPriority(formData.timeline),
          price: mapBudgetToPrice(formData.budget),
          status: 'submitted',
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Upload files if any
      if (formData.files.length > 0) {
        await uploadFiles(formData.files, request.id, userId);
      }

      // Award XP to user
      const { error: xpError } = await supabase
        .from('users')
        .update({ xp: supabase.raw('xp + 10') })
        .eq('id', userId);

      if (xpError) console.error('XP update error:', xpError);

      toast.success("🎉 Project submitted successfully! You earned 10 XP!");
      navigate('/dashboard');

      return request;
    } catch (error: any) {
      console.error('Project submission error:', error);
      toast.error(error.message || "Failed to submit project");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitProject,
    loading,
  };
};
