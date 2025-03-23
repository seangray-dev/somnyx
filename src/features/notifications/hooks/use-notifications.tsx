"use client";

import { useCallback, useEffect, useState } from "react";

import { useSetAtom } from "jotai";

import { env } from "@/config/env/client";
import {
  notificationSubscriptionAtom,
  useGetSubscription,
} from "@/features/store/notifications";
import { generateDeviceId, getDeviceInfo } from "@/utils/device-info";
import { urlBase64ToUint8Array } from "@/utils/notifications";

import {
  sendNotification,
  subscribeUser,
  unsubscribeUser,
} from "../api/actions";

// Type to match our Convex schema
type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  options?: {
    applicationServerKey?: string;
    userVisibleOnly?: boolean;
  };
};

export default function useNotifications() {
  const [deviceId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("deviceId") || generateDeviceId();
    }
    return "";
  });

  const { subscription, isLoading } = useGetSubscription(deviceId);
  const setSubscription = useSetAtom(notificationSubscriptionAtom);
  const [isSupported, setIsSupported] = useState(false);
  const [browserSubscription, setBrowserSubscription] =
    useState<PushSubscription | null>(null);

  useEffect(() => {
    if (deviceId) {
      localStorage.setItem("deviceId", deviceId);
    }

    console.log("Device ID:", deviceId);
  }, [deviceId]);

  // Check if notifications are supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("serviceWorker" in navigator && "PushManager" in window);
    }
  }, []);

  // Register service worker and get existing subscription
  useEffect(() => {
    async function registerAndGetSubscription() {
      try {
        // Register service worker first
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        // Get existing subscription
        const existingSubscription =
          await registration.pushManager.getSubscription();
        setBrowserSubscription(existingSubscription);
      } catch (error) {
        console.error("Error registering service worker:", error);
      }
    }

    if (isSupported) {
      registerAndGetSubscription();
    }
  }, [isSupported]);

  const subscribeToPush = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      const vapidKey = env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      setBrowserSubscription(newSubscription);

      const subscriptionJSON = newSubscription.toJSON() as PushSubscriptionJSON;
      const { browser, os } = getDeviceInfo();

      const result = await subscribeUser({
        deviceId: deviceId,
        deviceName: `${browser} on ${os}`,
        endpoint: subscriptionJSON.endpoint,
        expirationTime: subscriptionJSON.expirationTime,
        keys: {
          p256dh: subscriptionJSON.keys.p256dh,
          auth: subscriptionJSON.keys.auth,
        },
        options: {
          userVisibleOnly: true,
          applicationServerKey: vapidKey,
        },
      });

      return result.success;
    } catch (error) {
      console.error("Error subscribing to push:", error);
      return false;
    }
  }, [deviceId]);

  const unsubscribeFromPush = useCallback(async () => {
    if (!browserSubscription || !subscription) return false;

    try {
      // First unsubscribe from the browser
      await browserSubscription.unsubscribe();

      // Then remove from Convex
      const result = await unsubscribeUser(deviceId);

      if (result.success) {
        setBrowserSubscription(null);
        setSubscription(null); // Immediately update UI state
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error unsubscribing from push:", error);
      return false;
    }
  }, [browserSubscription, subscription, setSubscription, deviceId]);

  const sendTestNotification = useCallback(async () => {
    if (!subscription) return false;

    try {
      await sendNotification(deviceId, "This is a test notification!");
      return true;
    } catch (error) {
      console.error("Error sending test notification:", error);
      return false;
    }
  }, [subscription, deviceId]);

  return {
    isSupported,
    isLoading,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification,
  };
}
