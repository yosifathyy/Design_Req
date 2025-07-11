-- Enhanced Admin Database Structure (Fixed Version)
-- Run this SQL to add additional tables for admin functionality

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string', -- string, boolean, integer, json
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Design Agency Pro', 'string', 'Name of the website'),
('site_description', 'Professional design services platform', 'string', 'Description of the website'),
('admin_email', 'admin@designagency.com', 'string', 'Primary admin email address'),
('allow_registration', 'true', 'boolean', 'Allow new user registrations'),
('require_email_verification', 'false', 'boolean', 'Require email verification for new accounts'),
('enable_notifications', 'true', 'boolean', 'Enable system notifications'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('max_file_size', '10MB', 'string', 'Maximum file upload size'),
('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx', 'string', 'Allowed file types for upload'),
('session_timeout', '24', 'string', 'Session timeout in hours'),
('password_min_length', '8', 'integer', 'Minimum password length'),
('enable_two_factor', 'false', 'boolean', 'Enable two-factor authentication'),
('backup_enabled', 'true', 'boolean', 'Enable automatic backups'),
('analytics_enabled', 'true', 'boolean', 'Enable analytics tracking'),
('debug_mode', 'false', 'boolean', 'Enable debug mode'),
('cache_enabled', 'true', 'boolean', 'Enable caching'),
('rate_limit_enabled', 'true', 'boolean', 'Enable rate limiting')
ON CONFLICT (setting_key) DO NOTHING;

-- Admin Notifications Table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, warning, error, success
  target_user_id UUID,
  target_role VARCHAR(50), -- admin, super-admin, all
  is_read BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- System Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action_type VARCHAR(100) NOT NULL, -- login, logout, create_user, delete_user, etc.
  resource_type VARCHAR(100), -- user, project, invoice, etc.
  resource_id UUID,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL,
  metric_unit VARCHAR(50),
  metric_type VARCHAR(50) DEFAULT 'gauge', -- gauge, counter, histogram
  tags JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Sessions Table (for tracking admin activity)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  session_token VARCHAR(500) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Backups Table
CREATE TABLE IF NOT EXISTS system_backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  backup_name VARCHAR(255) NOT NULL,
  backup_type VARCHAR(50) DEFAULT 'full', -- full, incremental, differential
  file_path VARCHAR(500),
  file_size BIGINT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, failed
  created_by UUID,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Feature Flags Table
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flag_name VARCHAR(100) UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  description TEXT,
  target_audience VARCHAR(50) DEFAULT 'all', -- all, admin, premium, beta
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default feature flags
INSERT INTO feature_flags (flag_name, is_enabled, description, target_audience) VALUES
('enhanced_analytics', true, 'Enable enhanced analytics dashboard', 'admin'),
('beta_features', false, 'Enable beta features for testing', 'beta'),
('advanced_search', true, 'Enable advanced search functionality', 'all'),
('real_time_notifications', true, 'Enable real-time notifications', 'all'),
('dark_mode', true, 'Enable dark mode theme', 'all')
ON CONFLICT (flag_name) DO NOTHING;

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  preference_key VARCHAR(100) NOT NULL,
  preference_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, preference_key)
);

-- System Health Checks Table
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_name VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL, -- healthy, warning, critical, unknown
  response_time INTEGER, -- in milliseconds
  error_message TEXT,
  metadata JSONB,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Rate Limits Table
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  ip_address INET,
  endpoint VARCHAR(255),
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON system_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_system_metrics_metric_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_target_user_id ON admin_notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_health_checks_checked_at ON health_checks(checked_at);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_user_id ON api_rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_ip_address ON api_rate_limits(ip_address);

-- Enable Row Level Security (RLS) for sensitive tables
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_backups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin-only access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin only access to system settings') THEN
    CREATE POLICY "Admin only access to system settings" ON system_settings
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super-admin')
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin only access to admin notifications') THEN
    CREATE POLICY "Admin only access to admin notifications" ON admin_notifications
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super-admin')
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin only access to activity logs') THEN
    CREATE POLICY "Admin only access to activity logs" ON activity_logs
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super-admin')
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin only access to system metrics') THEN
    CREATE POLICY "Admin only access to system metrics" ON system_metrics
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super-admin')
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin only access to admin sessions') THEN
    CREATE POLICY "Admin only access to admin sessions" ON admin_sessions
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super-admin')
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin only access to system backups') THEN
    CREATE POLICY "Admin only access to system backups" ON system_backups
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super-admin')
        )
      );
  END IF;
END $$;

-- User preferences can be accessed by the user themselves
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can access their own preferences') THEN
    CREATE POLICY "Users can access their own preferences" ON user_preferences
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Feature flags are readable by all authenticated users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read feature flags') THEN
    CREATE POLICY "Authenticated users can read feature flags" ON feature_flags
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Only admins can modify feature flags
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin only modify feature flags') THEN
    CREATE POLICY "Admin only modify feature flags" ON feature_flags
      FOR INSERT, UPDATE, DELETE USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super-admin')
        )
      );
  END IF;
END $$;

-- Function to log admin activities
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs (user_id, action_type, resource_type, resource_id, description)
    VALUES (auth.uid(), TG_OP || '_' || TG_TABLE_NAME, TG_TABLE_NAME, NEW.id, 'Created new ' || TG_TABLE_NAME);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_logs (user_id, action_type, resource_type, resource_id, description)
    VALUES (auth.uid(), TG_OP || '_' || TG_TABLE_NAME, TG_TABLE_NAME, NEW.id, 'Updated ' || TG_TABLE_NAME);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO activity_logs (user_id, action_type, resource_type, resource_id, description)
    VALUES (auth.uid(), TG_OP || '_' || TG_TABLE_NAME, TG_TABLE_NAME, OLD.id, 'Deleted ' || TG_TABLE_NAME);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update system settings
CREATE OR REPLACE FUNCTION update_system_setting(key_name TEXT, new_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE system_settings 
  SET setting_value = new_value, updated_at = NOW()
  WHERE setting_key = key_name;
  
  IF FOUND THEN
    RETURN TRUE;
  ELSE
    INSERT INTO system_settings (setting_key, setting_value)
    VALUES (key_name, new_value);
    RETURN TRUE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system setting
CREATE OR REPLACE FUNCTION get_system_setting(key_name TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT setting_value INTO result
  FROM system_settings
  WHERE setting_key = key_name;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create admin notification
CREATE OR REPLACE FUNCTION create_admin_notification(
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT DEFAULT 'info',
  target_user UUID DEFAULT NULL,
  target_role_name TEXT DEFAULT 'admin'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO admin_notifications (title, message, type, target_user_id, target_role)
  VALUES (notification_title, notification_message, notification_type, target_user, target_role_name)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users for the functions
GRANT EXECUTE ON FUNCTION get_system_setting(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_system_setting(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_notification(TEXT, TEXT, TEXT, UUID, TEXT) TO authenticated;

-- Insert some sample data for testing
INSERT INTO admin_notifications (title, message, type, target_role) VALUES
('System Update', 'A new system update is available. Please review the changelog.', 'info', 'admin'),
('Security Alert', 'Multiple failed login attempts detected from IP 192.168.1.100', 'warning', 'admin'),
('Backup Complete', 'Daily system backup completed successfully at ' || NOW()::TEXT, 'success', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO activity_logs (user_id, action_type, resource_type, description, ip_address) VALUES
(NULL, 'system_startup', 'system', 'System startup completed', '127.0.0.1'),
(NULL, 'backup_created', 'backup', 'Automatic backup created', '127.0.0.1'),
(NULL, 'health_check', 'system', 'System health check passed', '127.0.0.1')
ON CONFLICT DO NOTHING;

INSERT INTO system_metrics (metric_name, metric_value, metric_unit, metric_type) VALUES
('cpu_usage', 25.5, 'percent', 'gauge'),
('memory_usage', 68.2, 'percent', 'gauge'),
('disk_usage', 78.9, 'percent', 'gauge'),
('active_connections', 145, 'count', 'gauge'),
('response_time', 95, 'milliseconds', 'gauge'),
('uptime', 99.9, 'percent', 'gauge')
ON CONFLICT DO NOTHING;

INSERT INTO health_checks (check_name, status, response_time) VALUES
('database_connection', 'healthy', 25),
('redis_connection', 'healthy', 15),
('email_service', 'healthy', 120),
('file_storage', 'healthy', 45),
('api_endpoints', 'healthy', 65)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE system_settings IS 'Stores system-wide configuration settings';
COMMENT ON TABLE admin_notifications IS 'Stores notifications for admin users';
COMMENT ON TABLE activity_logs IS 'Logs all admin and system activities';
COMMENT ON TABLE system_metrics IS 'Stores system performance metrics';
COMMENT ON TABLE admin_sessions IS 'Tracks admin user sessions';
COMMENT ON TABLE system_backups IS 'Records system backup information';
COMMENT ON TABLE feature_flags IS 'Controls feature availability';
COMMENT ON TABLE user_preferences IS 'Stores user-specific preferences';
COMMENT ON TABLE health_checks IS 'System health monitoring data';
COMMENT ON TABLE api_rate_limits IS 'API rate limiting data';
