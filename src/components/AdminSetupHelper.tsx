import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  checkAndCreateTables,
  createMissingTables,
  createSampleData,
} from "@/utils/setupDatabase";
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Database,
  UserPlus,
  FolderPlus,
  MessageSquare,
} from "lucide-react";

export const AdminSetupHelper: React.FC = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const createDemoUser = async () => {
    setLoading(true);
    setStatus("Creating demo admin user...");

    try {
      // Try to create admin user in auth
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: "admin@demo.com",
          password: "demo123",
          email_confirm: true,
        });

      if (authError && !authError.message.includes("already registered")) {
        throw authError;
      }

      const userId = authData?.user?.id || "demo-admin-user-id";

      // Create or update user in users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", "admin@demo.com")
        .single();

      if (!existingUser) {
        const { error: userError } = await supabase.from("users").insert([
          {
            id: userId,
            email: "admin@demo.com",
            name: "Demo Admin",
            role: "admin",
            status: "active",
            xp: 100,
            level: 5,
            bio: "Demo admin user for testing",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
            created_at: new Date().toISOString(),
          },
        ]);

        if (userError) {
          console.error("Error creating user profile:", userError);
          setStatus(`Error creating user profile: ${userError.message}`);
          setLoading(false);
          return;
        }
      }

      setStatus("✅ Demo admin user created successfully!");

      // Auto-login as admin
      setTimeout(async () => {
        const { error } = await signIn("admin@demo.com", "demo123");
        if (!error) {
          setStatus("✅ Logged in as admin! Redirecting...");
          setTimeout(() => navigate("/admin"), 1000);
        } else {
          setStatus(`Login error: ${error.message}`);
        }
      }, 1000);
    } catch (error: any) {
      console.error("Error creating demo user:", error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkDatabase = async () => {
    setLoading(true);
    setStatus("Checking database tables...");

    try {
      const results = await checkAndCreateTables();
      const missingTables = Object.entries(results).filter(
        ([, result]: [string, any]) => !result.exists,
      );

      if (missingTables.length > 0) {
        setStatus(
          `❌ Missing tables: ${missingTables.map(([name]) => name).join(", ")}. Click "Setup Database" to get SQL commands.`,
        );
      } else {
        setStatus("✅ All database tables exist!");
      }
    } catch (error: any) {
      setStatus(`❌ Database check failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setupDatabase = async () => {
    setLoading(true);
    setStatus("Generating database setup SQL...");

    try {
      const result = await createMissingTables();

      // Copy SQL to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(result.sqlStatements);
        setStatus(
          "✅ Database setup SQL copied to clipboard! Paste it in your Supabase SQL Editor and run it.",
        );
      } else {
        setStatus(
          "⚠️ Please copy the SQL from the console and run it in your Supabase SQL Editor.",
        );
        console.log("=== COPY THIS SQL TO SUPABASE SQL EDITOR ===");
        console.log(result.sqlStatements);
        console.log("=== END SQL ===");
      }
    } catch (error: any) {
      setStatus(`❌ Database setup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createSampleDataUtil = async () => {
    if (!user) {
      setStatus("❌ Please login first");
      return;
    }

    setLoading(true);
    setStatus("Creating sample data...");

    try {
      const results = await createSampleData(user.id);
      const failed = Object.entries(results).filter(
        ([, result]: [string, any]) => !result.success,
      );

      if (failed.length > 0) {
        setStatus(
          `⚠️ Some data creation failed: ${failed.map(([name, result]: [string, any]) => `${name}: ${result.error}`).join(", ")}`,
        );
      } else {
        setStatus(
          "✅ Sample data created successfully! You can now explore the admin dashboard with real data.",
        );
      }
    } catch (error: any) {
      console.error("Error creating sample data:", error);
      setStatus(`❌ Error creating sample data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    setLoading(true);
    setStatus("Logging in as admin...");

    try {
      const { error } = await signIn("admin@demo.com", "demo123");
      if (error) {
        setStatus(`❌ Login failed: ${error.message}`);
      } else {
        setStatus("✅ Successfully logged in as admin! Redirecting...");
        setTimeout(() => navigate("/admin"), 1000);
      }
    } catch (error: any) {
      setStatus(`❌ Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-4 border-orange-500 bg-orange-50 p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-800 mb-2">
            🚀 Admin Setup Helper
          </h1>
          <p className="text-orange-700">
            Set up your admin user and demo data to get started!
          </p>
        </div>

        <div className="space-y-4">
          {/* Current Status */}
          {user && (
            <div className="p-4 bg-white rounded border-2 border-orange-200">
              <h3 className="font-semibold mb-2">Current User</h3>
              <div className="text-sm space-y-1">
                <div>Email: {user.email}</div>
                <div>
                  Admin Status:{" "}
                  {user.email === "admin@demo.com" ? (
                    <Badge className="bg-green-500 text-white">Admin</Badge>
                  ) : (
                    <Badge className="bg-gray-500 text-white">
                      Regular User
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status && (
            <div className="p-4 bg-white rounded border-2 border-orange-200">
              <div className="text-sm font-medium">{status}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!user && (
              <>
                <Button
                  onClick={createDemoUser}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  1. Create Demo Admin User
                </Button>

                <Button
                  onClick={loginAsAdmin}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-2 border-orange-300"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <User className="w-4 h-4 mr-2" />
                  )}
                  Login as Admin (admin@demo.com / demo123)
                </Button>
              </>
            )}

            {user && (
              <>
                <Button
                  onClick={createSampleData}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  2. Create Sample Data
                </Button>

                <Button
                  onClick={() => navigate("/admin")}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  3. Go to Admin Dashboard
                </Button>

                <Button
                  onClick={() => navigate("/admin-debug")}
                  variant="outline"
                  className="w-full border-2 border-gray-300"
                >
                  Debug Admin System
                </Button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-white rounded border-2 border-orange-200">
            <h3 className="font-semibold mb-2">Quick Start Guide:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Create the demo admin user (admin@demo.com / demo123)</li>
              <li>Login with the admin credentials</li>
              <li>Create sample data to populate the dashboard</li>
              <li>Explore the admin dashboard with real data</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSetupHelper;
