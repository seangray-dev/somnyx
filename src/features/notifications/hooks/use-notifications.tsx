"use client";

import { useCallback, useEffect, useState } from "react";

import { useSetAtom } from "jotai";

import { env } from "@/config/env/client";
import {
  notificationSubscriptionAtom,
  useGetSubscription,
} from "@/features/store/notifications";
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
  const [isSupported, setIsSupported] = useState(false);
  const [browserSubscription, setBrowserSubscription] =
    useState<PushSubscription | null>(null);
  const { subscription, isLoading } = useGetSubscription();
  const setSubscription = useSetAtom(notificationSubscriptionAtom);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("Notification" in window && "serviceWorker" in navigator);
    }
  }, []);

  useEffect(() => {
    async function getSubscription() {
      try {
        const sw = await navigator.serviceWorker.ready;
        const existingSubscription = await sw.pushManager.getSubscription();
        setBrowserSubscription(existingSubscription);
      } catch (error) {
        console.error("Error getting subscription:", error);
      }
    }

    if (isSupported) {
      getSubscription();
    }
  }, [isSupported]);

  const subscribeToPush = useCallback(async () => {
    try {
      const sw = await navigator.serviceWorker.ready;
      const vapidKey = env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      const newSubscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      setBrowserSubscription(newSubscription);

      // Convert PushSubscription to our schema format
      const subscriptionJSON = newSubscription.toJSON() as PushSubscriptionJSON;
      const result = await subscribeUser({
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

      if (result.success) {
        // The subscription will be updated via Convex's real-time updates
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error subscribing to push:", error);
      return false;
    }
  }, []);

  const unsubscribeFromPush = useCallback(async () => {
    if (!browserSubscription || !subscription) return false;

    try {
      // First unsubscribe from the browser
      await browserSubscription.unsubscribe();

      // Then remove from Convex
      const result = await unsubscribeUser(subscription.subscription.endpoint);

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
  }, [browserSubscription, subscription, setSubscription]);

  const sendTestNotification = useCallback(async () => {
    if (!subscription) return false;

    try {
      await sendNotification("This is a test notification!");
      return true;
    } catch (error) {
      console.error("Error sending test notification:", error);
      return false;
    }
  }, [subscription]);

  return {
    isSupported,
    isLoading,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification,
  };
}
