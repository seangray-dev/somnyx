import type {
  AnalyticsEvent,
  DreamInterpreterEventProperties,
} from "../types/events";

export const DREAM_INTERPRETER_EVENTS = {
  STARTED: "[DREAM INTERPRETER] - STARTED",
  COMPLETED: "[DREAM INTERPRETER] - COMPLETED",
  ANALYSIS_VIEWED: "[DREAM INTERPRETER] - ANALYSIS VIEWED",
  CHARACTER_LIMIT_EXCEEDED: "[DREAM INTERPRETER] - CHARACTER LIMIT EXCEEDED",
} as const;

export function createDreamInterpreterEvent(
  name: keyof typeof DREAM_INTERPRETER_EVENTS,
  properties: Omit<
    DreamInterpreterEventProperties,
    keyof DreamInterpreterEventProperties
  >
): AnalyticsEvent<DreamInterpreterEventProperties> {
  return {
    name: DREAM_INTERPRETER_EVENTS[name],
    properties: properties as DreamInterpreterEventProperties,
  };
}
