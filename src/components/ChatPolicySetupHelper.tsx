import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ExternalLink,
  Copy,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  Database,
} from "lucide-react";

export const ChatPolicySetupHelper = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const supabaseUrl =
    "https://supabase.com/dashboard/project/dnmygswmvzxnkqhcslhc/sql";

  const simplePolicySQL = `-- Add missing chat policies
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

SELECT 'Chat policies created successfully!' as status;`;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <MessageCircle className="w-5 h-5" />
          Chat Setup Required
        </CardTitle>
        <CardDescription className="text-orange-700">
          Chat functionality needs database policies to be set up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-100">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-orange-800">
            The chat tables have security policies enabled, but the necessary
            permissions for creating chats are missing.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h4 className="font-semibold text-orange-800 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Quick Fix - Add Chat Policies:
          </h4>

          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              1
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Go to Supabase SQL Editor
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <a href={supabaseUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open SQL Editor
                </a>
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              2
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Copy and paste this SQL policy script
              </p>
              <div className="space-y-2">
                <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto max-h-32">
                  <pre>{simplePolicySQL}</pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(simplePolicySQL, 1)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  {copiedStep === 1 ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copiedStep === 1 ? "Copied!" : "Copy SQL"}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              3
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Click "Run" in the SQL Editor
              </p>
              <p className="text-sm text-orange-700">
                You should see: "Chat policies created successfully!"
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              4
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Try opening the chat again
              </p>
              <p className="text-sm text-orange-700">
                The chat should now initialize without errors.
              </p>
            </div>
          </div>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="w-4 h-4" />
          <AlertDescription className="text-green-800">
            <strong>What this does:</strong> Adds security policies that allow
            users to create chats for requests they own or are assigned to as
            designers.
          </AlertDescription>
        </Alert>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-blue-800">
            <strong>Need help?</strong> If you're still having issues, check
            that you're logged in as a user who owns the request or is assigned
            as the designer.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ChatPolicySetupHelper;
