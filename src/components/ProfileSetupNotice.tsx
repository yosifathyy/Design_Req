import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, User, CheckCircle, AlertTriangle } from "lucide-react";

interface ProfileSetupNoticeProps {
  isCreating?: boolean;
  onRetry?: () => void;
  userEmail?: string;
}

export const ProfileSetupNotice = ({
  isCreating = false,
  onRetry,
  userEmail = "your account",
}: ProfileSetupNoticeProps) => {
  if (isCreating) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <AlertDescription className="text-blue-800">
          <strong>Setting up your profile...</strong>
          <br />
          We're creating your user profile for <code>{userEmail}</code>. This
          should only take a moment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="w-4 h-4" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <strong>Profile Setup Required</strong>
            <br />
            Your authentication account exists, but we need to create your user
            profile in the database.
            <br />
            <small className="text-orange-600">
              Email: <code>{userEmail}</code>
            </small>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileSetupNotice;
