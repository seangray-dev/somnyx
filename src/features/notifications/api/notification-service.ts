import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

import { sendNotification } from "./actions";

export async function sendNotificationToUser(
  userId: string,
  message: string,
  token: string
) {
  try {
    // Get all active devices for the user
    const devices = await fetchQuery(
      // @ts-ignore
      api.queries.notifications.getUserDevices,
      { userId },
      { token }
    );

    if (!devices || devices.length === 0) {
      console.log("No devices found for user:", userId);
      return { success: false, error: "No devices found" };
    }

    // Send notification to each device
    const results = await Promise.allSettled(
      devices.map((device) => sendNotification(device.deviceId, message))
    );

    // Check if any notifications were successful
    const anySuccess = results.some(
      (result) => result.status === "fulfilled" && result.value.success
    );

    return {
      success: anySuccess,
      error: anySuccess ? null : "Failed to send notifications to all devices",
    };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, error: String(error) };
  }
}
