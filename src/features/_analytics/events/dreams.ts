import type { AnalyticsEvent, DreamEventProperties } from "../types/events";
import { getDeviceProperties } from "../utils/device";

export const DREAM_EVENTS = {
  SAVED: "[DREAM] - SAVED",
  ANALYZED: "[DREAM] - ANALYZED",
  FORM_OPENED: "[DREAM] - FORM_OPENED",
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
