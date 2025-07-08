import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface DiagnosticResult {
  name: string;
  status: "pass" | "fail" | "checking";
  message: string;
  sqlFix?: string;
}

const DatabaseDiagnostic: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [checking, setChecking] = useState(false);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const { user } = useAuth();

  const comprehensiveFixScript = `-- =====================================================
-- COMPREHENSIVE CHAT SETUP
-- =====================================================

-- Ensure chat tables exist
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES design_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their chats" ON chats;
DROP POLICY IF EXISTS "Users can create chats for their requests" ON chats;
DROP POLICY IF EXISTS "Users can view chat participants" ON chat_participants;
DROP POLICY IF EXISTS "Users can add participants to their chats" ON chat_participants;
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can send messages in their chats" ON messages;

-- Chat policies
CREATE POLICY "Users can view their chats" ON chats FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM design_requests
    WHERE design_requests.id = chats.request_id 
    AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
  )
);

CREATE POLICY "Users can create chats for their requests" ON chats FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM design_requests
    WHERE design_requests.id = request_id 
    AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
  )
);

-- Chat participants policies
CREATE POLICY "Users can view chat participants" ON chat_participants FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM chats
    JOIN design_requests ON design_requests.id = chats.request_id
    WHERE chats.id = chat_participants.chat_id
    AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
  )
);

CREATE POLICY "Users can add participants to their chats" ON chat_participants FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats
    JOIN design_requests ON design_requests.id = chats.request_id
    WHERE chats.id = chat_id
    AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
  )
);

-- Messages policies
CREATE POLICY "Users can view messages in their chats" ON messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = messages.chat_id
    AND chat_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages in their chats" ON messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = messages.chat_id
    AND chat_participants.user_id = auth.uid()
  )
);

-- Verify setup
SELECT 'Chat database setup completed successfully!' as status;`;

  const runDiagnostics = async () => {
    if (!user) return;

    setChecking(true);
    const results: DiagnosticResult[] = [];

    // Check if chat tables exist
    try {
      const { error: chatTableError } = await supabase
        .from("chats")
        .select("id")
        .limit(1);

      results.push({
        name: "Chat Tables",
        status: chatTableError ? "fail" : "pass",
        message: chatTableError
          ? `Chat table missing: ${chatTableError.message}`
          : "Chat tables exist",
      });
    } catch (error) {
      results.push({
        name: "Chat Tables",
        status: "fail",
        message: "Cannot access chat tables",
      });
    }

    // Check RLS policies by trying to create a test chat
    if (user) {
      try {
        // First, check if we have any design requests
        const { data: requests, error: requestError } = await supabase
          .from("design_requests")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (requestError) {
          results.push({
            name: "Design Requests",
            status: "fail",
            message: `Cannot access design requests: ${requestError.message}`,
          });
        } else if (!requests || requests.length === 0) {
          results.push({
            name: "Design Requests",
            status: "fail",
            message:
              "No design requests found. You need at least one request to test chat functionality.",
          });
        } else {
          results.push({
            name: "Design Requests",
            status: "pass",
            message: "Design requests accessible",
          });

          // Test chat creation policy
          try {
            const { error: chatCreateError } = await supabase
              .from("chats")
              .insert([{ request_id: requests[0].id }])
              .select()
              .single();

            if (chatCreateError) {
              results.push({
                name: "Chat Creation Policy",
                status: "fail",
                message: `Chat creation failed: ${chatCreateError.message}`,
                sqlFix: comprehensiveFixScript,
              });
            } else {
              results.push({
                name: "Chat Creation Policy",
                status: "pass",
                message: "Chat creation policy working",
              });
            }
          } catch (error: any) {
            results.push({
              name: "Chat Creation Policy",
              status: "fail",
              message: `Policy test failed: ${error.message}`,
              sqlFix: comprehensiveFixScript,
            });
          }
        }
      } catch (error: any) {
        results.push({
          name: "Database Connection",
          status: "fail",
          message: `Connection error: ${error.message}`,
        });
      }
    }

    setDiagnostics(results);
    setChecking(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedScript("comprehensive");
      setTimeout(() => setCopiedScript(null), 2000);
    } catch (err) {
      alert("Copy failed. Please manually select and copy the SQL script.");
    }
  };

  const hasFailures = diagnostics.some((d) => d.status === "fail");

  return (
    <Card
      className={`border-4 ${hasFailures ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 ${hasFailures ? "bg-red-500" : "bg-green-500"} rounded-full flex items-center justify-center`}
          >
            {checking ? (
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            ) : hasFailures ? (
              <AlertTriangle className="w-6 h-6 text-white" />
            ) : (
              <CheckCircle className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        <div className="flex-1">
          <h3
            className={`text-xl font-bold ${hasFailures ? "text-red-800" : "text-green-800"} mb-4`}
          >
            Database Diagnostic Results
          </h3>

          <div className="space-y-3 mb-4">
            {diagnostics.map((result, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white border-2 border-gray-300 rounded"
              >
                {result.status === "checking" ? (
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                ) : result.status === "pass" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{result.name}</div>
                  <div
                    className={`text-sm ${result.status === "pass" ? "text-green-700" : "text-red-700"}`}
                  >
                    {result.message}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasFailures && (
            <>
              <div className="bg-gray-900 rounded-lg p-4 mb-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono text-sm">
                      comprehensive_chat_setup.sql
                    </span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(comprehensiveFixScript)}
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  >
                    {copiedScript === "comprehensive" ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <pre className="text-green-400 text-xs overflow-x-auto max-h-64">
                  <code>{comprehensiveFixScript}</code>
                </pre>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Button
                  onClick={() =>
                    window.open("https://supabase.com/dashboard", "_blank")
                  }
                  variant="outline"
                  className="border-2 border-red-500 text-red-700 hover:bg-red-100"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase Dashboard
                </Button>

                <Button
                  onClick={runDiagnostics}
                  disabled={checking}
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-700 hover:bg-blue-100"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${checking ? "animate-spin" : ""}`}
                  />
                  Re-run Diagnostics
                </Button>

                {onRetry && (
                  <Button
                    onClick={onRetry}
                    className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-600"
                  >
                    Try Chat Again
                  </Button>
                )}
              </div>
            </>
          )}

          {!hasFailures && (
            <div className="text-sm text-green-700 bg-green-100 border border-green-300 rounded p-3">
              ✅ All diagnostic checks passed! The chat functionality should now
              work properly.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DatabaseDiagnostic;
