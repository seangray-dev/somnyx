export const NOTIFICATION_TYPES = {
  ANALYSIS_COMPLETE: "ANALYSIS_COMPLETE",
  MONTHLY_INSIGHTS: "MONTHLY_INSIGHTS",
  DAILY_REMINDER: "DAILY_REMINDER",
  LOW_CREDITS: "LOW_CREDITS",
  INACTIVITY_REMINDER: "INACTIVITY_REMINDER",
  APP_UPDATE: "APP_UPDATE",
  STREAK_MILESTONE: "STREAK_MILESTONE",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type NotificationDataMap = {
  [NOTIFICATION_TYPES.ANALYSIS_COMPLETE]: {
    dreamId: string;
    dreamTitle: string;
  };
  [NOTIFICATION_TYPES.MONTHLY_INSIGHTS]: {
    month: string;
    year: number;
    monthYear: string;
  };
  [NOTIFICATION_TYPES.DAILY_REMINDER]: undefined;
  [NOTIFICATION_TYPES.LOW_CREDITS]: {
    credits: number;
    lastPurchaseDate?: string;
  };
  [NOTIFICATION_TYPES.APP_UPDATE]: {
    version: string;
    changes: string[];
  };
  [NOTIFICATION_TYPES.INACTIVITY_REMINDER]: undefined;
  [NOTIFICATION_TYPES.STREAK_MILESTONE]: {
    days: number;
  };
};

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: {
    type: NotificationType;
    [key: string]: any;
  };
}
