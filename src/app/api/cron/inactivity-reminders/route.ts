import { NextResponse } from "next/server";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { addDays, isBefore } from "date-fns";

import { env } from "@/config/env/server";
import { sendNotificationToUser } from "@/features/notifications/api/notification-service";
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notifications";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting inactivity check...");

    const INACTIVITY_DAYS = 7;
    const now = new Date();
    const inactivityThreshold = addDays(now, -INACTIVITY_DAYS);

    // Get all users from Clerk
    const { data: users } = await clerkClient.users.getUserList({
      limit: 100,
    });

    const inactiveUsers = users.filter((user: any) => {
      const lastSignIn = user.lastSignInAt ? new Date(user.lastSignInAt) : null;

      if (!lastSignIn) {
        console.log("User has never signed in:", user.id);
        return false;
      }

      const isInactive = isBefore(lastSignIn, inactivityThreshold);

      if (isInactive) {
        console.log("Found inactive user:", {
          userId: user.id,
          lastSignIn: lastSignIn.toISOString(),
          daysInactive: Math.floor(
            (now.getTime() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24)
          ),
        });
      }

      return isInactive;
    });

    console.log(`Found ${inactiveUsers.length} inactive users`);

    // Send notifications to inactive users
    const results = await Promise.allSettled(
      inactiveUsers.map(async (user) => {
        return sendNotificationToUser(
          user.id,
          NOTIFICATION_TYPES.INACTIVITY_REMINDER
        );
      })
    );

    const devicesFailed = results.filter((r) => r.status === "rejected").length;
    const devicesNotified = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    const summary = {
      success: true,
      inactiveUsers: inactiveUsers.length,
      devicesNotified,
      devicesFailed,
    };

    console.log("Inactivity check completed:", summary);

    return new Response(JSON.stringify(summary));
  } catch (error) {
    console.error("Inactivity check error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
