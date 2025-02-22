import { useCallback, useEffect } from "react";

import { useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useAtom } from "jotai";

import { api } from "@/convex/_generated/api";
import { timezoneAtom } from "@/features/store/timezone";

export function useTimezone() {
  const { session } = useSession();
  const userId = session?.user.id;
  const [timezoneState, setTimezoneState] = useAtom(timezoneAtom);

  const preferences = useQuery(
    // @ts-ignore
    api.queries.notificationPreferences.getNotificationPreferences,
    { userId }
  );

  const updateTimezone = useMutation(
    // @ts-ignore
    api.mutations.notificationPreferences.updateTimezoneOffset
  );

  const initializeTimezone = useCallback(async () => {
    if (!preferences || timezoneState.initialized || !userId) return;

    try {
      const localTimezoneOffset = new Date().getTimezoneOffset() * -1;

      // Only update if the offset is different
      if (preferences.timezoneOffset !== localTimezoneOffset) {
        await updateTimezone({
          userId,
          timezoneOffset: localTimezoneOffset,
        });
        setTimezoneState({ offset: localTimezoneOffset, initialized: true });
      } else {
        setTimezoneState((prev) => ({ ...prev, initialized: true }));
      }
    } catch (error) {
      console.error("Failed to initialize timezone:", error);
    }
  }, [
    preferences,
    timezoneState.initialized,
    updateTimezone,
    setTimezoneState,
  ]);

  useEffect(() => {
    initializeTimezone();
  }, [initializeTimezone]);

  return {
    ...timezoneState,
    currentServerOffset: preferences?.timezoneOffset,
  };
}
