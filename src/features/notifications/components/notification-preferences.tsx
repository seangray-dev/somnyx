"use client";

import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CircleHelpIcon } from "@/components/ui/icons/circle-help";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimePicker12H } from "@/components/ui/time-picker-12h";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dynamicTimezoneAtom } from "@/features/store/timezone";

import useNotificationPreferences from "../hooks/use-notification-preferences";
import { NOTIFICATION_TYPES, NotificationType } from "../types/notifications";

interface PendingChanges {
  dailyReminderTime?: number;
  enabledTypes?: NotificationType[];
}

export default function NotificationPreferences() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});
  const [timezone, updateTimezone] = useAtom(dynamicTimezoneAtom);

  const {
    data: userPreferences,
    isLoading,
    savePreferences,
  } = useNotificationPreferences();

  // Update timezone offset when component mounts and when daylight savings changes
  useEffect(() => {
    updateTimezone();

    // Check for timezone changes every hour
    const interval = setInterval(
      () => {
        updateTimezone();
      },
      60 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [updateTimezone]);

  const getReminderTimeAsDate = () => {
    // Use pending changes first, fall back to user preferences
    const reminderTimeMs =
      pendingChanges.dailyReminderTime ?? userPreferences?.dailyReminderTime;

    if (!reminderTimeMs) {
      // Default to 7:00 AM
      return new Date(new Date().setHours(7, 0, 0, 0));
    }

    // Create a new date object set to midnight
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    // Add the milliseconds to get the reminder time
    date.setMilliseconds(reminderTimeMs);

    return date;
  };

  const handleTimeChange = (newDate: Date | undefined) => {
    if (!newDate || !isEditing) return;

    // Convert the time back to milliseconds since midnight
    const milliseconds =
      newDate.getHours() * 60 * 60 * 1000 + newDate.getMinutes() * 60 * 1000;

    setPendingChanges((prev) => ({
      ...prev,
      dailyReminderTime: milliseconds,
      enabledTypes: (prev.enabledTypes ??
        userPreferences?.enabledTypes ??
        []) as NotificationType[],
    }));
  };

  const handleDailyReminderToggle = (enabled: boolean) => {
    if (!isEditing || !userPreferences) return;

    const currentTypes =
      pendingChanges.enabledTypes ?? userPreferences.enabledTypes;
    const updatedTypes = enabled
      ? [...currentTypes, NOTIFICATION_TYPES.DAILY_REMINDER]
      : currentTypes.filter(
          (type) => type !== NOTIFICATION_TYPES.DAILY_REMINDER
        );

    setPendingChanges((prev) => ({
      ...prev,
      enabledTypes: updatedTypes as NotificationType[],
    }));
  };

  const handleInactivityReminderToggle = (enabled: boolean) => {
    if (!isEditing || !userPreferences) return;

    const currentTypes =
      pendingChanges.enabledTypes ?? userPreferences.enabledTypes;
    const updatedTypes = enabled
      ? [...currentTypes, NOTIFICATION_TYPES.INACTIVITY_REMINDER]
      : currentTypes.filter(
          (type) => type !== NOTIFICATION_TYPES.INACTIVITY_REMINDER
        );

    setPendingChanges((prev) => ({
      ...prev,
      enabledTypes: updatedTypes as NotificationType[],
    }));
  };

  const handleMonthlyInsightsToggle = (enabled: boolean) => {
    if (!isEditing || !userPreferences) return;

    const currentTypes =
      pendingChanges.enabledTypes ?? userPreferences.enabledTypes;
    const updatedTypes = enabled
      ? [...currentTypes, NOTIFICATION_TYPES.MONTHLY_INSIGHTS]
      : currentTypes.filter(
          (type) => type !== NOTIFICATION_TYPES.MONTHLY_INSIGHTS
        );

    setPendingChanges((prev) => ({
      ...prev,
      enabledTypes: updatedTypes as NotificationType[],
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPendingChanges({});
  };

  const handleSave = async () => {
    if (!userPreferences || !pendingChanges) return;

    try {
      setIsSaving(true);
      await savePreferences({
        dailyReminderTime:
          pendingChanges.dailyReminderTime ?? userPreferences.dailyReminderTime,
        enabledTypes:
          pendingChanges.enabledTypes ?? userPreferences.enabledTypes,
        timezoneOffset: timezone.offset,
      });

      toast.success("Preferences updated successfully");
      setIsEditing(false);
      setPendingChanges({});
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;
  const isDailyReminderEnabled = pendingChanges.enabledTypes
    ? pendingChanges.enabledTypes.includes(NOTIFICATION_TYPES.DAILY_REMINDER)
    : userPreferences?.enabledTypes.includes(NOTIFICATION_TYPES.DAILY_REMINDER);

  const isInactivityReminderEnabled = pendingChanges.enabledTypes
    ? pendingChanges.enabledTypes.includes(
        NOTIFICATION_TYPES.INACTIVITY_REMINDER
      )
    : userPreferences?.enabledTypes.includes(
        NOTIFICATION_TYPES.INACTIVITY_REMINDER
      );

  const isMonthlyInsightsEnabled = pendingChanges.enabledTypes
    ? pendingChanges.enabledTypes.includes(NOTIFICATION_TYPES.MONTHLY_INSIGHTS)
    : userPreferences?.enabledTypes.includes(
        NOTIFICATION_TYPES.MONTHLY_INSIGHTS
      );

  return (
    <div className="flex flex-col gap-6">
      <div>
        {isLoading ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <Loader2Icon className="animate-spin" />
            <div>Loading...</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Daily Reminder */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-2">
                  <Label>Daily Reminder</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleHelpIcon className="text-muted-foreground transition-colors duration-150 hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">
                          Notifications are sent within ~15 minutes of your
                          selected time to ensure reliable delivery.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-balance text-sm text-muted-foreground">
                  Send me a daily reminder to record my dreams.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <TimePicker12H
                  date={getReminderTimeAsDate()}
                  setDate={handleTimeChange}
                  disabled={!isEditing || isSaving}
                />
                <Switch
                  checked={isDailyReminderEnabled}
                  onCheckedChange={handleDailyReminderToggle}
                  disabled={!isEditing || isSaving}
                />
              </div>
            </div>
            {/* Monthly Insights Reminder */}
            <div className="flex justify-between gap-4 sm:flex-row">
              <div>
                <Label>Monthly Insights Reminder</Label>
                <p className="text-balance text-sm text-muted-foreground">
                  Send me notifications when my monthly insights are ready.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Switch
                  checked={isMonthlyInsightsEnabled}
                  onCheckedChange={handleMonthlyInsightsToggle}
                  disabled={!isEditing || isSaving}
                />
              </div>
            </div>
            {/* Inactivity Reminder */}
            <div className="flex justify-between gap-4 sm:flex-row">
              <div>
                <Label>Inactivity Reminder</Label>
                <p className="text-balance text-sm text-muted-foreground">
                  Send me notifications when I haven&apos;t signed in the last 7
                  days.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Switch
                  checked={isInactivityReminderEnabled}
                  onCheckedChange={handleInactivityReminderToggle}
                  disabled={!isEditing || isSaving}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size={"sm"}
            onClick={handleCancel}
            disabled={isSaving || !isEditing}
          >
            Cancel
          </Button>
          <Button
            className="w-28"
            size={"sm"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving || (isEditing && !hasChanges)}
          >
            {!isEditing ? (
              "Edit"
            ) : (
              <>
                {isSaving ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
