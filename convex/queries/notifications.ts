import { v } from "convex/values";
import { query } from "../_generated/server";

export const getSubscription = query({
  args: {
    deviceId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;

    // Get the subscription for this specific device
    const subscription = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_deviceId", (q) =>
        q.eq("userId", userId).eq("deviceId", args.deviceId)
      )
      .first();

    return subscription;
  },
});