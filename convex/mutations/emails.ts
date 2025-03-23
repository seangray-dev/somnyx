import { v } from "convex/values";
import { format } from "date-fns";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
import { sendDreamReminderEmail, sendMonthlyInsightsEmail } from "../emails";

export const sendDreamReminder = internalMutation({
  handler: async (ctx) => {
    // Get users who need reminders
    const users = await ctx.runQuery(
      // @ts-ignore
      internal.queries.emails.getDreamReminderUsers
    );

    if (!users || users.length === 0) return;

    // Send reminders to each eligible user
    for (const user of users) {
      // Send the email
      await sendDreamReminderEmail({
        email: user.email,
        name: user.name,
        daysSinceLastDream: user.daysSinceLastDream,
      });

      // Update the last reminder sent timestamp
      const prefs = await ctx.db
        .query("emailPreferences")
        .withIndex("by_userId", (q) => q.eq("userId", user.userId))
        .first();

      if (prefs) {
        await ctx.db.patch(prefs._id, {
          lastDreamReminderSent: Date.now(),
        });
      }
    }
  },
});

export const updateEmailPreferences = mutation({
  args: {
    userId: v.string(),
    dreamReminders: v.boolean(),
    monthlyInsights: v.boolean(),
    newFeatures: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { userId, ...preferences } = args;
    const now = Date.now();

    // Check if preferences exist
    const existing = await ctx.db
      .query("emailPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...preferences,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("emailPreferences", {
        userId,
        ...preferences,
        updatedAt: now,
      });
    }
  },
});

export const sendMonthlyInsights = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Only run on the first day of the month
    if (new Date().getUTCDate() !== 1) {
      return;
    }

    // Get the previous month's data
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const month = format(previousMonth, "MMMM");
    const monthNumber = String(previousMonth.getMonth() + 1).padStart(2, "0"); // 01-12
    const year = previousMonth.getFullYear();

    // Get all users with monthly insights enabled
    const emailPrefs = await ctx.db
      .query("emailPreferences")
      .filter((q) => q.eq(q.field("monthlyInsights"), true))
      .collect();

    for (const pref of emailPrefs) {
      try {
        // Get user info
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), pref.userId))
          .first();

        if (!user) continue;

        // Get dreams for the month
        const dreams = await ctx.db
          .query("dreams")
          .withIndex("by_userId", (q) => q.eq("userId", pref.userId))
          .collect();

        const monthStart = new Date(year, previousMonth.getMonth(), 1);
        const monthEnd = new Date(year, previousMonth.getMonth() + 1, 0);

        const monthDreams = dreams.filter((dream) => {
          const dreamDate = new Date(dream.date);
          return dreamDate >= monthStart && dreamDate <= monthEnd;
        });

        if (monthDreams.length === 0) continue; // Skip if no dreams recorded

        // Calculate stats
        const stats = {
          totalDreams: monthDreams.length,
          streakDays: calculateLongestStreak(monthDreams),
        };

        // Send the email
        await sendMonthlyInsightsEmail({
          email: user.email,
          name: user.first_name,
          month,
          monthNumber,
          year,
          stats,
        });
      } catch (error) {
        console.error(
          `Failed to send monthly insights to user ${pref.userId}:`,
          error
        );
        // Continue with next user
      }
    }
  },
});

// Helper function for streak calculation
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
