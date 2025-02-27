import { v } from "convex/values";

import { query } from "../_generated/server";

export const getAnalysisByDreamId = query({
  args: { dreamId: v.id("dreams") },
  handler: async (ctx, args) => {
    // First get the dream to check if it's public
    const dream = await ctx.db.get(args.dreamId);
    if (!dream) {
      return null;
    }

    // Get the analysis
    const analysis = await ctx.db
      .query("analysis")
      .withIndex("by_dreamId", (q) => q.eq("dreamId", args.dreamId))
      .first();

    // Return the analysis if the dream is public or if the user owns it
    if (
      dream.isPublic ||
      analysis?.userId === (await ctx.auth.getUserIdentity())?.subject
    ) {
      return analysis;
    }

    return null;
  },
});

export const getAnalysisImageUrl = query({
  args: { storageId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId);
  },
});
