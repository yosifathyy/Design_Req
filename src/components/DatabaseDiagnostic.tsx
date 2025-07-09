import React, { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

const DatabaseDiagnostic: React.FC = () => {
  const [tests, setTests] = useState({
    config: { status: "pending", message: "" },
    auth: { status: "pending", message: "" },
    tables: { status: "pending", message: "" },
    designRequests: { status: "pending", message: "" },
  });

  const runDiagnostics = async () => {
    setTests({
      config: { status: "pending", message: "" },
      auth: { status: "pending", message: "" },
      tables: { status: "pending", message: "" },
      designRequests: { status: "pending", message: "" },
    });

    // Test 1: Configuration
    try {
      if (isSupabaseConfigured) {
        setTests((prev) => ({
          ...prev,
          config: {
            status: "success",
            message: "Supabase is properly configured",
          },
        }));
      } else {
        setTests((prev) => ({
          ...prev,
          config: { status: "error", message: "Supabase is not configured" },
        }));
        return;
      }
    } catch (error) {
      setTests((prev) => ({
        ...prev,
        config: { status: "error", message: `Configuration error: ${error}` },
      }));
      return;
    }

    // Test 2: Authentication
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      setTests((prev) => ({
        ...prev,
        auth: {
          status: "success",
          message: data.session
            ? `Authenticated as: ${data.session.user.email}`
            : "Not authenticated (but connection works)",
        },
      }));
    } catch (error: any) {
      setTests((prev) => ({
        ...prev,
        auth: { status: "error", message: `Auth error: ${error.message}` },
      }));
    }

    // Test 3: Check if we can query any table
    try {
      // Try a simple query to test basic connectivity
      const { data, error } = await supabase
        .from("design_requests")
        .select("count")
        .limit(1);

      if (error) {
        if (
          error.message?.includes('relation "design_requests" does not exist')
        ) {
          setTests((prev) => ({
            ...prev,
            tables: {
              status: "warning",
              message: "design_requests table does not exist",
            },
          }));
        } else {
          setTests((prev) => ({
            ...prev,
            tables: {
              status: "error",
              message: `Table query error: ${error.message}`,
            },
          }));
        }
      } else {
        setTests((prev) => ({
          ...prev,
          tables: {
            status: "success",
            message: "design_requests table exists and is accessible",
          },
        }));
      }
    } catch (error: any) {
      setTests((prev) => ({
        ...prev,
        tables: {
          status: "error",
          message: `Connection error: ${error.message}`,
        },
      }));
    }

    // Test 4: Try to fetch a specific design request (if we have a projectId in URL)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get("request");

      if (projectId) {
        const { data, error } = await supabase
          .from("design_requests")
          .select("*")
          .eq("id", projectId)
          .maybeSingle();

        if (error) {
          setTests((prev) => ({
            ...prev,
            designRequests: {
              status: "error",
              message: `Query error: ${error.message}`,
            },
          }));
        } else if (!data) {
          setTests((prev) => ({
            ...prev,
            designRequests: {
              status: "warning",
              message: `No project found with ID: ${projectId}`,
            },
          }));
        } else {
          setTests((prev) => ({
            ...prev,
            designRequests: {
              status: "success",
              message: `Found project: ${data.title}`,
            },
          }));
        }
      } else {
        setTests((prev) => ({
          ...prev,
          designRequests: {
            status: "info",
            message: "No project ID in URL to test",
          },
        }));
      }
    } catch (error: any) {
      setTests((prev) => ({
        ...prev,
        designRequests: {
          status: "error",
          message: `Project fetch error: ${error.message}`,
        },
      }));
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Database Diagnostic</h3>
          <Button onClick={runDiagnostics} size="sm">
            Run Tests
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon(tests.config.status)}
            <div>
              <div className="font-medium">Configuration</div>
              <div className="text-sm text-gray-600">
                {tests.config.message}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon(tests.auth.status)}
            <div>
              <div className="font-medium">Authentication</div>
              <div className="text-sm text-gray-600">{tests.auth.message}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon(tests.tables.status)}
            <div>
              <div className="font-medium">Table Access</div>
              <div className="text-sm text-gray-600">
                {tests.tables.message}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon(tests.designRequests.status)}
            <div>
              <div className="font-medium">Project Fetch</div>
              <div className="text-sm text-gray-600">
                {tests.designRequests.message}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DatabaseDiagnostic;
