import { query } from "../_generated/server";

export const getSubscription = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;

    // Get the user's most recent subscription
    const subscription = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    return subscription;
  },
}); 