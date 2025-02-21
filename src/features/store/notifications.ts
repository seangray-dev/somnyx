import { useQuery } from "convex/react";
import { atom } from "jotai";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export const notificationSubscriptionAtom = atom<Doc<"notifications"> | null>(
  null
);

export function useGetSubscription(deviceId: string) {
  const subscription = useQuery(api.queries.notifications.getSubscription, {
    deviceId,
  });

  return {
    subscription: subscription ?? null,
    isLoading: subscription === undefined,
  };
}
