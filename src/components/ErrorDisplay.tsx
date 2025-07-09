import React from "react";
import { Card } from "./ui/card";
import { AlertTriangle, Copy } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorDisplayProps {
  error: any;
  title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = "Error Details",
}) => {
  if (!error) return null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Error details copied to clipboard");
    } catch (err) {
      console.log("Failed to copy to clipboard", err);
    }
  };

  const getErrorDetails = () => {
    if (typeof error === "string") {
      return { message: error };
    }

    if (typeof error === "object" && error !== null) {
      return {
        message: error.message || "No message",
        code: error.code || "No code",
        details: error.details || "No details",
        hint: error.hint || "No hint",
        full: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      };
    }

    return { message: String(error) };
  };

  const errorDetails = getErrorDetails();

  return (
    <Card className="border-2 border-red-500 bg-red-50 p-4 my-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 mb-2">{title}</h3>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-red-800">Message: </span>
              <span className="text-red-700">{errorDetails.message}</span>
            </div>

            {errorDetails.code && errorDetails.code !== "No code" && (
              <div>
                <span className="font-medium text-red-800">Code: </span>
                <span className="text-red-700">{errorDetails.code}</span>
              </div>
            )}

            {errorDetails.details && errorDetails.details !== "No details" && (
              <div>
                <span className="font-medium text-red-800">Details: </span>
                <span className="text-red-700">{errorDetails.details}</span>
              </div>
            )}

            {errorDetails.hint && errorDetails.hint !== "No hint" && (
              <div>
                <span className="font-medium text-red-800">Hint: </span>
                <span className="text-red-700">{errorDetails.hint}</span>
              </div>
            )}
          </div>

          {errorDetails.full && (
            <details className="mt-3">
              <summary className="text-sm font-medium text-red-800 cursor-pointer">
                Full Error Object
              </summary>
              <div className="mt-2 relative">
                <pre className="text-xs bg-white p-2 rounded border max-h-40 overflow-auto">
                  {errorDetails.full}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(errorDetails.full)}
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </details>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ErrorDisplay;
