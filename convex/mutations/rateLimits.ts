import { v } from "convex/values";

import { internalMutation } from "../_generated/server";

export const upsert = internalMutation({
  args: {
    ipAddress: v.string(),
    expires: v.number(),
  },
  handler: async (ctx, { ipAddress, expires }) => {
    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("by_ip", (q) => q.eq("ipAddress", ipAddress))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { expires });
    } else {
      await ctx.db.insert("rateLimits", {
        ipAddress,
        expires,
      });
    }
  },
});
