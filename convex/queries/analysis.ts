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

export const getAnalysisImageUrl = query({
  args: { storageId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId);
  },
});
