import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  MessageSquare,
  User,
  RefreshCw,
} from "lucide-react";

interface ChatDebuggerProps {
  projectId?: string;
  error?: string;
}

export const ChatErrorDebugger: React.FC<ChatDebuggerProps> = ({
  projectId,
  error,
}) => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>({});

  const runChatTests = async () => {
    setTesting(true);
    const testResults: any = {};

    try {
      console.log("🔍 Running chat diagnostic tests...");

      // Test 1: Basic auth check
      testResults.auth = {
        user: !!user,
        userId: user?.id,
        userEmail: user?.email,
      };

      // Test 2: Check if tables exist and are accessible
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("count")
          .limit(1);
        testResults.messagesTable = {
          exists: !error,
          error: error?.message,
          accessible: !!data,
        };
      } catch (err: any) {
        testResults.messagesTable = {
          exists: false,
          error: err.message,
          accessible: false,
        };
      }

      try {
        const { data, error } = await supabase
          .from("chats")
          .select("count")
          .limit(1);
        testResults.chatsTable = {
          exists: !error,
          error: error?.message,
          accessible: !!data,
        };
      } catch (err: any) {
        testResults.chatsTable = {
          exists: false,
          error: err.message,
          accessible: false,
        };
      }

      // Test 3: Check if project exists
      if (projectId) {
        try {
          const { data, error } = await supabase
            .from("design_requests")
            .select("id, title")
            .eq("id", projectId)
            .single();
          testResults.project = {
            exists: !!data && !error,
            error: error?.message,
            data: data,
          };
        } catch (err: any) {
          testResults.project = {
            exists: false,
            error: err.message,
          };
        }

        // Test 4: Check if chat exists for project
        try {
          const { data, error } = await supabase
            .from("chats")
            .select("id")
            .eq("request_id", projectId);
          testResults.projectChat = {
            exists: !!data && data.length > 0 && !error,
            count: data?.length || 0,
            error: error?.message,
          };
        } catch (err: any) {
          testResults.projectChat = {
            exists: false,
            error: err.message,
          };
        }
      }

      // Test 5: Try to create a test message
      if (user && projectId) {
        try {
          // First, ensure chat exists
          let { data: chatsData, error: chatsError } = await supabase
            .from("chats")
            .select("id")
            .eq("request_id", projectId)
            .limit(1);

          let chatId;
          if (!chatsData || chatsData.length === 0) {
            // Try to create a chat
            const { data: newChatData, error: createChatError } = await supabase
              .from("chats")
              .insert([
                {
                  request_id: projectId,
                  created_at: new Date().toISOString(),
                },
              ])
              .select()
              .single();

            if (createChatError) {
              throw createChatError;
            }
            chatId = newChatData.id;
          } else {
            chatId = chatsData[0].id;
          }

          // Try to insert a test message (but don't actually save it)
          const testMessageData = {
            chat_id: chatId,
            sender_id: user.id,
            text: "TEST MESSAGE - DO NOT SAVE",
          };

          // Don't actually insert, just validate the structure
          testResults.messageTest = {
            canCreateMessage: true,
            chatId: chatId,
            messageData: testMessageData,
          };
        } catch (err: any) {
          testResults.messageTest = {
            canCreateMessage: false,
            error:
              err.message || err.details || err.hint || JSON.stringify(err),
            errorCode: err.code,
          };
        }
      }

      setResults(testResults);
      console.log("✅ Chat diagnostic complete:", testResults);
    } catch (err: any) {
      console.error("❌ Chat diagnostic failed:", err);
      setResults({ error: err.message });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (user) {
      runChatTests();
    }
  }, [user, projectId]);

  const TestResult = ({ label, result }: { label: string; result: any }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded border-2 border-gray-200">
      <span className="font-medium text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {result?.exists || result?.accessible || result?.canCreateMessage ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        {result?.count !== undefined && (
          <Badge variant="outline" className="text-xs">
            {result.count}
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <Card className="border-4 border-orange-500 bg-orange-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-orange-800">
          🐛 Chat Error Debugger
        </h3>
        <Button
          onClick={runChatTests}
          disabled={testing}
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-1" />
          )}
          {testing ? "Testing..." : "Retest"}
        </Button>
      </div>

      {/* Current Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
          <h4 className="font-semibold text-red-800 mb-1">Current Error:</h4>
          <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}

      {/* Test Results */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-orange-800 mb-2">
            Diagnostic Results:
          </h4>

          {results.auth && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-orange-800">
                Authentication:
              </div>
              <div className="text-xs text-orange-700 ml-2">
                User: {results.auth.userEmail || "Not logged in"}
                <br />
                ID: {results.auth.userId || "N/A"}
              </div>
            </div>
          )}

          {results.messagesTable && (
            <TestResult label="Messages Table" result={results.messagesTable} />
          )}

          {results.chatsTable && (
            <TestResult label="Chats Table" result={results.chatsTable} />
          )}

          {results.project && (
            <TestResult label="Project Exists" result={results.project} />
          )}

          {results.projectChat && (
            <TestResult label="Project Chat" result={results.projectChat} />
          )}

          {results.messageTest && (
            <TestResult
              label="Can Send Messages"
              result={results.messageTest}
            />
          )}

          {/* Detailed Errors */}
          <div className="mt-4 space-y-2">
            {Object.entries(results).map(([key, result]: [string, any]) =>
              result?.error ? (
                <div
                  key={key}
                  className="p-2 bg-red-50 border border-red-200 rounded text-xs"
                >
                  <div className="font-medium text-red-800">{key} Error:</div>
                  <div className="text-red-600">{result.error}</div>
                  {result.errorCode && (
                    <div className="text-red-500">Code: {result.errorCode}</div>
                  )}
                </div>
              ) : null,
            )}
          </div>

          {/* Raw Data for Advanced Debugging */}
          <details className="mt-4">
            <summary className="text-sm font-medium text-orange-800 cursor-pointer">
              Raw Diagnostic Data
            </summary>
            <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-auto max-h-40">
              {JSON.stringify(results, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Quick Fixes */}
      <div className="mt-4 pt-3 border-t border-orange-300">
        <h4 className="font-semibold text-orange-800 mb-2 text-sm">
          Quick Actions:
        </h4>
        <div className="space-y-2">
          <Button
            onClick={() => window.open("/admin-setup", "_blank")}
            size="sm"
            variant="outline"
            className="w-full text-xs border-orange-300"
          >
            Setup Database Tables
          </Button>
          <Button
            onClick={() => window.open("/admin-debug", "_blank")}
            size="sm"
            variant="outline"
            className="w-full text-xs border-orange-300"
          >
            Full Admin Debug
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatErrorDebugger;
