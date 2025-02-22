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
