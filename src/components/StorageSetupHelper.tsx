import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Copy,
  Database,
  Folder,
  Settings,
} from "lucide-react";

const StorageSetupHelper: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const { toast } = useToast();

  const checkBucketStatus = async () => {
    try {
      console.log("🔍 Checking bucket status...");
      const { data: buckets, error } = await supabase.storage.listBuckets();

      console.log("Bucket check response:", { buckets, error });

      if (error) {
        console.error("Error checking buckets:", error);
        setBucketExists(false);
        return false;
      }

      console.log(
        "Available buckets:",
        buckets?.map((b) => b.name),
      );

      const chatFilesBucket = buckets?.find(
        (bucket) => bucket.name === "chat-files",
      );

      console.log("chat-files bucket found:", !!chatFilesBucket);

      setBucketExists(!!chatFilesBucket);
      return !!chatFilesBucket;
    } catch (error) {
      console.error("Error checking bucket status:", error);
      setBucketExists(false);
      return false;
    }
  };

  const createBucketProgrammatically = async () => {
    setCreating(true);

    try {
      // Create the bucket directly using storage API
      const { data, error } = await supabase.storage.createBucket("chat-files", {
        public: true,
        allowedMimeTypes: ["image/*", "application/pdf", "text/*"],
        fileSizeLimit: 10485760, // 10MB
      });

      if (error) {
        console.error("Error creating bucket via storage API:", error);

        // If RPC fails, try the direct storage API
        try {
          const { data: bucketData, error: bucketError } =
            await supabase.storage.createBucket("chat-files", {
              public: true,
              fileSizeLimit: 10485760, // 10MB
            });

          if (bucketError) {
            throw bucketError;
          }
        } catch (directError: any) {
          console.error("Direct bucket creation also failed:", directError);

          const errorMessage =
            directError?.message || directError?.details || "Unknown error";
          toast({
            title: "Auto-creation failed",
            description: `${errorMessage}. Please create the bucket manually using the instructions below.`,
            variant: "destructive",
          });
          return false;
        }
      }

      toast({
        title: "Bucket created successfully!",
        description: "The chat-files storage bucket is now ready to use.",
      });

      setBucketExists(true);
      return true;
    } catch (error: any) {
      console.error("Error creating bucket:", error);
      const errorMessage = error?.message || error?.details || "Unknown error";
      toast({
        title: "Auto-creation failed",
        description: `${errorMessage}. Please create the bucket manually using the instructions below.`,
        variant: "destructive",
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "SQL copied to clipboard",
    });
  };

  const sqlScript = `-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for chat files bucket
CREATE POLICY "Users can upload chat files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'chat-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view chat files" ON storage.objects
  FOR SELECT USING (bucket_id = 'chat-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their chat files" ON storage.objects
  FOR DELETE USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);`;

  React.useEffect(() => {
    checkBucketStatus();
  }, []);

  if (bucketExists === true) {
    return (
      <Card className="p-4 border-2 border-green-500 bg-green-50">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-bold text-green-800">Storage Ready!</h3>
            <p className="text-sm text-green-700">
              The chat-files bucket is configured and ready to use.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-orange-500 bg-orange-50">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <div>
            <h3 className="font-bold text-orange-800">
              Storage Bucket Setup Required
            </h3>
            <p className="text-sm text-orange-700">
              The chat file upload feature needs a storage bucket to be created.
            </p>
          </div>
        </div>

        {/* Auto-create option */}
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2">
            Option 1: Auto-Create (Recommended)
          </h4>
          <p className="text-sm text-orange-700 mb-3">
            Try to create the storage bucket automatically:
          </p>
          <Button
            onClick={createBucketProgrammatically}
            disabled={creating}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {creating ? "Creating..." : "Create Storage Bucket"}
          </Button>
        </div>

        {/* Manual option */}
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2">
            Option 2: Manual Setup
          </h4>
          <p className="text-sm text-orange-700 mb-3">
            If auto-creation fails, follow these steps:
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="w-6 h-6 p-0 flex items-center justify-center"
              >
                1
              </Badge>
              <span>Go to your Supabase Dashboard → Storage</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open("https://supabase.com/dashboard", "_blank")
                }
                className="ml-auto"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open Dashboard
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="w-6 h-6 p-0 flex items-center justify-center"
              >
                2
              </Badge>
              <span>Click "Create a new bucket"</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="w-6 h-6 p-0 flex items-center justify-center"
              >
                3
              </Badge>
              <span>
                Name it:{" "}
                <code className="bg-gray-100 px-1 rounded">chat-files</code>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="w-6 h-6 p-0 flex items-center justify-center"
              >
                4
              </Badge>
              <span>
                Make it <strong>Public</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="w-6 h-6 p-0 flex items-center justify-center"
              >
                5
              </Badge>
              <span>Or run this SQL in SQL Editor:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(sqlScript)}
                className="ml-auto"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy SQL
              </Button>
            </div>
          </div>

          {/* SQL Script */}
          <div className="mt-3 p-3 bg-gray-100 rounded border text-xs font-mono overflow-x-auto">
            <pre>{sqlScript}</pre>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={checkBucketStatus} variant="outline" size="sm">
            Check Again
          </Button>
          <Button
            onClick={() => {
              setBucketExists(null);
              setTimeout(checkBucketStatus, 100);
            }}
            variant="outline"
            size="sm"
          >
            Force Refresh
          </Button>
          <span className="text-xs text-orange-600">
            Click "Check Again" after creating the bucket
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StorageSetupHelper;
