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
    const usersToNotify = preferences.filter((pref) => {
      const reminderTimeMs = pref.dailyReminderTime;
      const timeDiff = Math.abs(reminderTimeMs ?? 0 - currentTimeMs);
      console.log({
        userId: pref.userId,
        reminderTimeMs,
        currentTimeMs,
        timeDiff,
        withinWindow: timeDiff <= 5 * 60 * 1000,
      });
      return timeDiff <= 5 * 60 * 1000;
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
