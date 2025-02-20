import PushNotificationManager from "@/features/notifications/components/push-notification-manager";

export default function NotificationsSection() {
  return (
    <div className="flex items-center justify-between rounded border bg-secondary/10 p-4">
      <div className="font-medium">Notifications:</div>
      <PushNotificationManager />
    </div>
  );
}
