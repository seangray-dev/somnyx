import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";
import { NOTIFICATION_TYPES } from "../notifications/types";

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

    const dream = await ctx.db.get(dreamId);
    if (!dream) throw new Error("Dream not found");

    // Schedule HTTP request to send notification to user
    await ctx.scheduler.runAfter(
      0,
      internal.mutations.notifications.sendNotification,
      {
        userId,
        type: NOTIFICATION_TYPES.ANALYSIS_COMPLETE,
        data: {
          dreamId,
          dreamTitle: dream.title,
        },
      }
    );

    return analyisId;
  },
});

export const addAnalysisImage = internalMutation({
  args: {
    analysisId: v.id("analysis"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { analysisId, storageId } = args;

    await ctx.db.patch(analysisId, {
      imageStorageId: storageId,
    });
  },
});
