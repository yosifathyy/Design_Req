import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  User,
  Database,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export const AdminPermissionTest: React.FC = () => {
  const { user, profile } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runPermissionTest = async () => {
    setTesting(true);
    setResults([]);

    const newResults: string[] = [];

    try {
      // Test 1: Check user authentication
      if (!user) {
        newResults.push("❌ No user authenticated");
        setResults([...newResults]);
        setTesting(false);
        return;
      }

      newResults.push(`✅ User authenticated: ${user.email}`);

      // Test 2: Check user profile
      if (!profile) {
        newResults.push("❌ No user profile found");
      } else {
        newResults.push(`✅ Profile loaded: Role = ${profile.role}`);
      }

      // Test 3: Check admin status
      const isAdmin =
        user.role === "admin" ||
        user.role === "super-admin" ||
        profile?.role === "admin" ||
        profile?.role === "super-admin" ||
        user.email === "admin@demo.com";

      if (isAdmin) {
        newResults.push("✅ User has admin privileges");
      } else {
        newResults.push("❌ User does not have admin privileges");
      }

      setResults([...newResults]);

      // Test 4: Check database access
      newResults.push("🔄 Testing database access...");
      setResults([...newResults]);

      // Test projects access
      const { data: projects, error: projectsError } = await supabase
        .from("design_requests")
        .select("id, title, user_id")
        .limit(5);

      if (projectsError) {
        newResults.push(`❌ Projects access failed: ${projectsError.message}`);
      } else {
        newResults.push(
          `✅ Projects accessible: Found ${projects?.length || 0} projects`,
        );
      }

      // Test chats access
      const { data: chats, error: chatsError } = await supabase
        .from("chats")
        .select("id, request_id")
        .limit(5);

      if (chatsError) {
        newResults.push(`❌ Chats access failed: ${chatsError.message}`);
      } else {
        newResults.push(
          `✅ Chats accessible: Found ${chats?.length || 0} chats`,
        );
      }

      // Test messages access
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("id, chat_id, sender_id, text")
        .limit(5);

      if (messagesError) {
        newResults.push(`❌ Messages access failed: ${messagesError.message}`);
      } else {
        newResults.push(
          `✅ Messages accessible: Found ${messages?.length || 0} messages`,
        );
      }

      // Test users access (admin only)
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, role")
        .limit(5);

      if (usersError) {
        newResults.push(`❌ Users access failed: ${usersError.message}`);
      } else {
        newResults.push(
          `✅ Users accessible: Found ${users?.length || 0} users`,
        );
      }

      setResults([...newResults]);
    } catch (error: any) {
      newResults.push(`❌ Test failed: ${error.message}`);
      setResults([...newResults]);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-4 border-blue-500 bg-blue-50 p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-bold text-blue-800">
              Admin Permission Test
            </h3>
          </div>
          <Button
            onClick={runPermissionTest}
            disabled={testing}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Permissions"
            )}
          </Button>
        </div>

        {/* Current user info */}
        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Current User Info
          </h4>
          <div className="space-y-1 text-sm">
            <div>
              Email: <Badge>{user?.email || "Not logged in"}</Badge>
            </div>
            <div>
              Auth Role: <Badge>{user?.role || "None"}</Badge>
            </div>
            <div>
              Profile Role: <Badge>{profile?.role || "None"}</Badge>
            </div>
          </div>
        </div>

        {/* Test results */}
        {results.length > 0 && (
          <div className="bg-gray-100 p-4 rounded border font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="leading-relaxed">
                {result}
              </div>
            ))}
          </div>
        )}

        {!testing && results.length === 0 && (
          <div className="text-sm text-blue-700">
            Click "Test Permissions" to check if the admin user has proper
            access to view all projects and messages.
          </div>
        )}
      </div>
    </Card>
  );
};

export default AdminPermissionTest;
