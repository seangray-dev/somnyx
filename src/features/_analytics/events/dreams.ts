import type { AnalyticsEvent, DreamEventProperties } from "../types/events";
import { getDeviceProperties } from "../utils/device";

export const DREAM_EVENTS = {
  SAVED: "[DREAM] - SAVED",
  ANALYZED: "[DREAM] - ANALYZED",
  FORM_OPENED: "[DREAM] - FORM OPENED",
  "SHARED-OWN": "[DREAM] - SHARED-OWN",
  "SHARED-OTHER": "[DREAM] - SHARED-OTHER",
} as const;

export function createDreamEvent(
  name: keyof typeof DREAM_EVENTS,
  properties: Partial<DreamEventProperties>
): AnalyticsEvent<DreamEventProperties> {
  return {
    name: DREAM_EVENTS[name],
    properties: {
      ...getDeviceProperties(),
      ...properties,
    },
  };
}
