import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockSystemSettings } from "@/lib/admin-data";
import {
  Settings,
  Building,
  CreditCard,
  Mail,
  BarChart3,
  Shield,
  Save,
  RefreshCw,
  Database,
} from "lucide-react";

const AdminSettings: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            SYSTEM SETTINGS
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Configure system preferences and integrations
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to reset all settings to default?",
                )
              ) {
                console.log("Resetting settings to default");
                window.location.reload();
              }
            }}
            variant="outline"
            className="border-4 border-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={() => {
              console.log("Saving system settings...");
              // Add save settings logic here
              const notification = document.createElement("div");
              notification.className =
                "fixed bottom-4 right-4 bg-green-500 text-white p-4 border-4 border-black z-50";
              notification.textContent = "Settings saved successfully!";
              document.body.appendChild(notification);
              setTimeout(() => document.body.removeChild(notification), 3000);
            }}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Information */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">
                Company Information
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-sm font-bold text-black">
                Company Name
              </Label>
              <Input
                defaultValue={mockSystemSettings.company.name}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">Email</Label>
              <Input
                defaultValue={mockSystemSettings.company.email}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">Phone</Label>
              <Input
                defaultValue={mockSystemSettings.company.phone}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">Website</Label>
              <Input
                defaultValue={mockSystemSettings.company.website}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
          </div>
        </Card>

        {/* Business Settings */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">
                Business Settings
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-sm font-bold text-black">Currency</Label>
              <select className="w-full p-3 border-4 border-black bg-festival-cream">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-bold text-black">
                Tax Rate (%)
              </Label>
              <Input
                type="number"
                defaultValue={mockSystemSettings.business.taxRate * 100}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">Timezone</Label>
              <select className="w-full p-3 border-4 border-black bg-festival-cream">
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </Card>

        {/* PayPal Integration */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">
                PayPal Integration
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                defaultChecked={mockSystemSettings.integrations.paypal.enabled}
                className="w-5 h-5 border-4 border-black"
              />
              <Label className="text-sm font-bold text-black">
                Enable PayPal
              </Label>
            </div>
            <div>
              <Label className="text-sm font-bold text-black">Client ID</Label>
              <Input
                defaultValue={mockSystemSettings.integrations.paypal.clientId}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">
                Webhook URL
              </Label>
              <Input
                defaultValue={mockSystemSettings.integrations.paypal.webhookUrl}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
          </div>
        </Card>

        {/* Email Settings */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-blue-400 to-blue-500">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">
                Email Configuration
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-sm font-bold text-black">SMTP Host</Label>
              <Input
                defaultValue={mockSystemSettings.integrations.email.smtpHost}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">SMTP Port</Label>
              <Input
                type="number"
                defaultValue={mockSystemSettings.integrations.email.smtpPort}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">Username</Label>
              <Input
                defaultValue={mockSystemSettings.integrations.email.username}
                className="border-4 border-black bg-festival-cream"
              />
            </div>
          </div>
        </Card>

        {/* Analytics */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-purple-400 to-purple-500">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">Analytics</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-sm font-bold text-black">
                Google Analytics
              </Label>
              <Input
                defaultValue={
                  mockSystemSettings.integrations.analytics.googleAnalytics
                }
                className="border-4 border-black bg-festival-cream"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-black">Mixpanel</Label>
              <Input
                defaultValue={
                  mockSystemSettings.integrations.analytics.mixpanel
                }
                className="border-4 border-black bg-festival-cream"
              />
            </div>
          </div>
        </Card>

        {/* System Features */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-green-400 to-green-500">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">System Features</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={!mockSystemSettings.features.maintenanceMode}
                className="w-5 h-5 border-4 border-black"
              />
              <Label className="text-sm font-bold text-black">
                Site Online
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={mockSystemSettings.features.registrationEnabled}
                className="w-5 h-5 border-4 border-black"
              />
              <Label className="text-sm font-bold text-black">
                Allow Registration
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={mockSystemSettings.features.chatEnabled}
                className="w-5 h-5 border-4 border-black"
              />
              <Label className="text-sm font-bold text-black">
                Enable Chat
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={
                  mockSystemSettings.features.notificationsEnabled
                }
                className="w-5 h-5 border-4 border-black"
              />
              <Label className="text-sm font-bold text-black">
                Push Notifications
              </Label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
