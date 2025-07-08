-- =====================================================
-- CREATE DEMO AUTH USERS IN SUPABASE
-- =====================================================
-- This script creates actual authentication accounts for demo users
-- Run this in your Supabase SQL Editor

-- First, let's create the auth users directly in the auth.users table
-- Note: This is an advanced approach. Normally you'd sign up through the UI.

-- Enable the auth schema access (if needed)
-- You might need to run this as a Database Function instead

-- For Supabase, we need to insert into auth.users table directly
-- This creates the authentication account

-- Insert demo admin auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@demo.com',
  crypt('demo123', gen_salt('bf')), -- This encrypts the password
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Insert demo designer auth user  
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'designer@demo.com',
  crypt('demo123', gen_salt('bf')), -- This encrypts the password
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create identities for the users (required for email/password auth)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{"sub": "00000000-0000-0000-0000-000000000001", "email": "admin@demo.com"}',
  'email',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (provider_id, provider) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  '{"sub": "00000000-0000-0000-0000-000000000002", "email": "designer@demo.com"}',
  'email',
  '00000000-0000-0000-0000-000000000002',
  NOW(),
  NOW()
) ON CONFLICT (provider_id, provider) DO NOTHING;

SELECT 'Demo auth users created successfully! You can now login with admin@demo.com / demo123' as status;
