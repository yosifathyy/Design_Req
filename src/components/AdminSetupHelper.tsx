import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
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

  const createSampleData = async () => {
    if (!user) {
      setStatus("❌ Please login first");
      return;
    }

    setLoading(true);
    setStatus("Creating sample data...");

    try {
      // Create sample client user
      const { data: clientData, error: clientError } = await supabase
        .from("users")
        .upsert(
          [
            {
              id: "demo-client-user-id",
              email: "client@demo.com",
              name: "Demo Client",
              role: "user",
              status: "active",
              xp: 50,
              level: 2,
              bio: "Demo client user for testing",
              avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=client",
              created_at: new Date().toISOString(),
            },
          ],
          {
            onConflict: "email",
          },
        );

      // Create sample designer user
      const { data: designerData, error: designerError } = await supabase
        .from("users")
        .upsert(
          [
            {
              id: "demo-designer-user-id",
              email: "designer@demo.com",
              name: "Demo Designer",
              role: "designer",
              status: "active",
              xp: 200,
              level: 8,
              bio: "Demo designer user for testing",
              skills: ["UI Design", "Branding", "Logo Design"],
              hourly_rate: 75,
              avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=designer",
              created_at: new Date().toISOString(),
            },
          ],
          {
            onConflict: "email",
          },
        );

      // Create sample design request
      const { data: requestData, error: requestError } = await supabase
        .from("design_requests")
        .upsert(
          [
            {
              id: "demo-request-1",
              title: "Logo Design for Startup",
              description:
                "We need a modern logo for our tech startup. Looking for something clean and professional.",
              budget: 500,
              deadline: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              status: "in_progress",
              user_id: "demo-client-user-id",
              designer_id: "demo-designer-user-id",
              created_at: new Date().toISOString(),
            },
          ],
          {
            onConflict: "id",
          },
        );

      // Create sample chat
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .upsert(
          [
            {
              id: "demo-chat-1",
              request_id: "demo-request-1",
              created_at: new Date().toISOString(),
            },
          ],
          {
            onConflict: "id",
          },
        );

      // Create sample messages
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .upsert(
          [
            {
              id: "demo-message-1",
              chat_id: "demo-chat-1",
              sender_id: "demo-client-user-id",
              text: "Hi! I'm excited to work on this logo project. When can we start?",
              created_at: new Date(
                Date.now() - 2 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              id: "demo-message-2",
              chat_id: "demo-chat-1",
              sender_id: "demo-designer-user-id",
              text: "Hello! I'd love to help you with your logo. I have some initial ideas already. Let's schedule a call to discuss your vision.",
              created_at: new Date(
                Date.now() - 1 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              id: "demo-message-3",
              chat_id: "demo-chat-1",
              sender_id: "demo-client-user-id",
              text: "That sounds great! I'm available tomorrow afternoon. What time works for you?",
              created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            },
          ],
          {
            onConflict: "id",
          },
        );

      // Create sample invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .upsert(
          [
            {
              id: "demo-invoice-1",
              user_id: "demo-client-user-id",
              designer_id: "demo-designer-user-id",
              request_id: "demo-request-1",
              amount: 500,
              status: "pending",
              due_date: new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              created_at: new Date().toISOString(),
            },
          ],
          {
            onConflict: "id",
          },
        );

      setStatus(
        "✅ Sample data created successfully! You can now explore the admin dashboard with real data.",
      );
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
