import Account from "@/components/settings/account";
import DeleteActions from "@/components/settings/delete-actions";
import ThemeSection from "@/components/settings/theme-section";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Account />
      <h1 className="container text-2xl font-bold sm:text-3xl">Settings</h1>
      <div className="container space-y-6">
        <ThemeSection />
        <DeleteActions />
      </div>
    </div>
  );
}
