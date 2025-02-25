import { v } from "convex/values";

import { mutation } from "../_generated/server";
import { NOTIFICATION_TYPES } from "../util";

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  enabledTypes: Object.values(NOTIFICATION_TYPES),
  dailyReminderTime: 32400000,
};

// ! Mutation to initialize preferences for all existing users
export const initializeAllUsersNotificationPreferences = mutation({
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();

    // Initialize preferences for each user
    for (const user of users) {
      await ctx.db.insert("notificationPreferences", {
        userId: user.userId,
        enabledTypes: DEFAULT_NOTIFICATION_PREFERENCES.enabledTypes,
        dailyReminderTime: DEFAULT_NOTIFICATION_PREFERENCES.dailyReminderTime,
        timezoneOffset: -300, // Toronto timezone offset
        updatedAt: Date.now(),
      });
    }
  },
});

export const initializeNotificationPreferences = mutation({
  args: { userId: v.string(), timezoneOffset: v.optional(v.number()) },
  handler: async (ctx, { userId, timezoneOffset }) => {
    // Check if preferences already exist
    const existing = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!existing) {
      // Create new preferences with defaults
      await ctx.db.insert("notificationPreferences", {
        userId,
        enabledTypes: DEFAULT_NOTIFICATION_PREFERENCES.enabledTypes,
        dailyReminderTime: DEFAULT_NOTIFICATION_PREFERENCES.dailyReminderTime,
        timezoneOffset,
        updatedAt: Date.now(),
      });
    }
  },
});

export const updateNotificationPreferences = mutation({
  args: {
    userId: v.string(),
    dailyReminderTime: v.optional(v.number()),
    enabledTypes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...preferences } = args;

    // Check if preferences exist
    const existing = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        ...preferences,
        updatedAt: Date.now(),
      });
    }

    return await ctx.db.insert("notificationPreferences", {
      userId,
      ...preferences,
      updatedAt: Date.now(),
    });
  },
});

export const updateTimezoneOffset = mutation({
  args: { userId: v.string(), timezoneOffset: v.number() },
  handler: async (ctx, { userId, timezoneOffset }) => {
    const existing = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, { timezoneOffset });
    }
  },
});

export const updateLastDailyReminderSent = mutation({
  args: { userId: v.string(), timestamp: v.number() },
  handler: async (ctx, { userId, timestamp }) => {
    const existing = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastDailyReminderSent: timestamp,
        updatedAt: Date.now(),
      });
    }
  },
});
