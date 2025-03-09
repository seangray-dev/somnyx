import { v } from "convex/values";

import { internalMutation } from "../_generated/server";

export const upsertDreamElement = internalMutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("symbol"), v.literal("theme")),
    category: v.id("themeCategories"),
    confidence: v.number(),
    freeInterpretationId: v.optional(v.id("freeInterpretations")),
    dreamId: v.optional(v.id("dreams")),
    redditPostId: v.optional(v.id("redditPosts")),
  },
  async handler(ctx, args) {
    const existing = await ctx.db
      .query("commonElements")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      // Update existing entry
      const newConfidence =
        (existing.confidence * existing.count + args.confidence) /
        (existing.count + 1);

      // Prepare arrays for update
      const freeInterpretationIds = [
        ...(existing.freeInterpretationIds || []),
        ...(args.freeInterpretationId ? [args.freeInterpretationId] : []),
      ];
      const dreamIds = [
        ...(existing.dreamIds || []),
        ...(args.dreamId ? [args.dreamId] : []),
      ];
      const redditPostIds = [
        ...(existing.redditPostIds || []),
        ...(args.redditPostId ? [args.redditPostId] : []),
      ];

      await ctx.db.patch(existing._id, {
        count: existing.count + 1,
        updatedAt: Date.now(),
        confidence: newConfidence,
        freeInterpretationIds,
        dreamIds,
        redditPostIds,
      });
    } else {
      // Create new entry
      await ctx.db.insert("commonElements", {
        name: args.name,
        type: args.type,
        category: args.category,
        count: 1,
        confidence: args.confidence,
        updatedAt: Date.now(),
        freeInterpretationIds: args.freeInterpretationId
          ? [args.freeInterpretationId]
          : undefined,
        dreamIds: args.dreamId ? [args.dreamId] : undefined,
        redditPostIds: args.redditPostId ? [args.redditPostId] : undefined,
      });
    }
  },
});

export const createCommonElement = internalMutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("symbol"), v.literal("theme")),
    category: v.id("themeCategories"),
  },
  async handler(ctx, args) {
    const id = await ctx.db.insert("commonElements", {
      name: args.name,
      type: args.type,
      category: args.category,
      count: 0,
      confidence: 1,
      updatedAt: Date.now(),
    });

    return id;
  },
});
