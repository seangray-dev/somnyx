"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BellOffIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "@/components/ui/icons/bell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useNotifications from "../hooks/use-notifications";

export default function PushNotificationManager() {
  const { isSupported, subscription, subscribeToPush, unsubscribeFromPush } =
    useNotifications();
  const [isToggling, setIsToggling] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!isSupported) {
    return null;
  }

  // Get the actual checked state, preferring optimistic state if it exists
  const isChecked = optimisticState ?? !!subscription;

  const handleSubscriptionToggle = async (checked: boolean) => {
    try {
      setIsToggling(true);
      setOptimisticState(checked);

      if (checked) {
        // Try to get service worker registration first
        const registration = await navigator.serviceWorker.ready;

        try {
          // This will trigger the native permission prompt
          const permission = await registration.pushManager.permissionState({
            userVisibleOnly: true,
          });

          if (permission === "denied") {
            setOptimisticState(false);
            setOpen(false); // Explicitly close dropdown
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

          // Now request notification permission
          const notificationPermission = await Notification.requestPermission();

          if (notificationPermission === "granted") {
            const success = await subscribeToPush();
            if (!success) {
              throw new Error("Failed to subscribe to notifications");
            }
            toast.success("Notifications enabled for this device");
            setOpen(false);
          } else {
            throw new Error("Notification permission denied");
          }
        } catch (error) {
          // Handle permission errors
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
        setOpen(false);
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isToggling}>
                {isChecked ? (
                  <BellIcon />
                ) : (
                  <BellOffIcon className="text-destructive" size={20} />
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {isChecked
              ? "Notifications are enabled"
              : "Notifications are disabled"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <div className="p-2">
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="notifications"
                className="flex flex-col space-y-1"
              >
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-2">
          <p className="py-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </p>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
