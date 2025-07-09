import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, Send, AlertTriangle } from "lucide-react";
import ErrorDisplay from "./ErrorDisplay";

interface MessageSendTestProps {
  projectId?: string;
}

export const MessageSendTest: React.FC<MessageSendTestProps> = ({
  projectId,
}) => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState("Test message");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const testMessageSend = async () => {
    if (!user || !projectId || !testMessage.trim()) {
      setError("Missing user, project ID, or message");
      return;
    }

    setTesting(true);
    setError(null);
    setResult(null);

    try {
      console.log("🧪 Testing message send...");
      console.log("User ID:", user.id);
      console.log("Project ID:", projectId);
      console.log("Message:", testMessage);

      // Step 1: Check if project exists
      console.log("Step 1: Checking if project exists...");
      const { data: projectData, error: projectError } = await supabase
        .from("design_requests")
        .select("id, title")
        .eq("id", projectId)
        .single();

      if (projectError) {
        throw new Error(`Project check failed: ${projectError.message}`);
      }

      console.log("✅ Project exists:", projectData);

      // Step 2: Get or create chat
      console.log("Step 2: Getting or creating chat...");
      let { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select("id")
        .eq("request_id", projectId)
        .limit(1);

      if (chatsError) {
        throw chatsError;
      }

      let chatId: string;

      if (!chatsData || chatsData.length === 0) {
        console.log("Creating new chat...");
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
        console.log("✅ Created new chat:", chatId);
      } else {
        chatId = chatsData[0].id;
        console.log("✅ Using existing chat:", chatId);
      }

      // Step 3: Try to send message
      console.log("Step 3: Sending message...");
      const messageData = {
        chat_id: chatId,
        sender_id: user.id,
        text: testMessage.trim(),
      };

      console.log("Message data:", messageData);

      const { data: insertedMessage, error: messageError } = await supabase
        .from("messages")
        .insert([messageData])
        .select(
          `
          id,
          chat_id,
          sender_id,
          text,
          created_at,
          sender:users!sender_id(id, name, email, role, avatar_url)
        `,
        )
        .single();

      if (messageError) {
        throw messageError;
      }

      console.log("✅ Message sent successfully:", insertedMessage);
      setResult({
        success: true,
        message: "Message sent successfully!",
        data: insertedMessage,
      });
    } catch (err: any) {
      console.error("❌ Message send test failed:", err);
      console.error("Error type:", typeof err);
      console.error("Error properties:", Object.keys(err || {}));
      console.error("Error.code:", err?.code);
      console.error("Error.message:", err?.message);
      console.error("Error.details:", err?.details);
      console.error("Error.hint:", err?.hint);

      setError(err);
      setResult({
        success: false,
        message: "Message send failed",
        error: err,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-2 border-purple-500 bg-purple-50 p-4">
      <h3 className="text-lg font-bold text-purple-800 mb-4">
        🧪 Message Send Test
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Test Message:
          </label>
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message"
            className="border-2 border-purple-300"
          />
        </div>

        <div className="text-sm text-purple-700">
          <div>User: {user?.email}</div>
          <div>Project ID: {projectId || "Not provided"}</div>
        </div>

        <Button
          onClick={testMessageSend}
          disabled={testing || !user || !projectId || !testMessage.trim()}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {testing ? "Testing..." : "Test Message Send"}
        </Button>

        {result && (
          <div
            className={`p-3 rounded border-2 ${
              result.success
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}
          >
            <div
              className={`font-medium ${
                result.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.message}
            </div>
            {result.data && (
              <div className="text-xs mt-2 text-green-700">
                Message ID: {result.data.id}
              </div>
            )}
          </div>
        )}

        {error && <ErrorDisplay error={error} title="Message Send Error" />}
      </div>
    </Card>
  );
};

export default MessageSendTest;
