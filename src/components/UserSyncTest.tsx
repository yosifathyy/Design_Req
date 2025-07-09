import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, User, CheckCircle, AlertTriangle } from "lucide-react";

export const UserSyncTest: React.FC = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");

  const testMessageSending = async () => {
    if (!user) {
      setResult("❌ No user logged in");
      return;
    }

    setTesting(true);
    setResult("Testing message sending capability...");

    try {
      // Try to insert a test message to see if we get the foreign key error
      const testData = {
        chat_id: "test-chat-id", // This will fail, but we're checking for the user FK
        sender_id: user.id,
        text: "TEST MESSAGE - DO NOT SAVE",
      };

      const { error } = await supabase
        .from("messages")
        .insert([testData])
        .select()
        .single();

      if (error) {
        if (error.code === "23503" && error.message.includes("sender_id")) {
          setResult(
            "❌ User sync issue detected - Your authentication account exists but user profile is missing. Use 'Fix User Record' to resolve this.",
          );
        } else if (
          error.code === "23503" &&
          error.message.includes("chat_id")
        ) {
          setResult(
            "✅ User record exists (chat_id error is expected for this test)",
          );
        } else {
          setResult(`❓ Other error: ${error.message}`);
        }
      } else {
        setResult("✅ Test successful - user record exists and is valid");
      }
    } catch (err: any) {
      setResult(`❌ Test failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (!user) {
    return (
      <Card className="border-2 border-yellow-500 bg-yellow-50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">
            Please log in to test user sync
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-500 bg-purple-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-purple-800">🧪 User Sync Test</h3>
        <Button
          onClick={testMessageSending}
          disabled={testing}
          size="sm"
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <User className="w-4 h-4 mr-1" />
          )}
          {testing ? "Testing..." : "Test User Sync"}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <div className="font-medium text-purple-800">Test Info:</div>
          <div className="text-purple-700">
            This test checks if your user ID exists in the users table by
            attempting a message insert.
          </div>
        </div>

        {result && (
          <div
            className={`p-3 rounded border-2 text-sm ${
              result.includes("✅")
                ? "bg-green-50 border-green-300 text-green-800"
                : result.includes("❌")
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-blue-50 border-blue-300 text-blue-800"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserSyncTest;
