import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { sendNotificationToUser } from "@/features/notifications/api/notification-service";
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notifications";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minute timeout

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    // const authHeader = request.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Log initial preferences data
    const preferences = await fetchQuery(
      // @ts-ignore
      api.queries.notificationPreferences.getAllDailyReminderPreferences
    );
    console.log("Retrieved preferences:", preferences);

    const now = new Date();
    // Log timezone info
    console.log("Server timezone:", now.getTimezoneOffset());
    console.log("Full date object:", now.toISOString());

    const currentTimeMs =
      now.getHours() * 60 * 60 * 1000 + now.getMinutes() * 60 * 1000;

    // Log time calculations
    console.log({
      hours: now.getHours(),
      minutes: now.getMinutes(),
      calculatedMs: currentTimeMs,
    });

    // Log each preference evaluation
    // src/app/api/cron/daily-reminders/route.ts
    const usersToNotify = preferences.filter((pref) => {
      const reminderTimeMs = pref.dailyReminderTime;
      if (!reminderTimeMs) {
        console.log("No reminder time for user", pref.userId);
        return false;
      }
      const timeDiff = Math.abs(reminderTimeMs - currentTimeMs);

      // Convert times to minutes for easier comparison
      const reminderMinutes = Math.floor(reminderTimeMs / (60 * 1000));
      const currentMinutes = Math.floor(currentTimeMs / (60 * 1000));

      // Compare the actual times, accounting for 24-hour wraparound
      const minuteDiff = Math.min(
        Math.abs(reminderMinutes - currentMinutes),
        1440 - Math.abs(reminderMinutes - currentMinutes) // 1440 = minutes in a day
      );

      console.log({
        userId: pref.userId,
        reminderTime: new Date(
          new Date().setHours(0, 0, 0, 0) + reminderTimeMs
        ).toLocaleTimeString(),
        currentTime: new Date(
          new Date().setHours(0, 0, 0, 0) + currentTimeMs
        ).toLocaleTimeString(),
        minuteDiff,
        withinWindow: minuteDiff <= 5,
      });

      return minuteDiff <= 5; // 5 minute window
    });

    console.log("Users to notify", usersToNotify.length);

    // Send notifications to matched users
    const results = await Promise.allSettled(
      usersToNotify.map(async (pref) => {
        const { getToken } = auth();
        const token = await getToken({ template: "convex" });
        if (!token) return;

        return sendNotificationToUser(
          pref.userId,
          NOTIFICATION_TYPES.DAILY_REMINDER,
          token
        );
      })
    );

    console.log("Notified", usersToNotify.length, "users");

    return new Response(
      JSON.stringify({
        success: true,
        notified: usersToNotify.length,
        results,
      })
    );
  } catch (error) {
    console.error("Daily reminder cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
