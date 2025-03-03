import type { AnalyticsEvent, AuthEventProperties } from "../types/events";

export const AUTH_EVENTS = {
  SIGNUP_VIEWED: "[AUTH] - SIGNUP VIEWED",
  SIGNUP_COMPLETED: "[AUTH] - SIGNUP COMPLETED",
} as const;

export function createAuthEvent(
  name: keyof typeof AUTH_EVENTS,
  properties?: Partial<AuthEventProperties>
): AnalyticsEvent<AuthEventProperties> {
  return {
    name: AUTH_EVENTS[name],
    properties: properties as AuthEventProperties,
  };
}
