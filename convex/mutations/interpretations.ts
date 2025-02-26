import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

const INTERPRETATION_EXPIRY_HOURS = 24; // Interpretations expire after 24 hours

export const saveFreeInterpretation = mutationGeneric({
  args: {
    dreamText: v.string(),
    ipAddress: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const interpretationId = await ctx.db.insert("freeInterpretations", {
      dreamText: args.dreamText,
      isExpired: false,
      expiresAt,
      createdAt: now,
      ipAddress: args.ipAddress,
      sessionId: args.sessionId,
    });

    // Schedule the expiration
    await ctx.scheduler.runAfter(
      INTERPRETATION_EXPIRY_HOURS * 60 * 60 * 1000,
      // @ts-ignore
      internal.mutations.interpretations.markInterpretationAsExpired,
      { interpretationId }
    );

    // Generate the analysis
    await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateAnalysisFree,
      {
        interpretationId,
      }
    );

    await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateDreamThemesFree,
      { interpretationId, details: args.dreamText }
    );

    return interpretationId;
  },
});

export const patchInterpretation = internalMutation({
  args: {
    interpretationId: v.id("freeInterpretations"),
    analysis: v.object({
      summary: v.string(),
      emotionalBreakdown: v.string(),
      symbolicInterpretation: v.string(),
      underlyingMessage: v.string(),
      actionableTakeaway: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { interpretationId, analysis } = args;

    await ctx.db.patch(interpretationId, {
      analysis,
    });
  },
});

export const markInterpretationAsExpired = internalMutation({
  args: {
    interpretationId: v.id("freeInterpretations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.interpretationId, { isExpired: true });
  },
});
