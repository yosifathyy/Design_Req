import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Loader2,
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

export const ChatConnectionFixer: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [fixed, setFixed] = useState(false);

  const runQuickFix = async () => {
    setTesting(true);
    setResults([]);
    setFixed(false);

    const newResults: string[] = [];

    try {
      // Quick environment check
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!url || !key) {
        newResults.push("❌ Missing environment variables");
        newResults.push("💡 Solution: Check your .env file");
        setResults([...newResults]);
        setTesting(false);
        return;
      }

      newResults.push("✅ Environment variables present");
      setResults([...newResults]);

      // Test basic connectivity
      newResults.push("🔄 Testing basic connectivity...");
      setResults([...newResults]);

      try {
        const response = await fetch(`${url}/rest/v1/`, {
          method: "HEAD",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });

        if (response.ok) {
          newResults.push("✅ Basic connectivity working");
          setFixed(true);
        } else {
          newResults.push(`❌ API responded with ${response.status}`);
          newResults.push("💡 Solution: Check your Supabase project status");
        }
      } catch (error: any) {
        if (error.message.includes("Failed to fetch")) {
          newResults.push("❌ Network connection blocked");
          newResults.push("💡 Possible solutions:");
          newResults.push("  • Check your internet connection");
          newResults.push("  • Disable VPN/proxy temporarily");
          newResults.push("  • Check firewall settings");
          newResults.push("  • Try from a different network");
        } else {
          newResults.push(`❌ Connection error: ${error.message}`);
        }
      }

      setResults([...newResults]);
    } catch (error: any) {
      newResults.push(`❌ Test failed: ${error.message}`);
      setResults([...newResults]);
    } finally {
      setTesting(false);
    }
  };

  const handleRetryChat = () => {
    setResults([]);
    setFixed(false);
    onRetry();
  };

  return (
    <Card className="border-4 border-orange-500 bg-orange-50 p-6 mb-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-bold text-orange-800">
            Chat Connection Issue
          </h3>
        </div>

        <div className="text-sm text-orange-700">
          <p className="mb-2">
            <strong>Can't load messages?</strong> This usually happens when:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs ml-4">
            <li>Network connection is unstable</li>
            <li>Supabase server is temporarily unavailable</li>
            <li>Environment variables are missing/incorrect</li>
            <li>Browser is blocking the connection</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={runQuickFix}
            disabled={testing}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="sm"
          >
            {testing ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Diagnosing...
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Quick Fix
              </>
            )}
          </Button>

          <Button
            onClick={handleRetryChat}
            variant="outline"
            size="sm"
            className="border-2 border-orange-500 text-orange-700 hover:bg-orange-100"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry Chat
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            {fixed && (
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <Badge className="bg-green-500 text-white text-xs">
                  CONNECTION FIXED
                </Badge>
              </div>
            )}

            <div className="bg-white p-3 rounded border font-mono text-xs space-y-1 max-h-32 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="leading-relaxed">
                  {result}
                </div>
              ))}
            </div>

            {fixed && (
              <Button
                onClick={handleRetryChat}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Try Loading Messages Again
              </Button>
            )}
          </div>
        )}

        {!testing && results.length === 0 && (
          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded text-xs">
            <p className="font-medium text-yellow-800 mb-1">
              Quick Fixes to Try:
            </p>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
              <li>Check if you're connected to the internet</li>
              <li>Try disabling ad blockers or VPN</li>
              <li>Clear browser cache and cookies</li>
              <li>Try opening in incognito/private mode</li>
            </ol>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatConnectionFixer;
