import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Copy, ExternalLink, Database } from "lucide-react";

const MIGRATION_SQL = `-- Simplified Chat System Migration
-- Run this SQL in your Supabase SQL Editor

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
GRANT EXECUTE ON FUNCTION update_user_last_seen() TO authenticated;`;

export const ManualMigration: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSupabaseDashboard = () => {
    window.open("https://supabase.com/dashboard", "_blank");
  };

  return (
    <Card className="border-4 border-blue-500 bg-blue-50 p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-bold text-blue-800">
            Manual Database Migration
          </h3>
        </div>

        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Follow these steps to apply the migration manually:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Copy the SQL migration code below</li>
            <li>Open your Supabase Dashboard</li>
            <li>Go to SQL Editor</li>
            <li>Paste and run the migration SQL</li>
            <li>Return here and click "Recheck Status"</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={copyToClipboard}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Copy Migration SQL"}
          </Button>

          <Button
            onClick={openSupabaseDashboard}
            variant="outline"
            className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Supabase Dashboard
          </Button>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-blue-800 mb-2">
            Show Migration SQL
          </summary>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto border">
            {MIGRATION_SQL}
          </pre>
        </details>
      </div>
    </Card>
  );
};

export default ManualMigration;
