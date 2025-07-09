import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { simpleInvoicesApi } from "@/lib/invoices-simple-api";
import { Loader2, Database, CheckCircle, XCircle } from "lucide-react";

const InvoiceDebugger: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setTesting(true);
    const testResults: any[] = [];

    try {
      // Test 1: Basic Supabase connectivity
      testResults.push({ test: "Supabase Connection", status: "testing" });
      setResults([...testResults]);

      const { data: testData, error: testError } = await supabase
        .from("users")
        .select("id, name")
        .limit(1);

      if (testError) {
        testResults[0] = {
          test: "Supabase Connection",
          status: "failed",
          error: testError.message,
        };
      } else {
        testResults[0] = {
          test: "Supabase Connection",
          status: "passed",
          data: `Found ${testData?.length || 0} users`,
        };
      }
      setResults([...testResults]);

      // Test 2: Design requests table
      testResults.push({ test: "Design Requests Table", status: "testing" });
      setResults([...testResults]);

      const { data: requests, error: requestsError } = await supabase
        .from("design_requests")
        .select("id, title, category, user_id")
        .limit(5);

      if (requestsError) {
        testResults[1] = {
          test: "Design Requests Table",
          status: "failed",
          error: requestsError.message,
        };
      } else {
        testResults[1] = {
          test: "Design Requests Table",
          status: "passed",
          data: `Found ${requests?.length || 0} design requests`,
          details: requests,
        };
      }
      setResults([...testResults]);

      // Test 3: Invoice category requests
      testResults.push({ test: "Invoice Category Filter", status: "testing" });
      setResults([...testResults]);

      const { data: invoiceRequests, error: invoiceError } = await supabase
        .from("design_requests")
        .select("*")
        .eq("category", "invoice");

      if (invoiceError) {
        testResults[2] = {
          test: "Invoice Category Filter",
          status: "failed",
          error: invoiceError.message,
        };
      } else {
        testResults[2] = {
          test: "Invoice Category Filter",
          status: "passed",
          data: `Found ${invoiceRequests?.length || 0} invoice entries`,
          details: invoiceRequests,
        };
      }
      setResults([...testResults]);

      // Test 4: Invoice API
      testResults.push({ test: "Invoice API", status: "testing" });
      setResults([...testResults]);

      try {
        const apiInvoices = await simpleInvoicesApi.getAll();
        testResults[3] = {
          test: "Invoice API",
          status: "passed",
          data: `API returned ${apiInvoices.length} invoices`,
          details: apiInvoices,
        };
      } catch (apiError) {
        testResults[3] = {
          test: "Invoice API",
          status: "failed",
          error:
            apiError instanceof Error ? apiError.message : "Unknown API error",
        };
      }
      setResults([...testResults]);

      toast({
        title: "Diagnostics Complete",
        description: "Check the results below for detailed information.",
      });
    } catch (error) {
      console.error("Diagnostics failed:", error);
      toast({
        title: "Diagnostics Failed",
        description: "An error occurred while running diagnostics.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const createSampleInvoice = async () => {
    try {
      setTesting(true);

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Create a sample invoice
      const sampleInvoice = await simpleInvoicesApi.create({
        title: "Sample Test Invoice",
        description: "This is a test invoice created for debugging",
        clientId: user.id,
        taxRate: 8.25,
        notes: "Test invoice - can be safely deleted",
        terms: "Payment due within 30 days",
        lineItems: [
          {
            description: "Test Design Service",
            quantity: 1,
            unitPrice: 100,
            itemType: "design",
          },
        ],
      });

      toast({
        title: "Sample Invoice Created!",
        description: `Created invoice ${sampleInvoice.invoiceNumber}`,
      });

      // Re-run diagnostics to show the new invoice
      await runDiagnostics();
    } catch (error) {
      console.error("Error creating sample invoice:", error);
      toast({
        title: "Error creating sample invoice",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-display font-bold text-black mb-2">
          Invoice System Debugger
        </h3>
        <p className="text-black/70">
          Test database connectivity and invoice system functionality
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={runDiagnostics}
          disabled={testing}
          className="bg-festival-orange hover:bg-festival-amber border-4 border-black"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Database className="w-4 h-4 mr-2" />
          )}
          Run Diagnostics
        </Button>

        <Button
          onClick={createSampleInvoice}
          disabled={testing}
          variant="outline"
          className="border-4 border-black"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Create Sample Invoice
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-black">Diagnostic Results:</h4>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 border-2 rounded ${
                result.status === "passed"
                  ? "border-green-500 bg-green-50"
                  : result.status === "failed"
                    ? "border-red-500 bg-red-50"
                    : "border-yellow-500 bg-yellow-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.status === "passed" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : result.status === "failed" ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                )}
                <h5 className="font-bold">{result.test}</h5>
              </div>

              {result.data && (
                <p className="text-sm text-gray-600 mb-2">{result.data}</p>
              )}

              {result.error && (
                <p className="text-sm text-red-600 mb-2">
                  Error: {result.error}
                </p>
              )}

              {result.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default InvoiceDebugger;
