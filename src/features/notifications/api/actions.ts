"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import webpush, { PushSubscription as WebPushSubscription } from "web-push";

import { env as clientEnv } from "@/config/env/client";
import { env as serverEnv } from "@/config/env/server";
import { api } from "@/convex/_generated/api";

type NotificationSubscription = {
  endpoint: string;
  expirationTime?: number;
  keys: {
    p256dh: string;
    auth: string;
  };
  options?: {
    applicationServerKey?: string;
    userVisibleOnly?: boolean;
  };
};

webpush.setVapidDetails(
  "mailto:myuserid@email.com",
  clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  serverEnv.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(sub: {
  deviceId: string;
  deviceName: string;
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
  options?: {
    applicationServerKey?: string;
    userVisibleOnly?: boolean;
  };
}) {
  try {
    // Get the auth token
    const { getToken } = auth();
    const token = await getToken({ template: "convex" });

    if (!token) {
      throw new Error("User must be logged in to subscribe to notifications");
    }

    // Store subscription in Convex
    const subscription: NotificationSubscription = {
      endpoint: sub.endpoint,
      expirationTime: sub.expirationTime || undefined,
      keys: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
      options: sub.options,
    };

    const result = await fetchMutation(
      // @ts-ignore
      api.mutations.notifications.subscribe,
      {
        deviceId: sub.deviceId,
        deviceName: sub.deviceName,
        subscription,
      },
      { token }
    );

    return { success: true };
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return { success: false, error: String(error) };
  }
}

export async function unsubscribeUser(deviceId: string) {
  try {
    // Get the auth token
    const { getToken } = auth();
    const token = await getToken({ template: "convex" });

    if (!token) {
      throw new Error(
        "User must be logged in to unsubscribe from notifications"
      );
    }

    // Remove subscription from Convex
    await fetchMutation(
      api.mutations.notifications.unsubscribe,
      { deviceId },
      { token }
    );
    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing from notifications:", error);
    return {
      success: false,
      error: "Failed to unsubscribe from notifications",
    };
  }
}

export async function sendNotification(
  userId: string,
  message: string | object
) {
  try {
    console.log("Fetching devices for user:", userId);
    const devices = await fetchQuery(api.queries.notifications.getUserDevices, {
      userId,
    });

    console.log("Found devices:", devices);
    if (!devices || devices.length === 0) {
      console.warn("No devices found for user", userId);
      return { success: false, error: "No devices found" };
    }

    const results = await Promise.allSettled(
      devices.map(async (device) => {
        try {
          // Use the subscription directly from the device object
          if (!device.subscription) {
            console.warn(
              "No valid subscription found for device:",
              device.deviceId
            );
            return {
              success: false,
              deviceId: device.deviceId,
              error: "No valid subscription",
            };
          }

          // Format notification payload
          const payload =
            typeof message === "string"
              ? { title: "Somnyx", body: message }
              : message;

          console.log(
            "Sending notification to device:",
            device.deviceId,
            payload
          );

          // Send the notification
          await webpush.sendNotification(
            device.subscription as unknown as WebPushSubscription,
            JSON.stringify(payload)
          );

          console.log(
            "Successfully sent notification to device:",
            device.deviceId
          );
          return { success: true, deviceId: device.deviceId };
        } catch (error) {
          console.error("Failed to send to device:", device.deviceId, error);
          return {
            success: false,
            deviceId: device.deviceId,
            error: String(error),
          };
        }
      })
    );

    const successfulDevices = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    console.log("Notification results:", results);

    return {
      success: successfulDevices > 0,
      error:
        successfulDevices === 0 ? "Failed to send to any devices" : undefined,
      results,
    };
  } catch (error) {
    console.error("Error in sendNotification:", error);
    return { success: false, error: String(error) };
  }
}
