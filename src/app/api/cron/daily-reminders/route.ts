import { NextResponse } from "next/server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import {
  addMinutes,
  differenceInMinutes,
  setHours,
  setMinutes,
  startOfDay,
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

    const NOTIFICATION_WINDOW_MINUTES = 2; // Reduced from 15 to 2 minutes for more precise timing

    const serverNow = new Date();
    const todayStart = startOfDay(serverNow).getTime();

    console.log("Cron job started:", {
      serverTime: serverNow.toISOString(),
      executionWindow: NOTIFICATION_WINDOW_MINUTES,
    });

    const preferences = await fetchQuery(
      // @ts-ignore
      api.queries.notificationPreferences.getAllDailyReminderPreferences
    );

    const usersToNotify = preferences.filter((pref) => {
      const {
        dailyReminderTime,
        timezoneOffset,
        userId,
        lastDailyReminderSent,
      } = pref;

      if (!dailyReminderTime || typeof timezoneOffset !== "number") {
        console.log("Skipping user - missing data:", {
          userId,
          dailyReminderTime,
          timezoneOffset,
        });
        return false;
      }

      // Check if we've already sent a notification today
      if (lastDailyReminderSent && lastDailyReminderSent >= todayStart) {
        console.log("Skipping user - already notified today:", {
          userId,
          lastSent: new Date(lastDailyReminderSent).toISOString(),
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

      // Allow notifications within 2 minutes before until 1 minute after
      const shouldNotify =
        minutesUntilReminder <= NOTIFICATION_WINDOW_MINUTES && // within 2 mins before
        minutesUntilReminder >= -1; // or up to 1 min after

      console.log("Time check for user:", {
        userId,
        userLocalTime: userLocalTime.toLocaleTimeString(),
        reminderTime: userReminderTime.toLocaleTimeString(),
        minutesUntilReminder,
        shouldNotify,
        reason: !shouldNotify
          ? minutesUntilReminder > NOTIFICATION_WINDOW_MINUTES
            ? "too early"
            : minutesUntilReminder < -1
              ? "too late"
              : "unknown"
          : "within window",
      });

      return shouldNotify;
    });

    console.log("Notification summary:", {
      totalPreferences: preferences.length,
      usersToNotify: usersToNotify.length,
      userIds: usersToNotify.map((p) => p.userId),
    });

    // Update lastDailyReminderSent for each user before sending notifications
    await Promise.all(
      usersToNotify.map(async (pref) => {
        await fetchMutation(
          // @ts-ignore
          api.mutations.notificationPreferences.updateLastDailyReminderSent,
          { userId: pref.userId, timestamp: Date.now() }
        );
      })
    );

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
