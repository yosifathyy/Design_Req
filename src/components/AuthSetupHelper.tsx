import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Copy } from "lucide-react";

export function AuthSetupHelper() {
  const [authStatus, setAuthStatus] = useState<{
    configured: boolean;
    hasUsers: boolean;
    hasAuthUsers: boolean;
    error?: string;
  }>({ configured: false, hasUsers: false, hasAuthUsers: false });

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuthSetup();
  }, []);

  const checkAuthSetup = async () => {
    setChecking(true);
    try {
      if (!isSupabaseConfigured) {
        setAuthStatus({
          configured: false,
          hasUsers: false,
          hasAuthUsers: false,
          error: "Supabase not configured",
        });
        setChecking(false);
        return;
      }

      // Check if users table has data
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("email")
        .limit(5);

      if (usersError) {
        setAuthStatus({
          configured: true,
          hasUsers: false,
          hasAuthUsers: false,
          error: `Users table error: ${usersError.message}`,
        });
        setChecking(false);
        return;
      }

      // Try to sign in with demo credentials to test auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: "admin@demo.com",
          password: "demo123",
        });

      // If sign in was successful, sign out immediately to not affect current session
      if (authData?.session) {
        await supabase.auth.signOut();
      }

      setAuthStatus({
        configured: true,
        hasUsers: users && users.length > 0,
        hasAuthUsers: !authError && authData?.user != null,
        error: authError?.message,
      });
    } catch (error: any) {
      setAuthStatus({
        configured: true,
        hasUsers: false,
        hasAuthUsers: false,
        error: error.message,
      });
    }
    setChecking(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sqlScript = `-- =====================================================
-- CREATE DEMO AUTH USERS IN SUPABASE
-- =====================================================
-- Run this in your Supabase SQL Editor

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
  crypt('demo123', gen_salt('bf')),
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
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create identities for the users
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

SELECT 'Demo auth users created successfully!' as status;`;

  if (checking) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Checking Authentication Setup...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            Checking Supabase configuration...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Authentication Setup Status
            {authStatus.configured &&
            authStatus.hasUsers &&
            authStatus.hasAuthUsers ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
          </CardTitle>
          <CardDescription>
            Current status of your Supabase authentication setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {authStatus.configured ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Supabase Configured</span>
            </div>
            <div className="flex items-center gap-2">
              {authStatus.hasUsers ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>User Profiles Exist</span>
            </div>
            <div className="flex items-center gap-2">
              {authStatus.hasAuthUsers ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span>Auth Accounts Exist</span>
            </div>
          </div>

          {authStatus.error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authStatus.error}</AlertDescription>
            </Alert>
          )}

          {authStatus.configured &&
            authStatus.hasUsers &&
            authStatus.hasAuthUsers && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ✅ Authentication is fully set up! You can sign in with:
                  <br />
                  <strong>admin@demo.com</strong> / demo123
                  <br />
                  <strong>designer@demo.com</strong> / demo123
                </AlertDescription>
              </Alert>
            )}

          {authStatus.configured &&
            authStatus.hasUsers &&
            !authStatus.hasAuthUsers && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  User profiles exist but authentication accounts are missing.
                  Please run the SQL script below in your Supabase SQL Editor.
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>

      {authStatus.configured &&
        authStatus.hasUsers &&
        !authStatus.hasAuthUsers && (
          <Card>
            <CardHeader>
              <CardTitle>Setup Authentication Accounts</CardTitle>
              <CardDescription>
                Run this SQL script in your Supabase Dashboard → SQL Editor to
                create authentication accounts for demo users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto max-h-96">
                  {sqlScript}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(sqlScript)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Go to your Supabase Dashboard</li>
                  <li>Navigate to SQL Editor</li>
                  <li>Copy and paste the SQL script above</li>
                  <li>Run the script</li>
                  <li>Refresh this page to verify setup</li>
                </ol>
              </div>
              <Button onClick={checkAuthSetup} variant="outline">
                Check Setup Again
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
