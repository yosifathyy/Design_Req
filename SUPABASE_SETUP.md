# Supabase Database Setup

## Quick Setup Instructions

Your Supabase project is connected! Here's how to complete the setup:

### 1. Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/dnmygswmvzxnkqhcslhc)
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire content from `setup_database.sql` file
5. Click **Run** to execute the script

### 2. Authentication Setup

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your app URL: `https://your-app-domain.com`
3. Under **Redirect URLs**, add: `https://your-app-domain.com/auth/callback`

### 3. Storage Setup

The setup script automatically creates:

- `avatars` bucket (public) - for user profile pictures
- `files` bucket (private) - for project files

### 4. Test the Connection

1. Visit the `/login` page in your app
2. Check the browser console for connection test results
3. Try logging in with demo credentials:
   - **Email**: `admin@demo.com`
   - **Password**: `demo123`

## Database Schema Overview

### Core Tables:

- **users** - User profiles and authentication
- **design_requests** - Project requests
- **files** - File uploads
- **chats** - Messaging system
- **messages** - Chat messages
- **contact_submissions** - Contact form data
- **audit_logs** - System activity tracking
- **system_alerts** - Admin notifications

### Demo Users Created:

1. **Admin User**
   - Email: `admin@demo.com`
   - Role: admin
   - Access: Full admin panel access

2. **Designer User**
   - Email: `designer@demo.com`
   - Role: designer
   - Skills: Photoshop, Illustrator, 3D Design
   - Rate: $75/hour

## Troubleshooting

### Common Issues:

1. **"relation does not exist" errors**
   - Make sure you ran the complete `setup_database.sql` script
   - Check that all tables were created successfully

2. **Permission denied errors**
   - Verify RLS policies are in place
   - Check user authentication status

3. **Storage upload fails**
   - Ensure storage buckets are created
   - Verify storage policies are applied

### Checking Connection:

The app includes automatic connection testing. Check browser console for:

- ✅ Supabase connected successfully
- 📋 Database schema check results

## Environment Variables

Your current configuration:

```
VITE_SUPABASE_URL=https://dnmygswmvzxnkqhcslhc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Next Steps

1. Run the database setup script
2. Test the connection by visiting `/login`
3. Create your first admin user or use demo credentials
4. Explore the admin panel at `/admin`
5. Test user creation at `/admin/users/create`

Need help? Check the browser console for detailed error messages and connection status.
