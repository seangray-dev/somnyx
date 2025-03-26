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
      console.error("Unauthorized cron job attempt");
      return new Response("Unauthorized", { status: 401 });
    }

    // Log start of job
    console.log(
      JSON.stringify({
        type: "cron.start",
        job: "inactivity-reminders",
        timestamp: new Date().toISOString(),
      })
    );

    // Get users who haven't logged dreams in 7 days and have email preferences enabled
    const usersNeedingDreamReminders = await fetchQuery(
      // @ts-ignore
      api.queries.emails.getDreamReminderUsers
    );

    console.log(
      JSON.stringify({
        type: "cron.fetch",
        job: "inactivity-reminders",
        phase: "dream-reminders",
        usersCount: usersNeedingDreamReminders.length,
      })
    );

    // Get users who have inactivity notifications enabled
    const usersWithInactivityNotifications = await fetchQuery(
      api.queries.notificationPreferences.getAllInactivityReminderPreferences
    );

    console.log(
      JSON.stringify({
        type: "cron.fetch",
        job: "inactivity-reminders",
        phase: "inactivity-notifications",
        usersCount: usersWithInactivityNotifications.length,
      })
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

    // Log completion with structured data
    console.log(
      JSON.stringify({
        type: "cron.complete",
        job: "inactivity-reminders",
        ...summary,
      })
    );

    return NextResponse.json(summary);
  } catch (error) {
    // Log error with structured data
    console.error(
      JSON.stringify({
        type: "cron.error",
        job: "inactivity-reminders",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })
    );
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
