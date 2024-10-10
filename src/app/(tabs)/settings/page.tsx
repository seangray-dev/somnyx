import { ThemeToggle } from "@/components/layout/site-header/theme-toggle";
import Account from "@/components/settings/account";

export default function SettingsPage() {
  return (
    <div className="container flex flex-col gap-6">
      <Account />
      <h1 className="text-2xl font-medium">Settings</h1>
      <div className="flex items-center justify-between">
        <div>Theme:</div>
        <ThemeToggle />
      </div>
    </div>
  );
}
