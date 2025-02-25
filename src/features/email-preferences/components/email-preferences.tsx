"use client";

import { useState } from "react";

import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import useEmailPreferences from "../hooks/use-email-preferences";

interface EmailPreferences {
  dreamReminders: boolean;
  monthlyInsights: boolean;
  newFeatures: boolean;
}

type PendingChanges = Partial<EmailPreferences>;

export default function EmailPreferences() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  const {
    data: userPreferences,
    isLoading,
    savePreferences,
  } = useEmailPreferences();

  const handleToggle =
    (field: keyof EmailPreferences) => (enabled: boolean) => {
      if (!isEditing) return;
      setPendingChanges((prev) => ({
        ...prev,
        [field]: enabled,
      }));
    };

  const handleEdit = () => {
    // Initialize pending changes with current values or defaults when entering edit mode
    setPendingChanges({
      dreamReminders: userPreferences?.dreamReminders ?? false,
      monthlyInsights: userPreferences?.monthlyInsights ?? false,
      newFeatures: userPreferences?.newFeatures ?? false,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPendingChanges({});
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await savePreferences({
        dreamReminders: pendingChanges.dreamReminders ?? false,
        monthlyInsights: pendingChanges.monthlyInsights ?? false,
        newFeatures: pendingChanges.newFeatures ?? false,
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

  const hasChanges = Object.entries(pendingChanges).some(([key, value]) => {
    const currentValue =
      userPreferences?.[key as keyof EmailPreferences] ?? false;
    return value !== currentValue;
  });

  const getPreferenceValue = (field: keyof EmailPreferences): boolean => {
    if (field in pendingChanges) {
      return pendingChanges[field] ?? false;
    }
    return userPreferences?.[field] ?? false;
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <Loader2Icon className="animate-spin" />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {/* Dream Reminder */}
        <div className="flex justify-between gap-4 sm:flex-row">
          <div>
            <Label>Dream Reminder</Label>
            <p className="text-balance text-sm text-muted-foreground">
              Send me a weekly email if I haven&apos;t logged any dreams over 7
              days.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Switch
              checked={getPreferenceValue("dreamReminders")}
              onCheckedChange={handleToggle("dreamReminders")}
              disabled={!isEditing || isSaving}
            />
          </div>
        </div>

        {/* Monthly Insights Reminder */}
        <div className="flex justify-between gap-4 sm:flex-row">
          <div>
            <Label>Monthly Insights Reminder</Label>
            <p className="text-balance text-sm text-muted-foreground">
              Send me an email when my monthly insights are ready.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Switch
              checked={getPreferenceValue("monthlyInsights")}
              onCheckedChange={handleToggle("monthlyInsights")}
              disabled={!isEditing || isSaving}
            />
          </div>
        </div>

        {/* New Features */}
        <div className="flex justify-between gap-4 sm:flex-row">
          <div>
            <Label>New Features</Label>
            <p className="text-balance text-sm text-muted-foreground">
              Send me emails about new features or updates.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Switch
              checked={getPreferenceValue("newFeatures")}
              onCheckedChange={handleToggle("newFeatures")}
              disabled={!isEditing || isSaving}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving || !isEditing}
          >
            Cancel
          </Button>
          <Button
            className="w-28"
            size="sm"
            onClick={isEditing ? handleSave : handleEdit}
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
