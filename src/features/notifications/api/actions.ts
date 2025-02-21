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

export async function sendNotification(deviceId: string, message: string) {
  try {
    // Get the auth token
    const { getToken } = auth();
    const token = await getToken({ template: "convex" });

    if (!token) {
      throw new Error("User must be logged in to send notifications");
    }

    // Get subscription from Convex
    const subscription = await fetchQuery(
      api.queries.notifications.getSubscription,
      { deviceId },
      { token }
    );

    if (!subscription) {
      throw new Error("No subscription available");
    }

    // Format notification payload
    const payload = {
      title: "Somnyx",
      body: message,
      icon: "/favicon.ico",
      timestamp: Date.now(),
    };

    // Send the notification
    await webpush.sendNotification(
      subscription.subscription as unknown as WebPushSubscription,
      JSON.stringify(payload)
    );

    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
