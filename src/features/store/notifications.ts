import { useQuery } from "convex/react";
import { atom, useAtom } from "jotai";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

// Create an atom for the subscription state
export const notificationSubscriptionAtom = atom<Doc<"notifications"> | null>(
  null
);

export function useGetSubscription() {
  const [subscription, setSubscription] = useAtom(notificationSubscriptionAtom);
  const convexSubscription = useQuery(
    api.queries.notifications.getSubscription
  );

  // Update the atom when Convex data changes
  if (convexSubscription !== subscription) {
    setSubscription(convexSubscription ?? null);
  }

  return {
    subscription,
    isLoading: convexSubscription === undefined,
  };
}
