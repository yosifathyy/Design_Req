/*
  # Fix users table RLS policies

  1. Changes
    - Replace uid() with auth.uid() in all policies
    - Drop problematic policy that causes infinite recursion
    - Create new admin policy that avoids recursion
    - Clean up duplicate policies
    - Ensure proper user profile creation policy

  2. Security
    - Maintains proper access control
    - Fixes infinite recursion issue
    - Ensures users can only access their own data
    - Allows admins to view all users
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Drop duplicate policy (there are two "Users can view their own profile" policies)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;

-- Recreate a simplified admin policy that doesn't cause recursion
-- This uses auth.jwt() to check role claims instead of querying the users table
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_role')::text IN ('admin', 'super-admin')
    OR auth.uid() = id
  );

-- Ensure the user profile creation policy is properly configured
DROP POLICY IF EXISTS "Enable user profile creation during signup" ON users;
CREATE POLICY "Enable user profile creation during signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = id OR auth.uid() IS NULL
  );

-- Ensure users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure users can read their own profile (single policy)
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);