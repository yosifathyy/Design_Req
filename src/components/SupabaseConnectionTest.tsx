import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface ConnectionStatus {
  configured: boolean;
  connected: boolean;
  userTableAccess: boolean;
  chatsTableAccess: boolean;
  messagesTableAccess: boolean;
  error?: string;
}

export const SupabaseConnectionTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);

  const testConnection = async () => {
    setTesting(true);
    console.log("=== Supabase Connection Test ===");

    try {
      // Test 1: Configuration
      console.log("1. Checking configuration...");
      if (!isSupabaseConfigured) {
        setStatus({
          configured: false,
          connected: false,
          userTableAccess: false,
          chatsTableAccess: false,
          messagesTableAccess: false,
          error: "Supabase not configured. Check environment variables.",
        });
        return;
      }

      // Test 2: Basic connection
      console.log("2. Testing basic connection...");
      const connectionStart = Date.now();
      const { data: connectionTest, error: connectionError } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      const connectionTime = Date.now() - connectionStart;
      console.log(`Connection took ${connectionTime}ms`);

      if (connectionError) {
        console.error("Connection failed:", connectionError);
        setStatus({
          configured: true,
          connected: false,
          userTableAccess: false,
          chatsTableAccess: false,
          messagesTableAccess: false,
          error: `Connection failed: ${connectionError.message}`,
        });
        return;
      }

      // Test 3: Chats table access
      console.log("3. Testing chats table access...");
      const { data: chatsTest, error: chatsError } = await supabase
        .from("chats")
        .select("id, request_id")
        .limit(1);

      // Test 4: Messages table access
      console.log("4. Testing messages table access...");
      const { data: messagesTest, error: messagesError } = await supabase
        .from("messages")
        .select("id, chat_id, sender_id")
        .limit(1);

      console.log("Connection test results:", {
        configured: true,
        connected: true,
        userTableAccess: !connectionError,
        chatsTableAccess: !chatsError,
        messagesTableAccess: !messagesError,
        connectionTime: `${connectionTime}ms`,
      });

      setStatus({
        configured: true,
        connected: true,
        userTableAccess: !connectionError,
        chatsTableAccess: !chatsError,
        messagesTableAccess: !messagesError,
        error: messagesError?.message || chatsError?.message,
      });
    } catch (error: any) {
      console.error("Connection test failed:", error);
      setStatus({
        configured: isSupabaseConfigured,
        connected: false,
        userTableAccess: false,
        chatsTableAccess: false,
        messagesTableAccess: false,
        error: error.message || "Test failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (condition: boolean) => {
    return condition ? (
      <Badge className="bg-green-500 text-white text-xs">OK</Badge>
    ) : (
      <Badge className="bg-red-500 text-white text-xs">FAIL</Badge>
    );
  };

  return (
    <Card className="border-4 border-blue-500 bg-blue-50 p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-blue-800">
              Supabase Connection Test
            </h3>
          </div>
          <Button
            onClick={testConnection}
            disabled={testing}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {testing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {testing ? "Testing..." : "Test"}
          </Button>
        </div>

        {status && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.configured)}
                <span>Configuration</span>
              </div>
              {getStatusBadge(status.configured)}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.connected)}
                <span>Network Connection</span>
              </div>
              {getStatusBadge(status.connected)}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.userTableAccess)}
                <span>Users Table</span>
              </div>
              {getStatusBadge(status.userTableAccess)}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.chatsTableAccess)}
                <span>Chats Table</span>
              </div>
              {getStatusBadge(status.chatsTableAccess)}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.messagesTableAccess)}
                <span>Messages Table</span>
              </div>
              {getStatusBadge(status.messagesTableAccess)}
            </div>

            {status.error && (
              <div className="p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
                <strong>Error:</strong> {status.error}
              </div>
            )}
          </div>
        )}

        {!status && (
          <p className="text-sm text-blue-700">
            Click "Test" to check your Supabase connection and database access.
          </p>
        )}
      </div>
    </Card>
  );
};

export default SupabaseConnectionTest;
