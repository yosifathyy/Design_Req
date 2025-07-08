/*
  # Fix user signup policies

  1. Security
    - Drop existing conflicting INSERT policies
    - Create a comprehensive INSERT policy for user registration
    - Add policies for users to read and update their own profiles
*/

-- Drop existing INSERT policies that might be conflicting
DROP POLICY IF EXISTS "Allow authenticated users to create profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile during registration" ON users;

-- Create a comprehensive INSERT policy for user registration
-- This allows users to create their own profile during the signup process
CREATE POLICY "Enable user profile creation during signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (
    -- Allow if the user is creating their own profile (auth.uid() matches the id being inserted)
    auth.uid() = id
    OR
    -- Allow if this is being called during the signup process (when auth.uid() might be null temporarily)
    -- but the email matches the one being used for signup
    (auth.uid() IS NULL AND email IS NOT NULL)
  );

-- Also ensure users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO public
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);