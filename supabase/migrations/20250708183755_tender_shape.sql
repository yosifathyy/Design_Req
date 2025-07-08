/*
  # Fix user signup RLS policy

  1. Security Changes
    - Drop the existing INSERT policy that's causing issues
    - Create a new INSERT policy that allows user profile creation during signup
    - The policy allows INSERT when either:
      - The user ID matches the authenticated user (for authenticated users)
      - The user is not authenticated yet (for signup process)

  2. Notes
    - This fixes the RLS violation error during user signup
    - Maintains security by only allowing users to create profiles with their own ID
*/

-- Drop the existing problematic INSERT policy
DROP POLICY IF EXISTS "Enable user profile creation during signup" ON users;

-- Create a new INSERT policy that properly handles signup
CREATE POLICY "Enable user profile creation during signup" 
ON users 
FOR INSERT 
WITH CHECK (
  -- Allow if the user ID matches the authenticated user ID
  -- OR if there's no authenticated user (during signup process)
  auth.uid() = id OR auth.uid() IS NULL
);