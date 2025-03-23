import NotificationPreferences from "@/features/notifications/components/notification-preferences";
import PushNotificationManager from "@/features/notifications/components/push-notification-manager";

export default function NotificationsSection() {
  return (
    <div className="flex flex-col gap-4 rounded border bg-secondary/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium">Notifications:</div>
        <PushNotificationManager />
      </div>
      <NotificationPreferences />
    </div>
  );
}
