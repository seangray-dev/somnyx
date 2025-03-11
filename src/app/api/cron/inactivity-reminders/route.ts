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

    const today = new Date();
    // Ensure we're using the current month by subtracting one day
    const currentMonth = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    console.log("Current month:", currentMonth);

    // Get users with notification preferences enabled
    const usersWithNotifications = await fetchQuery(
      api.queries.notificationPreferences.getAllMonthlyInsightsPreferences
    );

    // Get users with email preferences enabled
    const emailPreferences = await fetchQuery(
      // @ts-ignore
      api.queries.emails.getDreamReminderUsers
    );

    // Send emails to users who have email preferences enabled
    const emailResults = await Promise.allSettled(
      emailPreferences.map(async (user) => {
        return sendDreamReminderEmail({
          email: user.email,
          name: user.name,
          daysSinceLastDream: user.daysSinceLastDream,
        });
      })
    );

    // Send push notifications to users who have notifications enabled
    const notificationResults = await Promise.allSettled(
      usersWithNotifications.map(async (user) => {
        return sendNotificationToUser(
          user.userId,
          NOTIFICATION_TYPES.INACTIVITY_REMINDER
        );
      })
    );

    const emailsFailed = emailResults.filter(
      (r) => r.status === "rejected"
    ).length;
    const emailsSent = emailResults.filter(
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
      emailUsers: emailPreferences.length,
      notificationUsers: usersWithNotifications.length,
      emailsSent: emailsSent,
      emailsFailed: emailsFailed,
      notificationsDelivered: notificationsDelivered,
      notificationsFailed: notificationsFailed,
      date: currentMonth.toISOString(),
    };

    console.log("Monthly insights completed:", summary);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Monthly insights cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
