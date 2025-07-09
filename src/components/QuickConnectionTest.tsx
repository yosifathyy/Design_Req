import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Loader2, Wifi, AlertCircle, CheckCircle } from "lucide-react";

export const QuickConnectionTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean | null>(null);

  const runQuickTest = async () => {
    setTesting(true);
    setResults([]);
    setSuccess(null);

    const newResults: string[] = [];
    let allGood = true;

    try {
      // Test 1: Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      newResults.push(`🔧 Supabase URL: ${url ? "✅ Present" : "❌ Missing"}`);
      newResults.push(`🔑 API Key: ${key ? "✅ Present" : "❌ Missing"}`);

      if (!url || !key) {
        newResults.push(
          "❌ Environment variables missing. Check your .env file",
        );
        allGood = false;
        setResults([...newResults]);
        setSuccess(false);
        setTesting(false);
        return;
      }

      // Test 2: Validate URL format
      const urlValid =
        url.startsWith("https://") && url.includes(".supabase.co");
      newResults.push(`🌐 URL Format: ${urlValid ? "✅ Valid" : "❌ Invalid"}`);

      if (!urlValid) {
        newResults.push(
          "❌ URL should be like: https://your-project.supabase.co",
        );
        allGood = false;
      }

      // Test 3: Validate API key format
      const keyValid = key.startsWith("eyJ") && key.length > 100;
      newResults.push(
        `🔐 Key Format: ${keyValid ? "✅ Valid JWT" : "❌ Invalid"}`,
      );

      if (!keyValid) {
        newResults.push(
          "❌ API key should be a long JWT token starting with 'eyJ'",
        );
        allGood = false;
      }

      setResults([...newResults]);

      if (!allGood) {
        setSuccess(false);
        setTesting(false);
        return;
      }

      // Test 4: Network connectivity
      newResults.push("🔄 Testing network connectivity...");
      setResults([...newResults]);

      try {
        const response = await fetch(url, {
          method: "HEAD",
          mode: "no-cors", // Bypass CORS for basic connectivity test
        });
        newResults.push("🌐 Network: ✅ Can reach Supabase server");
      } catch (netError) {
        newResults.push(`🌐 Network: ❌ Cannot reach server - ${netError}`);
        allGood = false;
      }

      setResults([...newResults]);

      // Test 5: Direct API test
      newResults.push("🔄 Testing API access...");
      setResults([...newResults]);

      try {
        const apiResponse = await fetch(`${url}/rest/v1/`, {
          method: "GET",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });

        if (apiResponse.ok) {
          newResults.push(
            "🚀 API Access: ✅ Successfully connected to Supabase",
          );
        } else {
          const errorText = await apiResponse.text();
          newResults.push(
            `🚀 API Access: ❌ Failed (${apiResponse.status}) - ${errorText}`,
          );
          allGood = false;
        }
      } catch (apiError: any) {
        newResults.push(`🚀 API Access: ❌ ${apiError.message}`);
        allGood = false;
      }

      setResults([...newResults]);

      // Test 6: Try a simple table query
      if (allGood) {
        newResults.push("🔄 Testing table access...");
        setResults([...newResults]);

        try {
          const tableResponse = await fetch(
            `${url}/rest/v1/users?select=id&limit=1`,
            {
              method: "GET",
              headers: {
                apikey: key,
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (tableResponse.ok) {
            newResults.push("📊 Table Access: ✅ Users table accessible");
          } else {
            const errorText = await tableResponse.text();
            newResults.push(`📊 Table Access: ❌ Failed - ${errorText}`);
            allGood = false;
          }
        } catch (tableError: any) {
          newResults.push(`📊 Table Access: ❌ ${tableError.message}`);
          allGood = false;
        }
      }

      setResults([...newResults]);
      setSuccess(allGood);
    } catch (error: any) {
      newResults.push(`❌ Test failed: ${error.message}`);
      setResults([...newResults]);
      setSuccess(false);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-4 border-blue-500 bg-blue-50 p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-bold text-blue-800">
              Quick Supabase Connection Test
            </h3>
          </div>
          <Button
            onClick={runQuickTest}
            disabled={testing}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Run Test"
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            {success !== null && (
              <div className="flex items-center gap-2 mb-3">
                {success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <Badge className={success ? "bg-green-500" : "bg-red-500"}>
                  {success ? "ALL TESTS PASSED" : "ISSUES FOUND"}
                </Badge>
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded border font-mono text-sm space-y-1">
              {results.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </div>
        )}

        {!testing && results.length === 0 && (
          <div className="text-sm text-blue-700">
            Click "Run Test" to diagnose Supabase connection issues. This will
            check your configuration, network connectivity, and API access.
          </div>
        )}

        {success === false && (
          <div className="p-4 bg-red-100 border-2 border-red-300 rounded">
            <p className="text-sm font-medium text-red-800 mb-2">
              🔧 Quick Fixes:
            </p>
            <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
              <li>
                Check your .env file has the correct VITE_SUPABASE_URL and
                VITE_SUPABASE_ANON_KEY
              </li>
              <li>Verify your Supabase project is active and not paused</li>
              <li>
                Ensure your API key is the "anon/public" key from Supabase
                dashboard
              </li>
              <li>Try refreshing the page or clearing browser cache</li>
              <li>Check if you're behind a firewall blocking Supabase</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuickConnectionTest;
