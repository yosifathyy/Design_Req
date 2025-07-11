
-- Add website category to design_requests table and update constraints
ALTER TABLE design_requests DROP CONSTRAINT IF EXISTS design_requests_category_check;
ALTER TABLE design_requests ADD CONSTRAINT design_requests_category_check 
CHECK (category IN ('photoshop', '3d', 'design', 'website', 'logo'));

-- Add style field to design_requests for storing style preferences
ALTER TABLE design_requests ADD COLUMN IF NOT EXISTS style text;

-- Update projects table to match design_requests structure
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE projects ADD CONSTRAINT projects_category_check 
CHECK (category IN ('photoshop', '3d', 'design', 'website', 'logo'));

-- Add style field to projects table as well
ALTER TABLE projects ADD COLUMN IF NOT EXISTS style text;

-- Ensure files table can handle multiple file uploads per request
-- (This table structure is already sufficient for our needs)

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_design_requests_user_id ON design_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_files_request_id ON files(request_id);
