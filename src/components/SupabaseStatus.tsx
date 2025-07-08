import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  testSupabaseConnection,
  checkDatabaseSchema,
} from "@/lib/supabase-test";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Loader2,
} from "lucide-react";

export const SupabaseStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [schemaStatus, setSchemaStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    try {
      const connResult = await testSupabaseConnection();
      setConnectionStatus(connResult);

      const schemaResult = await checkDatabaseSchema();
      setSchemaStatus(schemaResult);
    } catch (error) {
      console.error("Test failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const isConnected = connectionStatus?.success;
  const hasAllTables =
    schemaStatus &&
    !schemaStatus.error &&
    Object.values(schemaStatus).every((table: any) => table.exists);

  return (
    <Card className="border-2 border-black shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Supabase Connection Status
        </CardTitle>
        <CardDescription>
          Real-time database connection and schema status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Database Connection:</span>
          <Badge
            variant={isConnected ? "default" : "destructive"}
            className={isConnected ? "bg-green-500" : "bg-red-500"}
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : isConnected ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {isLoading ? "Testing..." : isConnected ? "Connected" : "Failed"}
          </Badge>
        </div>

        {/* Schema Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Database Schema:</span>
          <Badge
            variant={hasAllTables ? "default" : "destructive"}
            className={hasAllTables ? "bg-green-500" : "bg-yellow-500"}
          >
            {hasAllTables ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {hasAllTables ? "Complete" : "Incomplete"}
          </Badge>
        </div>

        {/* User Count */}
        {isConnected && connectionStatus?.userCount !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Users in Database:</span>
            <Badge variant="outline">{connectionStatus.userCount}</Badge>
          </div>
        )}

        {/* Error Details */}
        {!isConnected && connectionStatus?.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800 font-medium">
              Connection Error:
            </p>
            <p className="text-sm text-red-600">{connectionStatus.error}</p>
          </div>
        )}

        {/* Schema Details */}
        {schemaStatus && !schemaStatus.error && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Table Status:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(schemaStatus).map(
                ([table, status]: [string, any]) => (
                  <div
                    key={table}
                    className="flex items-center justify-between"
                  >
                    <span>{table}:</span>
                    {status.exists ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <Button
          onClick={runTests}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full mt-4"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Testing..." : "Refresh Status"}
        </Button>

        {/* Setup Instructions */}
        {!hasAllTables && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-medium text-blue-800 mb-2">
              Setup Required:
            </p>
            <p className="text-sm text-blue-600">
              Run the database setup script in your Supabase SQL Editor. Check{" "}
              <code>SUPABASE_SETUP.md</code> for instructions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseStatus;
