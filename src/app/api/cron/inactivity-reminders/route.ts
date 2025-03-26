import { NextResponse } from "next/server";

import { fetchQuery } from "convex/nextjs";

import { env } from "@/config/env/server";
import { api } from "@/convex/_generated/api";
import { sendDreamReminderEmail } from "@/convex/emails";
import { sendNotificationToUser } from "@/features/notifications/api/notification-service";
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notifications";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get users who haven't logged dreams in 7 days and have email preferences enabled
    const usersNeedingDreamReminders = await fetchQuery(
      // @ts-ignore
      api.queries.emails.getDreamReminderUsers
    );

    // Get users who have inactivity notifications enabled
    const usersWithInactivityNotifications = await fetchQuery(
      api.queries.notificationPreferences.getAllInactivityReminderPreferences
    );

    // Send emails to users who haven't logged dreams
    const emailResults = await Promise.allSettled(
      usersNeedingDreamReminders.map(async (user) => {
        return sendDreamReminderEmail({
          email: user.email,
          name: user.name,
          daysSinceLastDream: user.daysSinceLastDream,
        });
      })
    );

    // Send notifications to inactive users
    const notificationResults = await Promise.allSettled(
      usersWithInactivityNotifications.map(async (user) => {
        return sendNotificationToUser(
          user.userId,
          NOTIFICATION_TYPES.INACTIVITY_REMINDER
        );
      })
    );

    const emailsFailed = emailResults.filter(
      (r) => r.status === "rejected"
    ).length;
    const emailsDelivered = emailResults.filter(
      (r) => r.status === "fulfilled"
    ).length;

    const notificationsFailed = notificationResults.filter(
      (r) => r.status === "rejected"
    ).length;
    const notificationsDelivered = notificationResults.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    const summary = {
      success: true,
      dreamReminders: {
        total: usersNeedingDreamReminders.length,
        emailsDelivered,
        emailsFailed,
      },
      inactivityReminders: {
        total: usersWithInactivityNotifications.length,
        notificationsDelivered,
        notificationsFailed,
      },
      date: new Date().toISOString(),
    };

    console.log("Dream and inactivity reminders completed:", summary);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Dream and inactivity reminders cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
