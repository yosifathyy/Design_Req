-- =====================================================
-- COMPLETE DATABASE SETUP FOR DESIGN REQUESTS APP
-- =====================================================
-- Run this script in your Supabase SQL Editor to set up the complete database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'designer', 'admin', 'super-admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  bio TEXT,
  skills TEXT[],
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 2. USER BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. DESIGN REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS design_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in-progress', 'completed', 'delivered')),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  designer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. FILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  thumbnail TEXT,
  request_id UUID REFERENCES design_requests(id) ON DELETE CASCADE,
  message_id UUID,
  uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CHATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES design_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CHAT PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id, user_id)
);

-- =====================================================
-- 7. MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. CONTACT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. SYSTEM ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Users table policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Enable user profile creation during signup" ON users;
CREATE POLICY "Enable user profile creation during signup"
  ON users FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
    OR auth.uid() = id
  );

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

-- Design requests policies
DROP POLICY IF EXISTS "Users can view their own requests" ON design_requests;
CREATE POLICY "Users can view their own requests"
  ON design_requests FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR designer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'super-admin')
    )
  );

DROP POLICY IF EXISTS "Users can create requests" ON design_requests;
CREATE POLICY "Users can create requests"
  ON design_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own requests" ON design_requests;
CREATE POLICY "Users can update their own requests"
  ON design_requests FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR designer_id = auth.uid()
    OR EXISTS (
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

-- =====================================================
-- 12. STORAGE BUCKETS
-- =====================================================

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create files bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', false)
ON CONFLICT (id) DO NOTHING;

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
-- 13. SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert a demo admin user
INSERT INTO users (
  id,
  email,
  name,
  role,
  status,
  avatar_url,
  bio,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@demo.com',
  'Demo Admin',
  'admin',
  'active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  'Demo administrator account for testing',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert a demo designer
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
) VALUES (
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
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready for the Design Requests app.
-- You can now use the application with full functionality.
