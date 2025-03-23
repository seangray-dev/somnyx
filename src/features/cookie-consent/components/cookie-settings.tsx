"use client";

import { useEffect, useState } from "react";

import { Loader2Icon } from "lucide-react";
import { usePostHog } from "posthog-js/react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cookieConsentGiven } from "@/utils/cookie-consent-given";
import { toast } from "sonner";

interface EmailPreferences {
  dreamReminders: boolean;
  monthlyInsights: boolean;
  newFeatures: boolean;
}

type PendingChanges = Partial<EmailPreferences>;

export default function CookieSettings() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const posthog = usePostHog();

  const handleAnalyticsToggle = (enabled: boolean) => {
    if (enabled) {
      localStorage.setItem("somnyx_cookie_consent", "yes");
      posthog.opt_in_capturing();
    } else {
      localStorage.setItem("somnyx_cookie_consent", "no");
      posthog.opt_out_capturing();
    }
    toast.success("Your preferences have been updated");
    setAnalyticsEnabled(enabled);
  };

  useEffect(() => {
    setAnalyticsEnabled(cookieConsentGiven() === "yes");
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <Loader2Icon className="animate-spin" />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {/* Essential Features */}
        <div className="flex justify-between gap-4 sm:flex-row">
          <div>
            <Label>Essential Features</Label>
            <p className="text-balance text-sm text-muted-foreground">
              Required for authentication and core functionality
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Switch checked disabled />
          </div>
        </div>

        {/* Analytics */}
        <div className="flex justify-between gap-4 sm:flex-row">
          <div>
            <Label>Analytics</Label>
            <p className="text-balance text-sm text-muted-foreground">
              Help us improve by allowing anonymous usage tracking
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Switch
              checked={analyticsEnabled}
              onCheckedChange={handleAnalyticsToggle}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
