/*
  # Fix infinite recursion in users table RLS policies

  1. Policy Updates
    - Remove the problematic "Admins can view all users" policy that causes infinite recursion
    - Update policies to avoid self-referential queries on the users table
    - Use auth.jwt() claims or simpler conditions where possible

  2. Security
    - Maintain proper access control without infinite recursion
    - Ensure users can still read their own profiles
    - Allow proper admin access through simplified conditions

  3. Changes
    - Drop problematic policies
    - Recreate with non-recursive conditions
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
    OR uid() = id
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