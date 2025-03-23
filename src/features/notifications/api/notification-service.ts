import { NotificationDataMap, NotificationType } from "../types/notifications";
import { getNotificationContent } from "../utils/notification-templates";
import { sendNotification } from "./actions";

export async function sendNotificationToUser<T extends NotificationType>(
  userId: string,
  type: T,
  data?: NotificationDataMap[T]
) {
  try {
    const notificationContent = getNotificationContent(type, data);

    if (!notificationContent) {
      console.log("No notification content found for type:", type);
      return { success: false, error: "No notification content found" };
    }

    const result = await sendNotification(userId, notificationContent);

    return { success: result.success, error: result.error };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, error: String(error) };
  }
}
