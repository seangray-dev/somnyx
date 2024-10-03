import { v } from "convex/values";

import { query } from "../_generated/server";

export const getAllEmotions = query({
  handler: async (ctx) => {
    return await ctx.db.query("emotions").collect();
  },
});

export const getEmotionsByDreamId = query({
  args: { id: v.id("dreams") },
  handler: async (ctx, { id }) => {
    const dream = await ctx.db.get(id);

    if (!dream) {
      throw new Error(`Dream with ID ${id} not found.`);
    }

    return dream.emotions;
  },
});

export const getEmotionById = query({
  args: { id: v.id("emotions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
