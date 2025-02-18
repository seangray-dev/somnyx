import { useEffect, useState } from "react";

import { env } from "@/config/env/client";
import { urlBase64ToUint8Array } from "@/utils/notifications";

import {
  sendNotification,
  subscribeUser,
  unsubscribeUser,
} from "../api/actions";

export default function UseNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendPushNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  return {
    isSupported,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
    sendPushNotification,
    message,
    setMessage,
  };
}
