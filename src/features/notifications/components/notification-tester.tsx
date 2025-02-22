"use client";

import { useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsAdmin } from "@/features/store/admin";

import { sendNotificationToUser } from "../api/notification-service";
import { NOTIFICATION_TYPES } from "../types/notifications";

export function NotificationTester() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { userId, getToken } = useAuth();
  const { isAdmin } = useIsAdmin();

  if (!isAdmin) {
    return null;
  }

  const handleSendTest = async () => {
    if (!userId || !message.trim()) return;

    try {
      setIsSending(true);
      const token = await getToken({ template: "convex" });

      if (!token) {
        throw new Error("Not authenticated");
      }

      const result = await sendNotificationToUser(
        userId,
        NOTIFICATION_TYPES.DAILY_REMINDER,
        token,
        undefined
      );

      if (result.success) {
        toast.success("Test notification sent successfully");
        setMessage("");
      } else {
        throw new Error(result.error || "Failed to send notification");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error("Error sending test notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <Label htmlFor="test-notification">Test Push Notifications</Label>
        <div className="flex gap-2">
          <Input
            id="test-notification"
            placeholder="Enter test message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            disabled={isSending || !message.trim()}
            onClick={handleSendTest}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
