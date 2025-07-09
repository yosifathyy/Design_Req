import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { applySimplifiedChatMigration } from "@/utils/applyMigration";
import {
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Wrench,
} from "lucide-react";

interface DatabaseStatus {
  configured: boolean;
  messagesTableExists: boolean;
  hasProjectIdColumn: boolean;
  hasCorrectStructure: boolean;
  rls_enabled: boolean;
  error?: string;
}

export const ChatDatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string | null>(null);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true);

      if (!isSupabaseConfigured) {
        setStatus({
          configured: false,
          messagesTableExists: false,
          hasProjectIdColumn: false,
          hasCorrectStructure: false,
          rls_enabled: false,
          error: "Supabase not configured",
        });
        return;
      }

      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      if (connectionError) {
        setStatus({
          configured: true,
          messagesTableExists: false,
          hasProjectIdColumn: false,
          hasCorrectStructure: false,
          rls_enabled: false,
          error: `Connection failed: ${connectionError.message}`,
        });
        return;
      }

      // Check if messages table exists with correct structure
      const { data: messagesTest, error: messagesError } = await supabase
        .from("messages")
        .select("id, project_id, sender_id, message, created_at")
        .limit(1);

      const messagesTableExists = !messagesError;
      const hasProjectIdColumn =
        !messagesError || !messagesError.message?.includes("project_id");

      // Check RLS
      const { error: rlsError } = await supabase
        .from("messages")
        .select("id")
        .limit(1);

      setStatus({
        configured: true,
        messagesTableExists,
        hasProjectIdColumn,
        hasCorrectStructure: messagesTableExists && hasProjectIdColumn,
        rls_enabled: !rlsError,
        error: messagesError?.message,
      });
    } catch (error: any) {
      setStatus({
        configured: isSupabaseConfigured,
        messagesTableExists: false,
        hasProjectIdColumn: false,
        hasCorrectStructure: false,
        rls_enabled: false,
        error: error.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMigration = async () => {
    setMigrating(true);
    setMigrationResult(null);

    try {
      const result = await applySimplifiedChatMigration();

      if (result.success) {
        setMigrationResult("✅ Migration applied successfully!");
        // Recheck status after migration
        setTimeout(() => {
          checkDatabaseStatus();
        }, 1000);
      } else {
        setMigrationResult(`❌ Migration failed: ${result.error}`);
      }
    } catch (error: any) {
      setMigrationResult(`❌ Migration error: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-4 border-black bg-white p-6 mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-festival-orange" />
          <span className="font-medium">Checking database status...</span>
        </div>
      </Card>
    );
  }

  if (!status) return null;

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusBadge = (condition: boolean) => {
    return condition ? (
      <Badge className="bg-green-500 text-white">OK</Badge>
    ) : (
      <Badge className="bg-red-500 text-white">FAIL</Badge>
    );
  };

  const allGood = status.hasCorrectStructure && status.rls_enabled;

  if (allGood) {
    return (
      <Card className="border-4 border-green-500 bg-green-50 p-4 mb-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="font-medium text-green-800">
            Chat system is properly configured and ready!
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-4 border-red-500 bg-red-50 p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-bold text-red-800">
            Chat Database Configuration Issues
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.configured)}
              <span className="font-medium">Supabase Configuration</span>
            </div>
            {getStatusBadge(status.configured)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.messagesTableExists)}
              <span className="font-medium">Messages Table Exists</span>
            </div>
            {getStatusBadge(status.messagesTableExists)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.hasProjectIdColumn)}
              <span className="font-medium">Correct Table Structure</span>
            </div>
            {getStatusBadge(status.hasProjectIdColumn)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.rls_enabled)}
              <span className="font-medium">Database Permissions</span>
            </div>
            {getStatusBadge(status.rls_enabled)}
          </div>
        </div>

        {status.error && (
          <div className="p-3 bg-red-100 border-2 border-red-300 rounded">
            <p className="text-sm text-red-700 font-medium">Error Details:</p>
            <p className="text-sm text-red-600">{status.error}</p>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t-2 border-red-300">
          <h4 className="font-bold text-red-800">Required Actions:</h4>

          {!status.configured && (
            <div className="p-3 bg-yellow-50 border-2 border-yellow-300 rounded">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                1. Configure Supabase
              </p>
              <p className="text-xs text-yellow-700">
                Set up your .env file with VITE_SUPABASE_URL and
                VITE_SUPABASE_ANON_KEY
              </p>
            </div>
          )}

          {status.configured && !status.hasCorrectStructure && (
            <div className="p-3 bg-yellow-50 border-2 border-yellow-300 rounded">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                2. Run Database Migration
              </p>
              <p className="text-xs text-yellow-700 mb-2">
                The simplified chat system requires updated database structure.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  onClick={handleApplyMigration}
                  disabled={migrating}
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {migrating ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3 h-3 mr-1" />
                      Apply Migration
                    </>
                  )}
                </Button>
                <span className="text-xs text-yellow-700">
                  or use CLI:{" "}
                  <code className="bg-yellow-100 px-1 rounded">
                    supabase db push
                  </code>
                </span>
              </div>
            </div>
          )}

          {migrationResult && (
            <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded">
              <p className="text-sm text-blue-800">{migrationResult}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={checkDatabaseStatus}
              variant="outline"
              size="sm"
              className="border-2 border-red-500 text-red-700 hover:bg-red-50"
            >
              Recheck Status
            </Button>

            <Button
              onClick={() => window.open("https://supabase.com/docs", "_blank")}
              variant="outline"
              size="sm"
              className="border-2 border-red-500 text-red-700 hover:bg-red-50"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Supabase Docs
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatDatabaseStatus;
