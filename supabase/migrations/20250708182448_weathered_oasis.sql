/*
  # Add RLS policy for user profile creation

  1. Security
    - Add policy to allow authenticated users to insert their own profile data
    - This fixes the RLS violation when new users try to create their profile after signup

  2. Changes
    - Creates INSERT policy for users table allowing users to insert their own data
    - Uses auth.uid() = id to ensure users can only create their own profile
*/

-- Add policy to allow new users to insert their own profile
CREATE POLICY "Allow new users to insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);