-- Add additional profile fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[], 
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);

-- Add comments for the new columns
COMMENT ON COLUMN users.bio IS 'User biography or description';
COMMENT ON COLUMN users.skills IS 'Array of user skills (mainly for designers)';
COMMENT ON COLUMN users.hourly_rate IS 'Hourly rate for designers in USD';
