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

    // Get all users with daily reminders enabled
    const preferences = await fetchQuery(
      // @ts-ignore
      api.queries.notificationPreferences.getAllDailyReminderPreferences
    );

    const now = new Date();
    const currentTimeMs =
      now.getHours() * 60 * 60 * 1000 + now.getMinutes() * 60 * 1000;

    // Filter users whose reminder time matches current time
    const usersToNotify = preferences.filter((pref) => {
      const reminderTimeMs = pref.dailyReminderTime;
      // Allow 5 minute window to account for cron job timing
      return Math.abs(reminderTimeMs ?? 0 - currentTimeMs) <= 5 * 60 * 1000;
    });

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

    return NextResponse.json({
      success: true,
      notified: usersToNotify.length,
      results,
    });
  } catch (error) {
    console.error("Daily reminder cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
