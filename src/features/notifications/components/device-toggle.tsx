"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import useNotifications from "../hooks/use-notifications";

interface DeviceToggleProps {
  className?: string;
}

export function DeviceToggle({ className }: DeviceToggleProps) {
  const { isSupported, subscription, subscribeToPush, unsubscribeFromPush } =
    useNotifications();
  const [isToggling, setIsToggling] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  const router = useRouter();

  if (!isSupported) return null;

  const isChecked = optimisticState ?? !!subscription;

  const handleSubscriptionToggle = async (checked: boolean) => {
    try {
      setIsToggling(true);
      setOptimisticState(checked);

      if (checked) {
        const registration = await navigator.serviceWorker.ready;

        try {
          const permission = await registration.pushManager.permissionState({
            userVisibleOnly: true,
          });

          if (permission === "denied") {
            setOptimisticState(false);
            toast.error(
              "Notifications are blocked. Please enable them in your browser or device settings.",
              {
                action: {
                  label: "Learn More",
                  onClick: () => {
                    router.push("/install-guide");
                    toast.dismiss();
                  },
                },
              }
            );
            return;
          }

          const notificationPermission = await Notification.requestPermission();

          if (notificationPermission === "granted") {
            const success = await subscribeToPush();
            if (!success) {
              throw new Error("Failed to subscribe to notifications");
            }
            toast.success("Notifications enabled for this device");
          } else {
            throw new Error("Notification permission denied");
          }
        } catch (error) {
          setOptimisticState(false);
          if (error instanceof Error) {
            toast.error(error.message);
          }
          return;
        }
      } else {
        const success = await unsubscribeFromPush();
        if (!success) {
          throw new Error("Failed to unsubscribe from notifications");
        }
        toast.success("Notifications disabled for this device");
      }
    } catch (error) {
      setOptimisticState(null);
      console.error("Toggle error:", error);
      toast.error(
        "Error: Unable to toggle notifications for this device. Please try again or contact us for support"
      );
    } finally {
      setIsToggling(false);
      setOptimisticState(null);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="notifications" className="flex flex-col space-y-1">
          <span className="">Push Notifications</span>
          <span className="text-xs text-muted-foreground">
            {isChecked
              ? "You are subscribed to push notifications on this device."
              : "You are not subscribed to push notifications on this device."}
          </span>
        </Label>
        <Switch
          id="notifications"
          checked={isChecked}
          disabled={isToggling}
          onCheckedChange={handleSubscriptionToggle}
        />
      </div>
    </div>
  );
}
