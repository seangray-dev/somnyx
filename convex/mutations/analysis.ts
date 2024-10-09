import { v } from "convex/values";

import { internalMutation } from "../_generated/server";

export const addNewAnalysis = internalMutation({
  args: {
    dreamId: v.id("dreams"),
    userId: v.string(),
    analysis: v.object({
      summary: v.string(),
      emotionalBreakdown: v.string(),
      symbolicInterpretation: v.string(),
      underlyingMessage: v.string(),
      actionableTakeaway: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { dreamId, userId, analysis } = args;
    const {
      summary,
      emotionalBreakdown,
      symbolicInterpretation,
      underlyingMessage,
      actionableTakeaway,
    } = analysis;

    const analyisId = await ctx.db.insert("analysis", {
      dreamId,
      userId,
      summary,
      emotionalBreakdown,
      symbolicInterpretation,
      underlyingMessage,
      actionableTakeaway,
    });

    return analyisId;
  },
});
