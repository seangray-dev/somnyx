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
  const icon = "/icon-192x192.png";

  switch (type) {
    case NOTIFICATION_TYPES.MONTHLY_INSIGHTS: {
      const typedData =
        data as NotificationDataMap[typeof NOTIFICATION_TYPES.MONTHLY_INSIGHTS];
      const { month, monthYear } = typedData;
      return {
        title: "Monthly Dream Insights Ready",
        body: `Your insights for ${month} are ready to explore`,
        icon,
        url: `/insights/${monthYear}`,
        data: {
          type,
          monthYear,
        },
      };
    }

    case NOTIFICATION_TYPES.DAILY_REMINDER:
      return {
        title: "Record Your Dreams",
        body: "Don't forget to journal your dreams while they're fresh in your mind",
        icon,
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
        icon,
        url: "/credits",
        data: {
          type,
          credits: typedData.credits,
        },
      };
    }

    case NOTIFICATION_TYPES.INACTIVITY_REMINDER:
      return {
        title: "Psst... Are you still dreaming?",
        body: "Your dream journal could use some new stories.",
        icon,
        url: "/dashboard",
        data: {
          type,
        },
      };

    default:
      throw new Error(`Notification template not found for type: ${type}`);
  }
};
