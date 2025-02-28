import { v } from "convex/values";

import { internalQuery, query } from "../_generated/server";

export const getFreeInterpretation = query({
  args: {
    interpretationId: v.id("freeInterpretations"),
  },
  handler: async (ctx, args) => {
    const interpretation = await ctx.db.get(args.interpretationId);

    if (!interpretation || interpretation.isExpired) {
      return null;
    }

    return interpretation;
  },
});

export const getInterpretationByIdInternal = internalQuery({
  args: {
    interpretationId: v.id("freeInterpretations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.interpretationId);
  },
});
