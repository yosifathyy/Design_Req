-- Add storage policies for the files bucket to allow file uploads

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload project files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');

-- Allow users to view files (for downloads/previews)
CREATE POLICY "Users can view project files" ON storage.objects
  FOR SELECT USING (bucket_id = 'files' AND auth.role() = 'authenticated');

-- Allow users to delete their own files
CREATE POLICY "Users can delete their project files" ON storage.objects
  FOR DELETE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

-- Allow admins to manage all files
CREATE POLICY "Admins can manage all project files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'files' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );
