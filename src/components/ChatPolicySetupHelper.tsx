import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Copy,
  Check,
  Database,
  Shield,
  FileText,
  ExternalLink,
} from "lucide-react";

interface ChatPolicySetupHelperProps {
  error?: string;
  onRetry?: () => void;
}

const ChatPolicySetupHelper: React.FC<ChatPolicySetupHelperProps> = ({
  error,
  onRetry,
}) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const sqlScript = `-- =====================================================
-- SIMPLE FIX FOR CHAT POLICIES
-- =====================================================
-- Add the missing INSERT policy for chats table

-- Allow users to create chats for requests they own or are assigned to
DROP POLICY IF EXISTS "Users can create chats for their requests" ON chats;
CREATE POLICY "Users can create chats for their requests"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM design_requests
      WHERE design_requests.id = request_id 
      AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
    )
  );

-- Allow users to add participants to chats they can access
DROP POLICY IF EXISTS "Users can add participants to their chats" ON chat_participants;
CREATE POLICY "Users can add participants to their chats"
  ON chat_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      JOIN design_requests ON design_requests.id = chats.request_id
      WHERE chats.id = chat_id
      AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
    )
  );

-- Verify the fix
SELECT 'Chat INSERT policies added successfully!' as status;`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedScript(type);
      setTimeout(() => setCopiedScript(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isPolicyError =
    error?.includes("database policies need to be set up") ||
    error?.includes("row-level security policy") ||
    error?.includes("Permission denied");

  if (!isPolicyError) {
    return null;
  }

  return (
    <Card className="border-4 border-red-500 bg-red-50 p-6 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-800 mb-2">
            Database Setup Required
          </h3>

          <p className="text-red-700 mb-4">
            The chat feature requires Row Level Security (RLS) policies to be
            set up in your Supabase database. This is a one-time setup that
            enables secure chat functionality.
          </p>

          <div className="bg-white border-2 border-red-300 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Quick Fix Steps:
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-red-700 text-sm">
              <li>Open your Supabase dashboard</li>
              <li>Go to the SQL Editor</li>
              <li>Copy and run the SQL script below</li>
              <li>Click "Retry" to test the chat functionality</li>
            </ol>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  fix_chat_policies_simple.sql
                </span>
              </div>
              <Button
                onClick={() => copyToClipboard(sqlScript, "script")}
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                {copiedScript === "script" ? (
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

            <pre className="text-green-400 text-xs overflow-x-auto">
              <code>{sqlScript}</code>
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

            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                Retry Chat Setup
              </Button>
            )}
          </div>

          <div className="text-xs text-red-600 bg-red-100 border border-red-300 rounded p-2">
            <strong>Note:</strong> This setup only needs to be done once. After
            running the SQL script, the chat feature will work for all users in
            your application.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatPolicySetupHelper;
