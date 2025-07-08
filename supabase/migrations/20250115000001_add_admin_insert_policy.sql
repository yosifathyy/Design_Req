-- Add policy to allow admins to create new users
CREATE POLICY "Admins can create users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );
