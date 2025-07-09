import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export const AdminDebugTest: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>({});

  const runAdminTests = async () => {
    setTesting(true);
    const testResults: any = {};

    try {
      // Test 1: Check auth status
      testResults.authStatus = {
        user: !!user,
        userEmail: user?.email,
        profile: !!profile,
        profileRole: profile?.role,
        isAdminEmail: user?.email === "admin@demo.com",
      };

      // Test 2: Test database connection
      try {
        const { data, error } = await supabase
          .from("users")
          .select("count")
          .single();
        testResults.dbConnection = { success: !error, error: error?.message };
      } catch (err: any) {
        testResults.dbConnection = { success: false, error: err.message };
      }

      // Test 3: Test users table access
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .limit(5);
        testResults.usersTable = {
          success: !error,
          count: data?.length || 0,
          error: error?.message,
          data: data?.slice(0, 2), // Sample data
        };
      } catch (err: any) {
        testResults.usersTable = { success: false, error: err.message };
      }

      // Test 4: Test design_requests table
      try {
        const { data, error } = await supabase
          .from("design_requests")
          .select("*")
          .limit(5);
        testResults.projectsTable = {
          success: !error,
          count: data?.length || 0,
          error: error?.message,
        };
      } catch (err: any) {
        testResults.projectsTable = { success: false, error: err.message };
      }

      // Test 5: Test chats table
      try {
        const { data, error } = await supabase
          .from("chats")
          .select("*")
          .limit(5);
        testResults.chatsTable = {
          success: !error,
          count: data?.length || 0,
          error: error?.message,
        };
      } catch (err: any) {
        testResults.chatsTable = { success: false, error: err.message };
      }

      // Test 6: Test messages table
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .limit(5);
        testResults.messagesTable = {
          success: !error,
          count: data?.length || 0,
          error: error?.message,
        };
      } catch (err: any) {
        testResults.messagesTable = { success: false, error: err.message };
      }

      console.log("Admin test results:", testResults);
      setResults(testResults);
    } catch (err: any) {
      console.error("Failed to run admin tests:", err);
      testResults.error = err.message;
      setResults(testResults);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      runAdminTests();
    }
  }, [user, authLoading]);

  const TestResult = ({ label, result }: { label: string; result: any }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {result?.success ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        {result?.count !== undefined && (
          <Badge variant="outline">{result.count} items</Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-4 border-purple-500 bg-purple-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-purple-800">
            🔧 Admin Debug Test Panel
          </h1>
          <Button
            onClick={runAdminTests}
            disabled={testing}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            {testing ? "Testing..." : "Run Tests"}
          </Button>
        </div>

        {/* Auth Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-800">
            Authentication Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded border-2 border-purple-200">
              <h4 className="font-medium mb-2">Current User</h4>
              <div className="space-y-1 text-sm">
                <div>Email: {user?.email || "Not logged in"}</div>
                <div>ID: {user?.id || "N/A"}</div>
                <div>Auth Loading: {authLoading ? "Yes" : "No"}</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded border-2 border-purple-200">
              <h4 className="font-medium mb-2">Profile Data</h4>
              <div className="space-y-1 text-sm">
                <div>Role: {profile?.role || "No profile"}</div>
                <div>Name: {profile?.name || "N/A"}</div>
                <div>
                  Is Admin:{" "}
                  {user?.email === "admin@demo.com" ? "✅ Yes" : "❌ No"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Tests */}
        {Object.keys(results).length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-purple-800">
              Database Connection Tests
            </h3>
            <div className="space-y-2">
              <TestResult
                label="Database Connection"
                result={results.dbConnection}
              />
              <TestResult label="Users Table" result={results.usersTable} />
              <TestResult
                label="Projects Table"
                result={results.projectsTable}
              />
              <TestResult label="Chats Table" result={results.chatsTable} />
              <TestResult
                label="Messages Table"
                result={results.messagesTable}
              />
            </div>

            {/* Sample Data */}
            {results.usersTable?.data && results.usersTable.data.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Sample Users Data:</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  <pre>{JSON.stringify(results.usersTable.data, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Error Details */}
            {Object.values(results).some((r: any) => !r.success && r.error) && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-red-800">Errors Found:</h4>
                <div className="space-y-2">
                  {Object.entries(results).map(
                    ([key, result]: [string, any]) =>
                      !result.success && result.error ? (
                        <div
                          key={key}
                          className="bg-red-50 p-3 rounded border border-red-200"
                        >
                          <div className="font-medium text-red-800">{key}:</div>
                          <div className="text-red-600 text-sm">
                            {result.error}
                          </div>
                        </div>
                      ) : null,
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => navigate("/admin")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Go to Admin Dashboard
          </Button>
          <Button
            onClick={() => navigate("/design-dashboard")}
            variant="outline"
            className="border-2 border-purple-300"
          >
            Go to Design Dashboard
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-2 border-gray-300"
          >
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDebugTest;
