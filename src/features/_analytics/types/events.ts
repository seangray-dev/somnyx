export type EventName =
  | "[DREAM INTERPRETER] - STARTED"
  | "[DREAM INTERPRETER] - COMPLETED"
  | "[DREAM INTERPRETER] - ANALYSIS VIEWED"
  | "[DREAM INTERPRETER] - CHARACTER LIMIT EXCEEDED"
  | "[DREAM] - SAVED"
  | "[DREAM] - ANALYZED"
  | "[DREAM] - FORM OPENED"
  | "[DREAM] - SHARED-OWN"
  | "[DREAM] - SHARED-OTHER"
  | "[CREDITS] - PACKAGE SELECTED"
  | "[CREDITS] - PURCHASE SUCCESS"
  | "[CREDITS] - PURCHASE CANCELLED"
  | "[CREDITS] - PURCHASE ERROR";

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
  shareMethod?: "copy" | "native";
  platform?: "X" | "Reddit" | "Facebook" | "none";
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

export interface CreditEventProperties extends BaseEventProperties {
  packageId?: string;
  packageName?: string;
  creditAmount?: number;
  price?: string;
  stripeSessionId?: string;
  error?: string;
}

export type EventProperties =
  | BaseEventProperties
  | DreamEventProperties
  | DreamInterpreterEventProperties
  | AuthEventProperties
  | CreditEventProperties;

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
