import React from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Database, Wifi, WifiOff, ExternalLink } from "lucide-react";

const SupabaseStatus: React.FC = () => {
  if (isSupabaseConfigured) {
    return (
      <Badge className="bg-green-100 text-green-800 border-2 border-green-500">
        <Database className="w-3 h-3 mr-1" />
        Connected to Supabase
      </Badge>
    );
  }

  return (
    <Card className="border-4 border-yellow-500 bg-yellow-50 p-4 mb-6">
      <div className="flex items-start gap-3">
        <WifiOff className="w-6 h-6 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-yellow-800 mb-2">Development Mode</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Supabase is not configured. The app is running with mock data for
            development.
          </p>
          <div className="space-y-2 text-xs text-yellow-600">
            <p>To connect to a real database:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Create a Supabase project at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  supabase.com
                </a>
              </li>
              <li>
                Update your{" "}
                <code className="bg-yellow-100 px-1 rounded">.env</code> file
                with your project URL and API key
              </li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-2 border-yellow-600 text-yellow-800 hover:bg-yellow-100"
              onClick={() =>
                window.open("https://supabase.com/dashboard", "_blank")
              }
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Supabase Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SupabaseStatus;
