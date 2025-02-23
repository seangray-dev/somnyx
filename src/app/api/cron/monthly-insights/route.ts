import { NextResponse } from "next/server";

import { fetchQuery } from "convex/nextjs";
import { format } from "date-fns";

import { env } from "@/config/env/server";
import { api } from "@/convex/_generated/api";
import { sendNotificationToUser } from "@/features/notifications/api/notification-service";
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notifications";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const today = new Date();

    // Get all users with notification preferences
    const preferences = await fetchQuery(
      // @ts-ignore
      api.queries.notificationPreferences.getAllMonthlyInsightsPreferences,
      {}
    );

    // Filter users who have monthly insights notifications enabled
    const usersToNotify = preferences.filter((pref) =>
      pref.enabledTypes?.includes(NOTIFICATION_TYPES.MONTHLY_INSIGHTS)
    );

    // Format month for display (e.g., "December")
    const displayMonth = format(today, "MMMM");
    // Format month-year for URL (e.g., "12-2024")
    const monthYearUrl = format(today, "MM-yyyy");

    const results = await Promise.allSettled(
      usersToNotify.map(async (pref) => {
        return sendNotificationToUser(
          pref.userId,
          NOTIFICATION_TYPES.MONTHLY_INSIGHTS,
          {
            month: displayMonth,
            year: today.getFullYear(),
            monthYear: monthYearUrl,
          }
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
      date: today.toISOString(),
      monthYear: monthYearUrl,
    };

    console.log("Monthly insights notification completed:", summary);

    return new Response(JSON.stringify(summary));
  } catch (error) {
    console.error("Monthly insights notification error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
