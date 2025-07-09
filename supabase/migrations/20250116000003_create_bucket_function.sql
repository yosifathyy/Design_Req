-- Create function to create chat files bucket (bypasses RLS)
CREATE OR REPLACE FUNCTION create_chat_files_bucket()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'chat-files', 
    'chat-files', 
    true, 
    10485760, -- 10MB
    ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip', 'application/x-rar-compressed']
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create RLS policies for the bucket
  INSERT INTO storage.objects_policies (id, bucket_id, name, definition)
  VALUES 
    ('chat-files-upload', 'chat-files', 'Users can upload chat files', 'bucket_id = ''chat-files'' AND auth.role() = ''authenticated'''),
    ('chat-files-view', 'chat-files', 'Users can view chat files', 'bucket_id = ''chat-files'' AND auth.role() = ''authenticated'''),
    ('chat-files-delete', 'chat-files', 'Users can delete their chat files', 'bucket_id = ''chat-files'' AND auth.uid()::text = (storage.foldername(name))[1]')
  ON CONFLICT (id) DO NOTHING;

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error, return false
    RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_chat_files_bucket() TO authenticated;
