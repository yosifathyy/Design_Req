-- =====================================================
-- SIMPLE FIX FOR CHAT POLICIES
-- =====================================================
-- Add the missing INSERT policy for chats table

-- Allow users to create chats for requests they own or are assigned to
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

-- Allow users to add participants to chats they can access
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

-- Verify the fix
SELECT 'Chat INSERT policies added successfully!' as status;
