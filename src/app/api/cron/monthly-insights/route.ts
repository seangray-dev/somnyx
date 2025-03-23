import { NextResponse } from "next/server";

import { fetchQuery } from "convex/nextjs";
import { format } from "date-fns";

import { env } from "@/config/env/server";
import { api } from "@/convex/_generated/api";
import { sendMonthlyInsightsEmail } from "@/convex/emails";
import { sendNotificationToUser } from "@/features/notifications/api/notification-service";
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notifications";

export const dynamic = "force-dynamic";

interface UserPreferences {
  userId: string;
  email: string;
  first_name: string;
  enabledTypes: string[];
}

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
    const usersWithNotifications = (await fetchQuery(
      api.queries.notificationPreferences.getAllMonthlyInsightsPreferences
    )) as UserPreferences[];

    // Get users with email preferences enabled
    const emailPreferences = await fetchQuery(
      // @ts-ignore
      api.queries.emails.getMonthlyInsightsEmailPreferences
    );

    // Format month for display (e.g., "December")
    const displayMonth = format(currentMonth, "MMMM");
    // Format month-year for URL (e.g., "12-2024")
    const monthYearUrl = format(currentMonth, "MM-yyyy");

    // Send emails to users who have email preferences enabled
    const emailResults = await Promise.allSettled(
      emailPreferences.map(async (user) => {
        // Get user's dream stats for the month
        const dreams = await fetchQuery(api.queries.dreams.getDreamsByMonth, {
          userId: user.userId,
          monthYear: monthYearUrl,
        });

        // Calculate stats
        const stats = {
          totalDreams: dreams.length,
          streakDays: calculateLongestStreak(dreams),
        };

        // Send the email
        return sendMonthlyInsightsEmail({
          email: user.email,
          name: user.first_name,
          month: displayMonth,
          monthNumber: format(currentMonth, "MM"),
          year: currentMonth.getFullYear(),
          stats,
        });
      })
    );

    // Send push notifications to users who have notifications enabled
    const notificationResults = await Promise.allSettled(
      usersWithNotifications.map(async (user) => {
        return sendNotificationToUser(
          user.userId,
          NOTIFICATION_TYPES.MONTHLY_INSIGHTS,
          {
            month: displayMonth,
            year: currentMonth.getFullYear(),
            monthYear: monthYearUrl,
          }
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
      monthYear: monthYearUrl,
    };

    console.log("Monthly insights completed:", summary);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Monthly insights cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function calculateLongestStreak(dreams: any[]) {
  if (dreams.length === 0) return 0;

  const dates = dreams
    .map((dream) => new Date(dream.date).toISOString().split("T")[0])
    .sort();

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const dayDiff =
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}
