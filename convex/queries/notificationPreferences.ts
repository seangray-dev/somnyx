import { v } from "convex/values";

import { query } from "../_generated/server";
import { NOTIFICATION_TYPES } from "../util";

export const getNotificationPreferences = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      console.error("No user ID provided");
      return null;
    }

    const notificationPreferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!notificationPreferences) {
      console.error("No notification preferences found");
      return null;
    }

    return notificationPreferences;
  },
});

export const getAllDailyReminderPreferences = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("notificationPreferences").collect();

    return all.filter((pref) =>
      pref.enabledTypes.includes(NOTIFICATION_TYPES.DAILY_REMINDER)
    );
  },
});

export const getAllInactivityReminderPreferences = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("notificationPreferences").collect();

    return all.filter((pref) =>
      pref.enabledTypes.includes(NOTIFICATION_TYPES.INACTIVITY_REMINDER)
    );
  },
});

export const getAllMonthlyInsightsPreferences = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("notificationPreferences").collect();

    const filteredPrefs = all.filter((pref) =>
      pref.enabledTypes.includes(NOTIFICATION_TYPES.MONTHLY_INSIGHTS)
    );

    // Get user data for filtered preferences
    const usersWithPrefs = await Promise.all(
      filteredPrefs.map(async (pref) => {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), pref.userId))
          .first();

        if (!user) return null;

        return {
          ...pref,
          email: user.email,
          first_name: user.first_name,
        };
      })
    );

    // Filter out any null values (users not found)
    return usersWithPrefs.filter(
      (user): user is NonNullable<typeof user> => user !== null
    );
  },
});
