"use client";

import CookieSettings from "./cookie-settings";

export default function CookieSettingsSection() {
  return (
    <div className="flex flex-col gap-4 rounded border bg-secondary/10 p-4">
      <div>
        <div className="font-medium">Privacy & Cookies:</div>
        <p className="text-sm text-muted-foreground">
          Manage tracking preferences for this device
        </p>
      </div>
      <CookieSettings />
    </div>
  );
}
