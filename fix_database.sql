-- =====================================================
-- FIX EXISTING DATABASE - ADD MISSING COLUMNS
-- =====================================================
-- Run this script in your Supabase SQL Editor to fix the existing database

-- Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    -- Add bio column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'bio'
    ) THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column to users table';
    END IF;

    -- Add skills column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'skills'
    ) THEN
        ALTER TABLE users ADD COLUMN skills TEXT[];
        RAISE NOTICE 'Added skills column to users table';
    END IF;

    -- Add hourly_rate column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'hourly_rate'
    ) THEN
        ALTER TABLE users ADD COLUMN hourly_rate DECIMAL(10,2);
        RAISE NOTICE 'Added hourly_rate column to users table';
    END IF;
END $$;

-- Create missing tables if they don't exist

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- System alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
        RAISE NOTICE 'Created avatars storage bucket';
    END IF;
END $$;

-- Create files bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'files'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', false);
        RAISE NOTICE 'Created files storage bucket';
    END IF;
END $$;

-- =====================================================
-- SECURITY POLICIES
-- =====================================================

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Admins can create users" ON users;
CREATE POLICY "Admins can create users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );

-- Contact submissions policies
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;
CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );

-- Enable RLS on new tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Storage policies for avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can upload any avatar" ON storage.objects;
CREATE POLICY "Admins can upload any avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );

-- =====================================================
-- CREATE DEMO USERS (SAFE UPSERT)
-- =====================================================

-- Create demo admin user (only if it doesn't exist)
INSERT INTO users (
  id,
  email,
  name,
  role,
  status,
  avatar_url,
  bio,
  created_at
) 
SELECT 
  '00000000-0000-0000-0000-000000000001',
  'admin@demo.com',
  'Demo Admin',
  'admin',
  'active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  'Demo administrator account for testing',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@demo.com'
);

-- Create demo designer user (only if it doesn't exist)
INSERT INTO users (
  id,
  email,
  name,
  role,
  status,
  avatar_url,
  bio,
  skills,
  hourly_rate,
  created_at
) 
SELECT 
  '00000000-0000-0000-0000-000000000002',
  'designer@demo.com',
  'Demo Designer',
  'designer',
  'active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
  'Creative designer specializing in digital art',
  ARRAY['Photoshop', 'Illustrator', '3D Design'],
  75.00,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'designer@demo.com'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check that all required columns exist
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') 
    THEN '✅ bio column exists'
    ELSE '❌ bio column missing'
  END as bio_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'skills') 
    THEN '✅ skills column exists'
    ELSE '❌ skills column missing'
  END as skills_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'hourly_rate') 
    THEN '✅ hourly_rate column exists'
    ELSE '❌ hourly_rate column missing'
  END as hourly_rate_status;

-- Show user count
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE role = 'designer') as designer_users
FROM users;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
SELECT '🎉 Database fix completed successfully!' as status;
