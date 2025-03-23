import { createContext, useCallback, useContext } from "react";

import type { AnalyticsEvent, AnalyticsInstance } from "../types/events";
import { getDeviceProperties } from "../utils/device";

interface AnalyticsContextValue {
  instance: AnalyticsInstance | null;
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  instance: null,
});

export const useAnalyticsContext = () => useContext(AnalyticsContext);

export function useAnalytics() {
  const { instance } = useAnalyticsContext();

  const track = useCallback(
    async (
      event: Omit<AnalyticsEvent, "properties"> & {
        properties?: Partial<AnalyticsEvent["properties"]>;
      }
    ) => {
      if (!instance) return;

      const enhancedEvent = {
        ...event,
        properties: {
          ...getDeviceProperties(),
          ...event.properties,
        },
      };

      return instance.track(enhancedEvent as AnalyticsEvent);
    },
    [instance]
  );

  const identify = useCallback(
    (userId: string, traits?: Record<string, any>) => {
      if (!instance) return;
      instance.identify(userId, traits);
    },
    [instance]
  );

  const reset = useCallback(() => {
    if (!instance) return;
    instance.reset();
  }, [instance]);

  return {
    track,
    identify,
    reset,
    isInitialized: !!instance,
  };
}

export { AnalyticsContext };
