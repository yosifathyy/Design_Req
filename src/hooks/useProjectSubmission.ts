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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();

  const mapTimelineToPriority = (timeline: string): string => {
    switch (timeline) {
      case "rush":
        return "high";
      case "standard":
        return "medium";
      case "flexible":
        return "low";
      case "large":
        return "medium";
      default:
        return "medium";
    }
  };

  const mapBudgetToPrice = (budget: string): number => {
    switch (budget) {
      case "50-150":
        return 100;
      case "150-300":
        return 225;
      case "300-500":
        return 400;
      case "500+":
        return 750;
      default:
        return 0;
    }
  };

  const uploadFiles = async (
    files: File[],
    requestId: string,
    userId: string,
  ) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${requestId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("files")
        .upload(fileName, file);

      if (uploadError) {
        const errorMessage =
          uploadError?.message ||
          uploadError?.details ||
          uploadError?.hint ||
          JSON.stringify(uploadError, Object.getOwnPropertyNames(uploadError));
        throw new Error(`File upload failed: ${errorMessage}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("files").getPublicUrl(fileName);

      // Save file metadata to database
      const { error: dbError } = await supabase.from("files").insert({
        request_id: requestId,
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        uploaded_by: userId,
      });

      if (dbError) {
        const errorMessage =
          dbError?.message ||
          dbError?.details ||
          dbError?.hint ||
          JSON.stringify(dbError, Object.getOwnPropertyNames(dbError));
        throw new Error(`Database error saving file metadata: ${errorMessage}`);
      }

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const submitProject = async (formData: ProjectFormData, userId: string) => {
    setLoading(true);

    try {
      console.log("Starting project submission for user:", userId);
      console.log("Form data:", formData);

      // Create the design request
      const { data: request, error: requestError } = await supabase
        .from("design_requests")
        .insert({
          user_id: userId,
          category: formData.projectType,
          title: formData.projectName,
          description: formData.style
            ? `${formData.description}\n\nStyle Preferences: ${formData.style}`
            : formData.description,
          priority: mapTimelineToPriority(formData.timeline),
          price: mapBudgetToPrice(formData.budget),
          status: "submitted",
        })
        .select()
        .single();

      if (requestError) {
        const errorMessage =
          requestError?.message ||
          requestError?.details ||
          requestError?.hint ||
          JSON.stringify(
            requestError,
            Object.getOwnPropertyNames(requestError),
          );
        console.error("Request creation error:", errorMessage);
        throw new Error(`Failed to create design request: ${errorMessage}`);
      }

      console.log("Design request created successfully:", request);

      // Upload files if any
      if (formData.files.length > 0) {
        console.log("Uploading files...");
        await uploadFiles(formData.files, request.id, userId);
        console.log("Files uploaded successfully");
      }

      // Award XP to user - Get current XP first, then increment
      console.log("Updating user XP...");
      const { data: currentUser, error: fetchError } = await supabase
        .from("users")
        .select("xp")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching current user XP:", fetchError);
      } else {
        const newXP = (currentUser?.xp || 0) + 10;
        const { error: xpError } = await supabase
          .from("users")
          .update({ xp: newXP })
          .eq("id", userId);

        if (xpError) {
          const xpErrorMessage =
            xpError?.message ||
            xpError?.details ||
            xpError?.hint ||
            JSON.stringify(xpError, Object.getOwnPropertyNames(xpError));
          console.error("XP update error:", xpErrorMessage);
        } else {
          console.log("XP updated successfully. New XP:", newXP);
        }
      }

      console.log("Project submission completed successfully");

      // Store request ID for navigation
      setSubmittedRequestId(request.id);

      // Show success animation
      setShowSuccessAnimation(true);

      return request;
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.details ||
        error?.hint ||
        (typeof error === "string"
          ? error
          : JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Project submission error:", errorMessage);
      toast.error(`Submission failed: ${errorMessage}`);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccessAnimation(false);
    toast.success("🎉 You earned 10 XP! Ready to chat with our team!");

    // Navigate directly to chat with the project context for seamless experience
    setTimeout(() => {
      if (submittedRequestId) {
        navigate(`/chat?request=${submittedRequestId}`);
      } else {
        navigate("/dashboard");
      }
    }, 500);
  };

  return {
    submitProject,
    loading,
    showSuccessAnimation,
    handleSuccessComplete,
    submittedRequestId,
  };
};
