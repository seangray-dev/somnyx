import { v } from "convex/values";

import { internalQuery } from "../_generated/server";

export const get = internalQuery({
  args: {
    ipAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const usage = await ctx.db
      .query("rateLimits")
      .withIndex("by_ip", (q) => q.eq("ipAddress", args.ipAddress))
      .first();

    return usage;
  },
});
