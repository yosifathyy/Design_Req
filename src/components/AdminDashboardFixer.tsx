import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  FolderOpen,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface AdminData {
  users: any[];
  projects: any[];
  chats: any[];
  messages: any[];
  invoices: any[];
}

export const AdminDashboardFixer: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAdminData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Loading admin data for:", user.email);

      // Parallel fetch all admin data
      const [usersRes, projectsRes, chatsRes, messagesRes, invoicesRes] =
        await Promise.allSettled([
          supabase
            .from("users")
            .select("id, email, name, role, status, created_at")
            .order("created_at", { ascending: false }),

          supabase
            .from("design_requests")
            .select(
              `
              id, title, status, budget, user_id, designer_id, created_at,
              user:users!user_id(name, email),
              designer:users!designer_id(name, email)
            `,
            )
            .order("created_at", { ascending: false }),

          supabase
            .from("chats")
            .select(
              `
              id, request_id, created_at,
              request:design_requests!request_id(title)
            `,
            )
            .order("created_at", { ascending: false }),

          supabase
            .from("messages")
            .select(
              `
              id, chat_id, sender_id, text, created_at,
              sender:users!sender_id(name, email)
            `,
            )
            .order("created_at", { ascending: false })
            .limit(50),

          supabase
            .from("invoices")
            .select("id, amount, status, user_id, created_at")
            .order("created_at", { ascending: false }),
        ]);

      const adminData: AdminData = {
        users: usersRes.status === "fulfilled" ? usersRes.value.data || [] : [],
        projects:
          projectsRes.status === "fulfilled"
            ? projectsRes.value.data || []
            : [],
        chats: chatsRes.status === "fulfilled" ? chatsRes.value.data || [] : [],
        messages:
          messagesRes.status === "fulfilled"
            ? messagesRes.value.data || []
            : [],
        invoices:
          invoicesRes.status === "fulfilled"
            ? invoicesRes.value.data || []
            : [],
      };

      setData(adminData);

      console.log("✅ Admin data loaded:");
      console.log("📊 Users:", adminData.users.length);
      console.log("📊 Projects:", adminData.projects.length);
      console.log("📊 Chats:", adminData.chats.length);
      console.log("📊 Messages:", adminData.messages.length);
      console.log("📊 Invoices:", adminData.invoices.length);
    } catch (err: any) {
      console.error("❌ Failed to load admin data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const getStatusBadge = (count: number) => {
    if (count > 0) {
      return <Badge className="bg-green-500 text-white">{count}</Badge>;
    }
    return <Badge className="bg-gray-500 text-white">0</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="border-4 border-blue-500 bg-blue-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-800">
            🛠️ Admin Data Overview
          </h2>
          <Button
            onClick={loadAdminData}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 p-3 rounded mb-4">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium text-blue-800">Users</div>
              {getStatusBadge(data.users.length)}
            </div>

            <div className="text-center">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium text-green-800">Projects</div>
              {getStatusBadge(data.projects.length)}
            </div>

            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-purple-800">Chats</div>
              {getStatusBadge(data.chats.length)}
            </div>

            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-orange-800">
                Messages
              </div>
              {getStatusBadge(data.messages.length)}
            </div>

            <div className="text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-sm font-medium text-red-800">Invoices</div>
              {getStatusBadge(data.invoices.length)}
            </div>
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-4">
            {/* Recent Users */}
            {data.users.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  Recent Users ({data.users.length})
                </h4>
                <div className="space-y-1 text-sm">
                  {data.users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex justify-between">
                      <span>{user.email}</span>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Projects */}
            {data.projects.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-800 mb-2">
                  Recent Projects ({data.projects.length})
                </h4>
                <div className="space-y-1 text-sm">
                  {data.projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex justify-between">
                      <span>{project.title}</span>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Messages */}
            {data.messages.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">
                  Recent Messages ({data.messages.length})
                </h4>
                <div className="space-y-1 text-sm">
                  {data.messages.slice(0, 3).map((msg) => (
                    <div key={msg.id}>
                      <span className="font-medium">{msg.sender?.name}:</span>{" "}
                      {msg.text?.substring(0, 50)}...
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading &&
          data &&
          Object.values(data).every((arr) => arr.length === 0) && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <p className="text-lg font-medium text-yellow-800">
                No data found in database
              </p>
              <p className="text-sm text-yellow-700">
                This could mean the database is empty or there are permission
                issues
              </p>
            </div>
          )}
      </Card>
    </div>
  );
};

export default AdminDashboardFixer;
