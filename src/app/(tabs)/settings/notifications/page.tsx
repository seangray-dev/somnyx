import { NotificationTester } from "@/features/notifications/components/notification-tester";

export default function NotificationsSettingsPage() {
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-8">Notification Settings</h1>
      <NotificationTester />
      {/* Other notification settings */}
    </div>
  );
} 