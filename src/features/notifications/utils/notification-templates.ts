// utils/notification-templates.ts
import {
  NOTIFICATION_TYPES,
  NotificationDataMap,
  NotificationPayload,
  NotificationType,
} from "../types/notifications";

export const getNotificationContent = <T extends NotificationType>(
  type: T,
  data?: NotificationDataMap[T]
): NotificationPayload => {
  switch (type) {
    case NOTIFICATION_TYPES.ANALYSIS_COMPLETE: {
      const typedData =
        data as NotificationDataMap[typeof NOTIFICATION_TYPES.ANALYSIS_COMPLETE];
      return {
        title: "Dream Analysis Complete",
        body: `Your dream "${typedData.dreamTitle}" has been analyzed`,
        icon: "/icon-192x192.png",
        url: `/dreams/${typedData.dreamId}`,
        data: {
          type,
          dreamId: typedData.dreamId,
        },
      };
    }

    case NOTIFICATION_TYPES.MONTHLY_INSIGHTS: {
      const typedData =
        data as NotificationDataMap[typeof NOTIFICATION_TYPES.MONTHLY_INSIGHTS];
      const { month, year } = typedData;
      return {
        title: "Monthly Dream Insights Ready",
        body: `Your insights for ${month} are ready to explore`,
        icon: "/icon-192x192.png",
        url: `/insights/${month}-${year}`,
        data: {
          type,
          month,
          year,
        },
      };
    }

    case NOTIFICATION_TYPES.DAILY_REMINDER:
      return {
        title: "Record Your Dreams",
        body: "Don't forget to journal your dreams while they're fresh in your mind",
        icon: "/icon-192x192.png",
        url: "/dashboard",
        data: {
          type,
        },
      };

    case NOTIFICATION_TYPES.LOW_CREDITS: {
      const typedData =
        data as NotificationDataMap[typeof NOTIFICATION_TYPES.LOW_CREDITS];
      return {
        title: "Low Credits Alert",
        body: `You have ${typedData.credits} credits remaining`,
        icon: "/icon-192x192.png",
        url: "/credits",
        data: {
          type,
          credits: typedData.credits,
        },
      };
    }

    default:
      throw new Error(`Notification template not found for type: ${type}`);
  }
};
