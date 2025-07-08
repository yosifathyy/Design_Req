import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ExternalLink,
  Copy,
  Users,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const AuthSetupHelper = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const supabaseUrl =
    "https://supabase.com/dashboard/project/dnmygswmvzxnkqhcslhc/auth/users";

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="w-5 h-5" />
          Authentication Setup Required
        </CardTitle>
        <CardDescription className="text-orange-700">
          Demo users exist in the database but need authentication accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-100">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-orange-800">
            The demo users <code>admin@demo.com</code> and{" "}
            <code>designer@demo.com</code>
            exist in your users table but don't have Supabase authentication
            accounts.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h4 className="font-semibold text-orange-800 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Quick Fix - Create Auth Users:
          </h4>

          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              1
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Go to Supabase Authentication Dashboard
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <a href={supabaseUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase Auth Dashboard
                </a>
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              2
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Click "Add user" and create admin user
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="bg-orange-100 px-2 py-1 rounded text-sm">
                    admin@demo.com
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("admin@demo.com", 1)}
                    className="h-6 px-2"
                  >
                    {copiedStep === 1 ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-orange-100 px-2 py-1 rounded text-sm">
                    demo123
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("demo123", 2)}
                    className="h-6 px-2"
                  >
                    {copiedStep === 2 ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              3
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Create designer user (optional)
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="bg-orange-100 px-2 py-1 rounded text-sm">
                    designer@demo.com
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("designer@demo.com", 3)}
                    className="h-6 px-2"
                  >
                    {copiedStep === 3 ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-orange-100 px-2 py-1 rounded text-sm">
                    demo123
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("demo123", 4)}
                    className="h-6 px-2"
                  >
                    {copiedStep === 4 ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 font-bold"
            >
              4
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-orange-800 mb-2">
                Test login on this page
              </p>
              <p className="text-sm text-orange-700">
                Once created, you should be able to login with the demo
                credentials.
              </p>
            </div>
          </div>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="w-4 h-4" />
          <AlertDescription className="text-green-800">
            <strong>Alternative:</strong> You can also sign up for new accounts
            using the app's registration form, then update their roles in the
            database.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AuthSetupHelper;
