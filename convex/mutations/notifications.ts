import { v } from "convex/values";

import { mutation } from "../_generated/server";

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
