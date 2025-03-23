import { v } from "convex/values";

import { query } from "../_generated/server";

export const getDreamReminderUsers = query({
  args: {},
  handler: async (ctx) => {
    // Get all users with email preferences enabled for dream reminders
    const emailPrefs = await ctx.db
      .query("emailPreferences")
      .filter((q) => q.eq(q.field("dreamReminders"), true))
      .collect();

    const results = [];

    for (const pref of emailPrefs) {
      // Get user's last dream entry
      const lastDream = await ctx.db
        .query("dreams")
        .filter((q) => q.eq(q.field("userId"), pref.userId))
        .order("desc")
        .first();

      // Get user info
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), pref.userId))
        .first();

      if (!lastDream || !user) continue;

      // Calculate days since last dream
      const lastDreamDate = new Date(lastDream.date);
      const daysSince = Math.floor(
        (Date.now() - lastDreamDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Only include users who haven't logged dreams in 7+ days
      if (daysSince >= 7) {
        // Check if we've sent a reminder recently (within last 7 days)
        const recentReminder = await ctx.db
          .query("emailPreferences")
          .filter((q) =>
            q.and(
              q.eq(q.field("userId"), pref.userId),
              q.gte(
                q.field("lastDreamReminderSent"),
                Date.now() - 7 * 24 * 60 * 60 * 1000
              )
            )
          )
          .first();

        // Only include if no recent reminder
        if (!recentReminder) {
          results.push({
            userId: pref.userId,
            email: user.email,
            name: user.first_name,
            daysSinceLastDream: daysSince,
          });
        }
      }
    }

    return results;
  },
});

export const getUserEmailPreferences = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getMonthlyInsightsEmailPreferences = query({
  handler: async (ctx) => {
    // Get all users with email preferences enabled for monthly insights
    const emailPrefs = await ctx.db
      .query("emailPreferences")
      .filter((q) => q.eq(q.field("monthlyInsights"), true))
      .collect();

    const results = [];

    for (const pref of emailPrefs) {
      // Get user info
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), pref.userId))
        .first();

      if (!user) continue;

      results.push({
        userId: pref.userId,
        email: user.email,
        first_name: user.first_name,
      });
    }

    return results;
  },
});
