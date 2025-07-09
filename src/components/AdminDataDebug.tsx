import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  Database,
  Users,
  FolderOpen,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export const AdminDataDebug: React.FC = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const testAdminDataAccess = async () => {
    setTesting(true);
    setResults([]);

    const newResults: string[] = [];

    try {
      newResults.push(`🔍 Testing admin data access for: ${user?.email}`);
      newResults.push(`👤 User role: ${user?.role || "undefined"}`);

      // Test 1: Users table
      newResults.push("🔄 Testing users table...");
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, name, role, status")
        .order("created_at", { ascending: false });

      if (usersError) {
        newResults.push(`❌ Users: ${usersError.message}`);
      } else {
        newResults.push(`✅ Users: Found ${users?.length || 0} users`);
        users?.slice(0, 3).forEach((user) => {
          newResults.push(`   - ${user.email} (${user.role})`);
        });
      }

      // Test 2: Design requests (projects)
      newResults.push("🔄 Testing design_requests table...");
      const { data: projects, error: projectsError } = await supabase
        .from("design_requests")
        .select(
          `
          id, title, status, user_id,
          user:users!user_id(name, email),
          designer:users!designer_id(name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (projectsError) {
        newResults.push(`❌ Projects: ${projectsError.message}`);
      } else {
        newResults.push(`✅ Projects: Found ${projects?.length || 0} projects`);
        projects?.slice(0, 3).forEach((project: any) => {
          newResults.push(`   - ${project.title} by ${project.user?.email}`);
        });
      }

      // Test 3: Chats table
      newResults.push("🔄 Testing chats table...");
      const { data: chats, error: chatsError } = await supabase
        .from("chats")
        .select(
          `
          id, request_id, created_at,
          request:design_requests!request_id(title)
        `,
        )
        .order("created_at", { ascending: false });

      if (chatsError) {
        newResults.push(`❌ Chats: ${chatsError.message}`);
      } else {
        newResults.push(`✅ Chats: Found ${chats?.length || 0} chats`);
        chats?.slice(0, 3).forEach((chat: any) => {
          newResults.push(`   - Chat for: ${chat.request?.title}`);
        });
      }

      // Test 4: Messages table
      newResults.push("🔄 Testing messages table...");
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select(
          `
          id, text, sender_id, chat_id, created_at,
          sender:users!sender_id(name, email)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(20);

      if (messagesError) {
        newResults.push(`❌ Messages: ${messagesError.message}`);
      } else {
        newResults.push(`✅ Messages: Found ${messages?.length || 0} messages`);
        messages?.slice(0, 3).forEach((msg: any) => {
          newResults.push(
            `   - "${msg.text?.substring(0, 50)}..." by ${msg.sender?.email}`,
          );
        });
      }

      // Test 5: Invoices table
      newResults.push("🔄 Testing invoices table...");
      const { data: invoices, error: invoicesError } = await supabase
        .from("invoices")
        .select("id, amount, status, user_id, created_at")
        .order("created_at", { ascending: false });

      if (invoicesError) {
        newResults.push(`❌ Invoices: ${invoicesError.message}`);
      } else {
        newResults.push(`✅ Invoices: Found ${invoices?.length || 0} invoices`);
      }

      newResults.push("✅ Admin data access test completed!");
    } catch (error: any) {
      newResults.push(`❌ Test failed: ${error.message}`);
    } finally {
      setResults(newResults);
      setTesting(false);
    }
  };

  return (
    <Card className="border-4 border-purple-500 bg-purple-50 p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-bold text-purple-800">
              Admin Data Access Test
            </h3>
          </div>
          <Button
            onClick={testAdminDataAccess}
            disabled={testing}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test All Data Access"
            )}
          </Button>
        </div>

        {/* Current user info */}
        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Current Admin User
          </h4>
          <div className="space-y-1 text-sm">
            <div>
              Email:{" "}
              <Badge variant="outline">{user?.email || "Not logged in"}</Badge>
            </div>
            <div>
              Role: <Badge variant="outline">{user?.role || "None"}</Badge>
            </div>
            <div>
              ID: <Badge variant="outline">{user?.id || "None"}</Badge>
            </div>
          </div>
        </div>

        {/* Test results */}
        {results.length > 0 && (
          <div className="bg-gray-100 p-4 rounded border font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="leading-relaxed">
                {result}
              </div>
            ))}
          </div>
        )}

        {!testing && results.length === 0 && (
          <div className="text-sm text-purple-700">
            <p className="mb-2">
              This test will check if the admin user can access ALL user data
              including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All user accounts</li>
              <li>All projects from all users</li>
              <li>All chat conversations</li>
              <li>All messages between users</li>
              <li>All invoices and payments</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AdminDataDebug;
