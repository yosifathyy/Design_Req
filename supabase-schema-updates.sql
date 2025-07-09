-- Add last_read_at column to chat_participants table
ALTER TABLE chat_participants 
ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create an index for better performance on read queries
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_read 
ON chat_participants(user_id, chat_id, last_read_at);

-- Create an index for better performance on message queries
CREATE INDEX IF NOT EXISTS idx_messages_chat_created 
ON messages(chat_id, created_at);

-- Create a function to update last_read_at when a user views a chat
CREATE OR REPLACE FUNCTION mark_chat_as_read(p_chat_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_participants 
  SET last_read_at = NOW()
  WHERE chat_id = p_chat_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get unread count for a user
CREATE OR REPLACE FUNCTION get_unread_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER := 0;
  chat_record RECORD;
BEGIN
  -- Loop through all chats the user participates in
  FOR chat_record IN 
    SELECT chat_id, COALESCE(last_read_at, '1970-01-01'::timestamptz) as last_read_at
    FROM chat_participants 
    WHERE user_id = p_user_id
  LOOP
    -- Count unread messages in this chat
    SELECT unread_count + COALESCE(COUNT(*), 0) INTO unread_count
    FROM messages 
    WHERE chat_id = chat_record.chat_id 
      AND sender_id != p_user_id 
      AND created_at > chat_record.last_read_at;
  END LOOP;
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable real-time for the tables we need
ALTER publication supabase_realtime ADD TABLE chat_participants;
ALTER publication supabase_realtime ADD TABLE messages;

-- Create a trigger to automatically update updated_at on chat_participants
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at column if it doesn't exist
ALTER TABLE chat_participants 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger for chat_participants
DROP TRIGGER IF EXISTS update_chat_participants_updated_at ON chat_participants;
CREATE TRIGGER update_chat_participants_updated_at
  BEFORE UPDATE ON chat_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION mark_chat_as_read(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_count(UUID) TO authenticated;

-- RLS policies for chat_participants (if not already exist)
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own chat participations
CREATE POLICY IF NOT EXISTS "Users can view their own chat participations" 
ON chat_participants FOR SELECT 
USING (user_id = auth.uid());

-- Policy for users to update their own chat participations (for read status)
CREATE POLICY IF NOT EXISTS "Users can update their own chat participations" 
ON chat_participants FOR UPDATE 
USING (user_id = auth.uid());

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
