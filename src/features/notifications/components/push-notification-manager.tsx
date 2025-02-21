"use client";

import { BellOffIcon } from "lucide-react";

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

  if (!isSupported) {
    return null;
  }

  const handleSubscriptionToggle = async (checked: boolean) => {
    let success = false;

    try {
      if (checked) {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          success = await subscribeToPush();
        }
      } else {
        success = await unsubscribeFromPush();
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }

    if (!success) {
      const switchElement = document.getElementById(
        "notifications"
      ) as HTMLInputElement;
      if (switchElement) {
        switchElement.checked = !checked;
      }
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {subscription ? (
                  <BellIcon />
                ) : (
                  <BellOffIcon className="text-destructive" size={20} />
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {subscription
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
                  {subscription
                    ? "You are subscribed to push notifications."
                    : "You are not subscribed to push notifications."}
                </span>
              </Label>
              <Switch
                id="notifications"
                checked={!!subscription}
                onCheckedChange={handleSubscriptionToggle}
              />
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-2">
          {/* Placeholder for future notification items */}
          <p className="py-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </p>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
