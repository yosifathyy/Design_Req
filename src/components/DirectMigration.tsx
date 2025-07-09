import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Database, CheckCircle, XCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const DirectMigration: React.FC = () => {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const applyMigration = async () => {
    if (!isSupabaseConfigured) {
      setResult("❌ Supabase not configured");
      return;
    }

    setMigrating(true);
    setResult(null);

    try {
      // Step 1: Check if migration is already applied
      const { data: checkData, error: checkError } = await supabase
        .from("messages")
        .select("id, project_id")
        .limit(1);

      if (!checkError) {
        setResult(
          "✅ Migration already applied! Messages table has project_id column.",
        );
        setSuccess(true);
        setMigrating(false);
        return;
      }

      // Step 2: Try simple table creation approach
      setResult("🔄 Attempting to create messages table...");

      // First, let's check what we have
      const { data: usersCheck } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      const { data: projectsCheck } = await supabase
        .from("design_requests")
        .select("id")
        .limit(1);

      if (!usersCheck || !projectsCheck) {
        setResult("❌ Required tables (users, design_requests) not found");
        setMigrating(false);
        return;
      }

      // Try to execute the migration through manual SQL
      const migrationSQL = `
-- Create simplified messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.design_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Add last_seen to users if not exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();
`;

      // Since we can't execute DDL directly through the client, provide manual approach
      setResult(`
⚠️ Automated migration requires manual SQL execution.

Please copy and run this SQL in your Supabase Dashboard → SQL Editor:

${migrationSQL}

Then click "Verify Migration" below.
      `);
    } catch (error: any) {
      setResult(`❌ Migration failed: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  const verifyMigration = async () => {
    setMigrating(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, project_id, sender_id, message")
        .limit(1);

      if (!error) {
        setResult(
          "✅ Migration verified! Messages table now has correct structure.",
        );
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult(`❌ Verification failed: ${error.message}`);
      }
    } catch (error: any) {
      setResult(`❌ Verification error: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  const openSupabaseDashboard = () => {
    window.open("https://supabase.com/dashboard", "_blank");
  };

  return (
    <Card className="border-4 border-red-500 bg-red-50 p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-bold text-red-800">
            Database Migration Required
          </h3>
        </div>

        <div className="text-sm text-red-700">
          <p className="mb-2">
            The chat system needs a database update to work properly.
          </p>
          <p className="mb-4">
            The messages table is missing the 'project_id' column required for
            the simplified chat system.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={applyMigration}
            disabled={migrating}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {migrating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Start Migration
              </>
            )}
          </Button>

          <Button
            onClick={verifyMigration}
            disabled={migrating}
            variant="outline"
            className="border-2 border-green-500 text-green-700 hover:bg-green-50"
          >
            {migrating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Migration
              </>
            )}
          </Button>

          <Button
            onClick={openSupabaseDashboard}
            variant="outline"
            className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50"
          >
            Open Supabase Dashboard
          </Button>
        </div>

        {result && (
          <div
            className={`p-4 rounded border-2 ${success ? "bg-green-50 border-green-300" : "bg-yellow-50 border-yellow-300"}`}
          >
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}

        {!success && (
          <div className="text-xs text-red-600 bg-red-100 p-3 rounded border">
            <strong>Quick Fix Steps:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Click "Start Migration" above</li>
              <li>Copy the provided SQL code</li>
              <li>Open Supabase Dashboard</li>
              <li>Go to SQL Editor</li>
              <li>Paste and run the SQL</li>
              <li>Return here and click "Verify Migration"</li>
            </ol>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DirectMigration;
