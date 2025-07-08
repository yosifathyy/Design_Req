/*
  # Add INSERT policy for user registration

  1. Security Changes
    - Add RLS policy to allow users to insert their own profile during registration
    - Policy ensures users can only insert data with their own auth.uid()

  2. Changes Made
    - Added "Users can create their own profile" policy for INSERT operations
    - Policy restricts insertion to rows where id matches auth.uid()
*/

-- Add policy to allow users to insert their own profile during registration
CREATE POLICY "Users can create their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);