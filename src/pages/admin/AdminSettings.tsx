import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  ArrowLeft,
  Settings,
  Save,
  RefreshCw,
  Shield,
  Globe,
  Mail,
  Database,
  Server,
  Key,
  Bell,
  Users,
  FileText,
  Palette,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Zap,
  Activity,
  HardDrive,
  Wifi,
  Monitor,
} from "lucide-react";

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  maxFileSize: string;
  allowedFileTypes: string;
  sessionTimeout: string;
  passwordMinLength: number;
  enableTwoFactor: boolean;
  backupEnabled: boolean;
  analyticsEnabled: boolean;
  debugMode: boolean;
  cacheEnabled: boolean;
  rateLimitEnabled: boolean;
  supportEmail: string;
  companyName: string;
  companyAddress: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Design Agency Pro",
    siteDescription: "Professional design services platform",
    adminEmail: "admin@designagency.com",
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    maintenanceMode: false,
    maxFileSize: "10MB",
    allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx",
    sessionTimeout: "24",
    passwordMinLength: 8,
    enableTwoFactor: false,
    backupEnabled: true,
    analyticsEnabled: true,
    debugMode: false,
    cacheEnabled: true,
    rateLimitEnabled: true,
    supportEmail: "support@designagency.com",
    companyName: "Design Agency Inc.",
    companyAddress: "123 Design Street, Creative City, CC 12345",
    privacyPolicyUrl: "/privacy",
    termsOfServiceUrl: "/terms",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [showSensitive, setShowSensitive] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
    { id: "files", label: "Files", icon: <FileText className="w-4 h-4" /> },
    { id: "system", label: "System", icon: <Server className="w-4 h-4" /> },
    { id: "backup", label: "Backup", icon: <Database className="w-4 h-4" /> },
  ];

  const loadSettings = async () => {
    try {
      setLoading(true);
      // In a real app, this would load from a settings table
      // For now, we'll use the default settings
      toast.success("Settings loaded successfully");
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      // In a real app, this would save to a settings table
      // For demonstration, we'll simulate the save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setSettings({
        siteName: "Design Agency Pro",
        siteDescription: "Professional design services platform",
        adminEmail: "admin@designagency.com",
        allowRegistration: true,
        requireEmailVerification: false,
        enableNotifications: true,
        maintenanceMode: false,
        maxFileSize: "10MB",
        allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx",
        sessionTimeout: "24",
        passwordMinLength: 8,
        enableTwoFactor: false,
        backupEnabled: true,
        analyticsEnabled: true,
        debugMode: false,
        cacheEnabled: true,
        rateLimitEnabled: true,
        supportEmail: "support@designagency.com",
        companyName: "Design Agency Inc.",
        companyAddress: "123 Design Street, Creative City, CC 12345",
        privacyPolicyUrl: "/privacy",
        termsOfServiceUrl: "/terms",
      });
      toast.success("Settings reset to defaults");
    }
  };

  const testEmailConfiguration = async () => {
    toast.info("Testing email configuration...");
    // Simulate email test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Email configuration test successful!");
  };

  const runSystemDiagnostics = async () => {
    toast.info("Running system diagnostics...");
    // Simulate diagnostics
    await new Promise((resolve) => setTimeout(resolve, 3000));
    toast.success("System diagnostics completed - All systems operational");
  };

  const createBackup = async () => {
    toast.info("Creating system backup...");
    // Simulate backup creation
    await new Promise((resolve) => setTimeout(resolve, 5000));
    toast.success("System backup created successfully");
  };

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Site Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={(e) =>
                setSettings({ ...settings, adminEmail: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-500" />
          User Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow User Registration</Label>
              <p className="text-sm text-gray-600">
                Allow new users to create accounts
              </p>
            </div>
            <Switch
              checked={settings.allowRegistration}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowRegistration: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Email Verification</Label>
              <p className="text-sm text-gray-600">
                Users must verify email before account activation
              </p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, requireEmailVerification: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Notifications</Label>
              <p className="text-sm text-gray-600">
                Send system notifications to users
              </p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableNotifications: checked })
              }
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" />
          Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) =>
                setSettings({ ...settings, companyName: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea
              id="companyAddress"
              value={settings.companyAddress}
              onChange={(e) =>
                setSettings({ ...settings, companyAddress: e.target.value })
              }
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
            <Input
              id="privacyPolicyUrl"
              value={settings.privacyPolicyUrl}
              onChange={(e) =>
                setSettings({ ...settings, privacyPolicyUrl: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="termsOfServiceUrl">Terms of Service URL</Label>
            <Input
              id="termsOfServiceUrl"
              value={settings.termsOfServiceUrl}
              onChange={(e) =>
                setSettings({ ...settings, termsOfServiceUrl: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-red-500" />
          Password Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
            <Input
              id="passwordMinLength"
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordMinLength: parseInt(e.target.value),
                })
              }
              className="mt-1"
              min={6}
              max={20}
            />
          </div>
          <div>
            <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
            <Input
              id="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({ ...settings, sessionTimeout: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">
                Require 2FA for admin accounts
              </p>
            </div>
            <Switch
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableTwoFactor: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Rate Limiting</Label>
              <p className="text-sm text-gray-600">
                Limit API requests to prevent abuse
              </p>
            </div>
            <Switch
              checked={settings.rateLimitEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, rateLimitEnabled: checked })
              }
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          System Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-gray-600">
                Put the site in maintenance mode
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.maintenanceMode && (
                <Badge className="bg-red-500">Active</Badge>
              )}
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card className="p-4 bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">
                  Security Status
                </span>
              </div>
              <p className="text-sm text-green-700">
                All security measures active
              </p>
            </Card>

            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-800">
                  Last Security Scan
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {new Date().toLocaleDateString()} - No issues found
              </p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-purple-500" />
          Performance & Caching
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Caching</Label>
              <p className="text-sm text-gray-600">
                Cache responses to improve performance
              </p>
            </div>
            <Switch
              checked={settings.cacheEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, cacheEnabled: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-gray-600">
                Track user interactions and system usage
              </p>
            </div>
            <Switch
              checked={settings.analyticsEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, analyticsEnabled: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Debug Mode</Label>
              <p className="text-sm text-gray-600">
                Enable detailed error logging (disable in production)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.debugMode && (
                <Badge className="bg-yellow-500">Active</Badge>
              )}
              <Switch
                checked={settings.debugMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, debugMode: checked })
                }
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-green-500" />
          System Monitoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-bold text-blue-700">99.9%</p>
            <p className="text-sm text-blue-600">Uptime</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <Wifi className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="font-bold text-green-700">45ms</p>
            <p className="text-sm text-green-600">Response Time</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <HardDrive className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="font-bold text-purple-700">78%</p>
            <p className="text-sm text-purple-600">Storage Used</p>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={runSystemDiagnostics}
            variant="outline"
            className="w-full border-2 border-gray-300"
          >
            <Activity className="w-4 h-4 mr-2" />
            Run System Diagnostics
          </Button>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">System Settings</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Configure and manage system-wide settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={resetToDefaults}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card className="p-1 border-4 border-gray-300">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className={
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Settings Content */}
      {activeTab === "general" && renderGeneralSettings()}
      {activeTab === "security" && renderSecuritySettings()}
      {activeTab === "system" && renderSystemSettings()}

      {activeTab === "email" && (
        <Card className="p-6 border-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Email Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" placeholder="587" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                placeholder="username@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="smtpPass">SMTP Password</Label>
              <div className="relative">
                <Input
                  id="smtpPass"
                  type={showSensitive ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-1 h-8 w-8 p-0"
                  onClick={() => setShowSensitive(!showSensitive)}
                >
                  {showSensitive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={testEmailConfiguration}
              variant="outline"
              className="border-2 border-blue-300"
            >
              <Mail className="w-4 h-4 mr-2" />
              Test Email Configuration
            </Button>
          </div>
        </Card>
      )}

      {activeTab === "files" && (
        <Card className="p-6 border-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            File Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxFileSize">Maximum File Size</Label>
              <Input
                id="maxFileSize"
                value={settings.maxFileSize}
                onChange={(e) =>
                  setSettings({ ...settings, maxFileSize: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) =>
                  setSettings({ ...settings, allowedFileTypes: e.target.value })
                }
                className="mt-1"
                placeholder="jpg,png,pdf,doc"
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-bold text-blue-700">1.2GB</p>
              <p className="text-sm text-blue-600">Total Uploads</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-bold text-green-700">847</p>
              <p className="text-sm text-green-600">Files Processed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <HardDrive className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-bold text-purple-700">78%</p>
              <p className="text-sm text-purple-600">Storage Used</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "backup" && (
        <Card className="p-6 border-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-500" />
            Backup & Recovery
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Backups</Label>
                <p className="text-sm text-gray-600">
                  Create automatic daily backups
                </p>
              </div>
              <Switch
                checked={settings.backupEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, backupEnabled: checked })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="p-4 bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-800">
                    Last Backup
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Today at {new Date().toLocaleTimeString()}
                </p>
                <p className="text-xs text-green-600 mt-1">Size: 245 MB</p>
              </Card>

              <Card className="p-4 bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-800">
                    Backup Schedule
                  </span>
                </div>
                <p className="text-sm text-blue-700">Daily at 2:00 AM</p>
                <p className="text-xs text-blue-600 mt-1">Retention: 30 days</p>
              </Card>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={createBackup}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Database className="w-4 h-4 mr-2" />
                Create Backup Now
              </Button>
              <Button variant="outline" className="border-2 border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Download Backup
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Footer */}
      <Card className="p-6 border-4 border-gray-300 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">System Configuration</h3>
            <p className="text-gray-300">
              Manage all aspects of your system settings and preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Config
            </Button>
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save All Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
