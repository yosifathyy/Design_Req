import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { CheckCircle, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

export default function AuthStatus() {
  const [status, setStatus] = useState<{
    configured: boolean;
    connected: boolean;
    hasUsers: boolean;
    canAuth: boolean;
    errors: string[];
    details: string[];
  }>({
    configured: false,
    connected: false,
    hasUsers: false,
    canAuth: false,
    errors: [],
    details: [],
  });

  const [checking, setChecking] = useState(true);

  const runDiagnostics = async () => {
    setChecking(true);
    const newStatus = {
      configured: false,
      connected: false,
      hasUsers: false,
      canAuth: false,
      errors: [] as string[],
      details: [] as string[],
    };

    try {
      // Test 1: Configuration
      newStatus.configured = isSupabaseConfigured;
      if (!isSupabaseConfigured) {
        newStatus.errors.push("Supabase not configured properly");
        newStatus.details.push(
          "Check environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
        );
        setStatus(newStatus);
        setChecking(false);
        return;
      }
      newStatus.details.push("✅ Supabase configuration found");

      // Test 2: Connection
      try {
        const { data, error } = await supabase.from("users").select("count");
        newStatus.connected = !error;
        if (!error) {
          newStatus.details.push("✅ Database connection successful");
        } else {
          newStatus.errors.push(`Connection error: ${error.message}`);
        }
      } catch (error: any) {
        newStatus.errors.push(`Network error: ${error.message}`);
        newStatus.connected = false;
      }

      // Test 3: Users table
      if (newStatus.connected) {
        try {
          const { data: users, error: usersError } = await supabase
            .from("users")
            .select("email, role")
            .limit(5);

          if (!usersError && users && users.length > 0) {
            newStatus.hasUsers = true;
            newStatus.details.push(
              `✅ Found ${users.length} users in database`,
            );
            users.forEach((user) => {
              newStatus.details.push(`  - ${user.email} (${user.role})`);
            });
          } else if (usersError) {
            newStatus.errors.push(`Users table error: ${usersError.message}`);
          } else {
            newStatus.details.push("⚠️ No users found in database");
          }
        } catch (error: any) {
          newStatus.errors.push(`Users check failed: ${error.message}`);
        }
      }

      // Test 4: Authentication
      if (newStatus.connected && newStatus.hasUsers) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: "admin@demo.com",
            password: "demo123",
          });

          if (data?.session) {
            newStatus.canAuth = true;
            newStatus.details.push("✅ Authentication working (demo user)");
            // Sign out immediately to not affect current session
            await supabase.auth.signOut();
          } else if (error) {
            newStatus.errors.push(`Authentication error: ${error.message}`);
            if (error.message.includes("Invalid login credentials")) {
              newStatus.details.push(
                "⚠️ Demo users exist in database but authentication accounts are missing",
              );
            }
          }
        } catch (error: any) {
          newStatus.errors.push(`Auth test failed: ${error.message}`);
        }
      }
    } catch (error: any) {
      newStatus.errors.push(`Diagnostic failed: ${error.message}`);
    }

    setStatus(newStatus);
    setChecking(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusColor = () => {
    if (
      status.configured &&
      status.connected &&
      status.hasUsers &&
      status.canAuth
    ) {
      return "text-green-600 border-green-200 bg-green-50";
    }
    if (status.configured && status.connected && status.hasUsers) {
      return "text-yellow-600 border-yellow-200 bg-yellow-50";
    }
    return "text-red-600 border-red-200 bg-red-50";
  };

  const getOverallStatus = () => {
    if (
      status.configured &&
      status.connected &&
      status.hasUsers &&
      status.canAuth
    ) {
      return "✅ Everything Working";
    }
    if (status.configured && status.connected && status.hasUsers) {
      return "⚠️ Authentication Setup Needed";
    }
    if (status.configured && status.connected) {
      return "⚠️ Database Setup Needed";
    }
    if (status.configured) {
      return "❌ Connection Issues";
    }
    return "❌ Configuration Issues";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-festival-cream to-festival-beige p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            Authentication Status
          </h1>
          <p className="text-xl text-gray-600">
            Diagnostic information for your Supabase setup
          </p>
        </div>

        <Card className={`mb-6 ${getStatusColor()}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getOverallStatus()}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={runDiagnostics}
                disabled={checking}
              >
                {checking ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {checking ? "Checking..." : "Refresh"}
              </Button>
            </CardTitle>
            <CardDescription>
              Current status of your authentication system
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.configured ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {status.configured
                  ? "Supabase credentials are properly configured"
                  : "Supabase credentials are missing or invalid"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {status.connected
                  ? "Successfully connected to Supabase database"
                  : "Unable to connect to Supabase database"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.hasUsers ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                User Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {status.hasUsers
                  ? "User profiles found in database"
                  : "No user profiles found in database"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.canAuth ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {status.canAuth
                  ? "Authentication accounts are working"
                  : "Authentication accounts need setup"}
              </p>
            </CardContent>
          </Card>
        </div>

        {status.errors.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-red-600">Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {status.errors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    {error}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {status.details.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Diagnostic Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm font-mono">
                {status.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status.configured &&
              status.connected &&
              status.hasUsers &&
              !status.canAuth && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your database has user profiles but authentication accounts
                    are missing. Set up authentication accounts to enable login.
                  </AlertDescription>
                </Alert>
              )}

            <div className="flex gap-4">
              {status.configured &&
                status.connected &&
                status.hasUsers &&
                !status.canAuth && (
                  <Button asChild>
                    <Link to="/auth-setup">
                      Setup Authentication
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}

              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>

              <Button variant="outline" asChild>
                <Link to="/login">Try Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
