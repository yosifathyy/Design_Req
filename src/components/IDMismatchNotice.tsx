import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, RefreshCw } from "lucide-react";

interface IDMismatchNoticeProps {
  authUserId: string;
  databaseUserId: string;
  userEmail: string;
  onRefresh?: () => void;
}

export const IDMismatchNotice = ({
  authUserId,
  databaseUserId,
  userEmail,
  onRefresh,
}: IDMismatchNoticeProps) => {
  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <AlertTriangle className="w-4 h-4" />
      <AlertDescription className="text-yellow-800">
        <div className="space-y-3">
          <div>
            <strong>User ID Mismatch Detected</strong>
            <br />
            Your authentication account and database profile have different IDs.
            This is not critical, but may cause some features to work
            unexpectedly.
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Email:</span>
              <Badge variant="outline">{userEmail}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Auth ID:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {authUserId.slice(0, 8)}...
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Database ID:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {databaseUserId.slice(0, 8)}...
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-yellow-700">
              <strong>Note:</strong> Using existing database profile. All
              features should work normally.
            </div>
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default IDMismatchNotice;
