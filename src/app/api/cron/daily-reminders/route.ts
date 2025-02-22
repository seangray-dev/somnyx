import { NextResponse } from "next/server";

import { fetchQuery } from "convex/nextjs";
import {
  addMinutes,
  differenceInMinutes,
  setHours,
  setMinutes,
} from "date-fns";

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

    const NOTIFICATION_WINDOW_MINUTES = 15;

    const serverNow = new Date();
    
    console.log("Cron job started:", {
      serverTime: serverNow.toISOString(),
      executionWindow: NOTIFICATION_WINDOW_MINUTES,
    });

    const preferences = await fetchQuery(
      // @ts-ignore
      api.queries.notificationPreferences.getAllDailyReminderPreferences
    );

    const usersToNotify = preferences.filter((pref) => {
      const { dailyReminderTime, timezoneOffset, userId } = pref;

      if (!dailyReminderTime || typeof timezoneOffset !== "number") {
        console.log("Skipping user - missing data:", {
          userId,
          dailyReminderTime,
          timezoneOffset,
        });
        return false;
      }

      // Get user's local time
      const userLocalTime = addMinutes(serverNow, timezoneOffset);

      // Convert reminder time (milliseconds since midnight) to today's date
      const reminderHours = Math.floor(dailyReminderTime / (60 * 60 * 1000));
      const reminderMinutes = Math.floor(
        (dailyReminderTime % (60 * 60 * 1000)) / (60 * 1000)
      );
      const userReminderTime = setMinutes(
        setHours(userLocalTime, reminderHours),
        reminderMinutes
      );

      // Calculate minutes until/since reminder time
      const minutesUntilReminder = differenceInMinutes(
        userReminderTime,
        userLocalTime
      );

      // Only notify if:
      // 1. We're within the notification window (15 minutes before)
      // 2. We haven't passed the reminder time (prevent notifications after the time)
      const shouldNotify =
        minutesUntilReminder <= NOTIFICATION_WINDOW_MINUTES &&
        minutesUntilReminder > 0;

      console.log("Time check for user:", {
        userId,
        userLocalTime: userLocalTime.toLocaleTimeString(),
        reminderTime: userReminderTime.toLocaleTimeString(),
        minutesUntilReminder,
        shouldNotify,
      });

      return shouldNotify;
    });

    console.log("Notification summary:", {
      totalPreferences: preferences.length,
      usersToNotify: usersToNotify.length,
      userIds: usersToNotify.map((p) => p.userId),
    });

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

    const summary = {
      success: true,
      usersToNotify: usersToNotify.length,
      devicesNotified,
      devicesFailed,
    };

    console.log("Cron job completed:", summary);

    return new Response(JSON.stringify(summary));
  } catch (error) {
    console.error("Daily reminder cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
