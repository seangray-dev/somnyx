import { v } from "convex/values";

import { internalAction, mutation } from "../_generated/server";
import { NOTIFICATION_TYPES } from "../notifications/types";

export const subscribe = mutation({
  args: {
    deviceName: v.string(),
    deviceId: v.string(),
    subscription: v.object({
      endpoint: v.string(),
      expirationTime: v.optional(v.number()),
      keys: v.object({
        p256dh: v.string(),
        auth: v.string(),
      }),
      options: v.optional(
        v.object({
          applicationServerKey: v.optional(v.string()),
          userVisibleOnly: v.optional(v.boolean()),
        })
      ),
    }),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        "Unauthorized: User must be logged in to subscribe to notifications"
      );
    }

    const userId = identity.subject;
    const now = Date.now();

    try {
      // Check if a subscription already exists for this endpoint
      const existing = await ctx.db
        .query("notifications")
        .withIndex("by_userId_and_deviceId", (q) =>
          q.eq("userId", userId).eq("deviceId", args.deviceId)
        )
        .first();

      if (existing) {
        // Update existing subscription
        return await ctx.db.patch(existing._id, {
          subscription: args.subscription,
          deviceName: args.deviceName,
          deviceId: args.deviceId,
          lastActiveAt: now,
          updatedAt: now,
        });
      }

      // Create new subscription
      const newSubscription = await ctx.db.insert("notifications", {
        userId,
        deviceId: args.deviceId,
        deviceName: args.deviceName,
        subscription: args.subscription,
        lastActiveAt: now,
        createdAt: now,
        updatedAt: now,
      });

      return newSubscription;
    } catch (error) {
      console.error("Error in subscription mutation:", error);
      throw error;
    }
  },
});

export const unsubscribe = mutation({
  args: {
    deviceId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    // Find and delete the subscription
    const subscription = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_deviceId", (q) =>
        q.eq("userId", userId).eq("deviceId", args.deviceId)
      )
      .first();

    if (subscription) {
      await ctx.db.delete(subscription._id);
    }

    return { success: true };
  },
});

export const sendNotification = internalAction({
  args: {
    userId: v.string(),
    type: v.union(
      v.literal(NOTIFICATION_TYPES.ANALYSIS_COMPLETE),
      v.literal(NOTIFICATION_TYPES.MONTHLY_INSIGHTS),
      v.literal(NOTIFICATION_TYPES.DAILY_REMINDER),
      v.literal(NOTIFICATION_TYPES.LOW_CREDITS),
      v.literal(NOTIFICATION_TYPES.INACTIVITY_REMINDER),
      v.literal(NOTIFICATION_TYPES.APP_UPDATE),
      v.literal(NOTIFICATION_TYPES.STREAK_MILESTONE)
    ),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const { userId, type, data } = args;
    const apiUrl = "https://somnyx.app/api/notifications";

    // Make HTTP request to your Next.js endpoint
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary auth headers
      },
      body: JSON.stringify({ userId, type, data }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }

    return await response.json();
  },
});
