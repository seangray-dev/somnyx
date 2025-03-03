export type EventName =
  | "[DREAM INTERPRETER] - STARTED"
  | "[DREAM INTERPRETER] - COMPLETED"
  | "[DREAM INTERPRETER] - SIGNUP CLICKED"
  | "[DREAM INTERPRETER] - ANALYSIS VIEWED"
  | "[AUTH] - SIGNUP VIEWED"
  | "[AUTH] - SIGNUP COMPLETED";

export interface BaseEventProperties {
  deviceType: "mobile" | "tablet" | "desktop";
  isPwa: boolean;
  url?: string;
  path?: string;
}

export interface DreamInterpreterEventProperties extends BaseEventProperties {
  sessionId: string;
  dreamLength?: number;
  analysisType?: "free" | "premium";
}

export interface AuthEventProperties extends BaseEventProperties {
  source?: string;
  dreamInterpreterSessionId?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  metadata?: {
    signUpSource?: string;
    dreamInterpreterSessionId?: string;
  };
}

export type EventProperties =
  | BaseEventProperties
  | DreamInterpreterEventProperties
  | AuthEventProperties;

export interface AnalyticsEvent<
  T extends EventProperties = BaseEventProperties,
> {
  name: EventName;
  properties: T;
}

export interface AnalyticsInstance {
  track: (event: AnalyticsEvent) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  reset: () => void;
}
