export type EventName =
  | "[DREAM INTERPRETER] - STARTED"
  | "[DREAM INTERPRETER] - COMPLETED"
  | "[DREAM INTERPRETER] - ANALYSIS VIEWED"
  | "[DREAM INTERPRETER] - CHARACTER_LIMIT_EXCEEDED"
  | "[DREAM] - SAVED"
  | "[DREAM] - ANALYZED"
  | "[DREAM] - FORM_OPENED";

export interface BaseEventProperties {
  deviceType: "mobile" | "tablet" | "desktop";
  isPwa: boolean;
  url?: string;
  path?: string;
}

export interface DreamEventProperties extends BaseEventProperties {
  dreamLength?: number;
  isLucid?: boolean;
  isRecurring?: boolean;
  emotionCount?: number;
}

export interface DreamInterpreterEventProperties extends BaseEventProperties {
  dreamLength?: number;
}

export interface AuthEventProperties extends BaseEventProperties {
  source?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export type EventProperties =
  | BaseEventProperties
  | DreamEventProperties
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
