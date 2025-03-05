import type { AnalyticsEvent, CreditEventProperties } from "../types/events";
import { getDeviceProperties } from "../utils/device";

export const CREDIT_EVENTS = {
  "PACKAGE-SELECTED": "[CREDITS] - PACKAGE SELECTED",
  "PURCHASE-SUCCESS": "[CREDITS] - PURCHASE SUCCESS",
  "PURCHASE-CANCELLED": "[CREDITS] - PURCHASE CANCELLED",
  "PURCHASE-ERROR": "[CREDITS] - PURCHASE ERROR",
} as const;

export function createCreditEvent(
  name: keyof typeof CREDIT_EVENTS,
  properties: Partial<CreditEventProperties>
): AnalyticsEvent<CreditEventProperties> {
  return {
    name: CREDIT_EVENTS[name],
    properties: {
      ...getDeviceProperties(),
      ...properties,
    },
  };
}
