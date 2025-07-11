import { supabase } from "@/integrations/supabase/client";

export const applyFileStoragePolicies = async () => {
  try {
    console.log("🔧 Applying storage policies for files bucket...");

    // Check if policies already exist by attempting to query them
    const { data: existingPolicies, error: policiesError } = await supabase.rpc(
      "check_storage_policies",
    );

    if (policiesError) {
      console.log(
        "Could not check existing policies, proceeding with creation",
      );
    }

    // Apply the storage policies using SQL
    const storagePolicies = `
      -- Add storage policies for the files bucket to allow file uploads

      -- Allow authenticated users to upload files
      CREATE POLICY IF NOT EXISTS "Users can upload project files" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');

      -- Allow users to view files (for downloads/previews)
      CREATE POLICY IF NOT EXISTS "Users can view project files" ON storage.objects
        FOR SELECT USING (bucket_id = 'files' AND auth.role() = 'authenticated');

      -- Allow users to delete their own files
      CREATE POLICY IF NOT EXISTS "Users can delete their project files" ON storage.objects
        FOR DELETE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

      -- Allow admins to manage all files
      CREATE POLICY IF NOT EXISTS "Admins can manage all project files" ON storage.objects
        FOR ALL USING (
          bucket_id = 'files' AND 
          auth.role() = 'authenticated' AND
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
          )
        );
    `;

    const { error } = await supabase.rpc("exec_sql", { sql: storagePolicies });

    if (error) {
      console.error("❌ Error applying storage policies:", error);
      throw error;
    }

    console.log("✅ Storage policies applied successfully");
    return true;
  } catch (error: any) {
    console.error("❌ Failed to apply storage policies:", error);
    return false;
  }
};
