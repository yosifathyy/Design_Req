/*
  # Fix RLS policies for users table

  1. Changes
    - Replace `uid()` with `auth.uid()` in all policies
    - Fix the "Admins can view all users" policy to avoid infinite recursion
    - Ensure proper user signup policy exists

  2. Security
    - Maintain existing security model while fixing function references
    - Ensure users can only access their own data
    - Allow admins to view all users without recursion
*/

-- Drop the problematic policies that use uid() instead of auth.uid()
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable user profile creation during signup" ON users;

-- Recreate admin view policy without recursion
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    ((auth.jwt() ->> 'role')::text IN ('admin', 'super-admin'))
    OR (auth.uid() = id)
  );

-- Recreate user profile read policy
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Recreate user profile update policy
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Recreate user signup policy
CREATE POLICY "Enable user profile creation during signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = id OR auth.uid() IS NULL
  );