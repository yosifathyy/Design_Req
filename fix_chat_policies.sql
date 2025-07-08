-- =====================================================
-- FIX CHAT RLS POLICIES
-- =====================================================
-- Add missing Row Level Security policies for chat functionality

-- Chat table policies
DROP POLICY IF EXISTS "Users can view their chats" ON chats;
CREATE POLICY "Users can view their chats"
  ON chats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM design_requests
      WHERE design_requests.id = chats.request_id 
      AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create chats for their requests" ON chats;
CREATE POLICY "Users can create chats for their requests"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM design_requests
      WHERE design_requests.id = request_id 
      AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
    )
  );

-- Chat participants table policies
DROP POLICY IF EXISTS "Users can view chat participants" ON chat_participants;
CREATE POLICY "Users can view chat participants"
  ON chat_participants FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM chats
      JOIN design_requests ON design_requests.id = chats.request_id
      WHERE chats.id = chat_participants.chat_id
      AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can add participants to their chats" ON chat_participants;
CREATE POLICY "Users can add participants to their chats"
  ON chat_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      JOIN design_requests ON design_requests.id = chats.request_id
      WHERE chats.id = chat_id
      AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
    )
  );

-- Messages table policies
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
CREATE POLICY "Users can view messages in their chats"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = messages.chat_id
      AND chat_participants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages in their chats" ON messages;
CREATE POLICY "Users can send messages in their chats"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = messages.chat_id
      AND chat_participants.user_id = auth.uid()
    )
  );

-- Admin policies for chat management
DROP POLICY IF EXISTS "Admins can manage all chats" ON chats;
CREATE POLICY "Admins can manage all chats"
  ON chats FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );

DROP POLICY IF EXISTS "Admins can manage all messages" ON messages;
CREATE POLICY "Admins can manage all messages"
  ON messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );

-- Test the policies by checking what the current user can access
SELECT 'Chat RLS policies updated successfully!' as status;

-- Show current user for verification
SELECT 
  auth.uid() as current_user_id,
  auth.role() as auth_role;
