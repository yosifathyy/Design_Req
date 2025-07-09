-- Simplified Chat System Migration
-- This creates a simple chat system using just a messages table with project_id

-- Drop existing chat tables if they exist (clean slate)
DROP TABLE IF EXISTS chat_participants CASCADE;
DROP TABLE IF EXISTS chats CASCADE;

-- Create simplified messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES design_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_project_created ON messages(project_id, created_at);

-- Add last_seen field to users table for unread count
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create updated_at trigger for messages
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
-- Users can read messages for projects they're involved in (as client or designer) or if they're admin
CREATE POLICY "Users can read project messages" ON messages
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM design_requests WHERE id = project_id
    UNION
    SELECT designer_id FROM design_requests WHERE id = project_id AND designer_id IS NOT NULL
  )
  OR 
  auth.uid() IN (
    SELECT id FROM users WHERE role IN ('admin', 'super-admin')
  )
);

-- Users can insert messages to projects they're involved in or if they're admin
CREATE POLICY "Users can send project messages" ON messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND (
    auth.uid() IN (
      SELECT user_id FROM design_requests WHERE id = project_id
      UNION
      SELECT designer_id FROM design_requests WHERE id = project_id AND designer_id IS NOT NULL
    )
    OR 
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'super-admin')
    )
  )
);

-- Users can update their own messages
CREATE POLICY "Users can update own messages" ON messages
FOR UPDATE USING (auth.uid() = sender_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages" ON messages
FOR DELETE USING (auth.uid() = sender_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Function to update last_seen timestamp
CREATE OR REPLACE FUNCTION update_user_last_seen()
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET last_seen = NOW() 
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_last_seen() TO authenticated;
