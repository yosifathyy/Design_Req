-- Grant admin role to the authenticated user for testing
UPDATE public.users 
SET role = 'admin' 
WHERE id = 'd7c29b78-1272-4453-a7cf-28ef0591985a';