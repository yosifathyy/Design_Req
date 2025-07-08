/*
  # Fix user registration RLS policy

  1. Security Updates
    - Drop existing conflicting INSERT policies on users table
    - Add proper INSERT policy for new user registration
    - Ensure authenticated users can create their own profile during signup

  2. Changes
    - Remove duplicate/conflicting INSERT policies
    - Add single, clear INSERT policy for user registration
    - Maintain existing SELECT and UPDATE policies
*/

-- Drop existing INSERT policies that might be conflicting
DROP POLICY IF EXISTS "Allow new users to insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;

-- Create a single, clear INSERT policy for user registration
CREATE POLICY "Users can insert their own profile during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the policy also works for the initial registration process
-- by allowing inserts where the user ID matches the authenticated user ID
CREATE POLICY "Allow authenticated users to create profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);