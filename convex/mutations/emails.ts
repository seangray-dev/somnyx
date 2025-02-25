import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
import { sendDreamReminderEmail } from "../emails";

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
