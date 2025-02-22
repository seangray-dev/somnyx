import { NextResponse } from "next/server";

import { fetchQuery } from "convex/nextjs";

import { env } from "@/config/env/server";
import { api } from "@/convex/_generated/api";
import { sendNotificationToUser } from "@/features/notifications/api/notification-service";
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notifications";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minute timeout

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await fetchQuery(
      // @ts-ignore
      api.queries.notificationPreferences.getAllDailyReminderPreferences
    );

    const now = new Date();

    const usersToNotify = preferences.filter((pref) => {
      const reminderTimeMs = pref.dailyReminderTime;
      if (!reminderTimeMs || !pref.timezoneOffset) {
        return false;
      }

      // Get user's local time based on their timezone offset
      const userNow = new Date(now.getTime() + pref.timezoneOffset * 60 * 1000);
      const userCurrentTimeMs =
        userNow.getHours() * 60 * 60 * 1000 + userNow.getMinutes() * 60 * 1000;

      // Convert times to minutes for easier comparison
      const reminderMinutes = Math.floor(reminderTimeMs / (60 * 1000));
      const userCurrentMinutes = Math.floor(userCurrentTimeMs / (60 * 1000));

      // Compare the actual times, accounting for 24-hour wraparound
      const minuteDiff = Math.min(
        Math.abs(reminderMinutes - userCurrentMinutes),
        1440 - Math.abs(reminderMinutes - userCurrentMinutes)
      );

      return minuteDiff <= 15; // notification window is 15 minutes;
    });

    // Send notifications to matched users
    const results = await Promise.allSettled(
      usersToNotify.map(async (pref) => {
        return sendNotificationToUser(
          pref.userId,
          NOTIFICATION_TYPES.DAILY_REMINDER
        );
      })
    );

    const devicesFailed = results.filter((r) => r.status === "rejected").length;

    const devicesNotified = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    console.log({
      success: true,
      usersToNotify: usersToNotify.length,
      devicesNotified: devicesNotified,
      devicesFailed: devicesFailed,
    });

    return new Response(
      JSON.stringify({
        success: true,
        usersToNotify: usersToNotify.length,
        devicesNotified: devicesNotified,
        devicesFailed: devicesFailed,
      })
    );
  } catch (error) {
    console.error("Daily reminder cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
