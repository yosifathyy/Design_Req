
-- Add the missing style column to design_requests table
ALTER TABLE design_requests ADD COLUMN IF NOT EXISTS style text;

-- Update the constraint to include the new website category if it doesn't exist
ALTER TABLE design_requests DROP CONSTRAINT IF EXISTS design_requests_category_check;
ALTER TABLE design_requests ADD CONSTRAINT design_requests_category_check 
CHECK (category IN ('photoshop', '3d', 'design', 'website', 'logo'));
