import { v } from "convex/values";

import { query } from "../_generated/server";

export const getAnalysisByDreamId = query({
  args: { dreamId: v.id("dreams") },
  handler: async (ctx, args) => {
    const analysis = await ctx.db
      .query("analysis")
      .withIndex("by_dreamId", (q) => q.eq("dreamId", args.dreamId))
      .first();

    return analysis;
  },
});
