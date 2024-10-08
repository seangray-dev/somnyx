import { v } from "convex/values";

import { internalQuery, query } from "../_generated/server";

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

export const getEmotionsByIdsInternal = internalQuery({
  args: { ids: v.array(v.id("emotions")) },
  handler: async (ctx, args) => {
    const emotions = await Promise.all(args.ids.map((id) => ctx.db.get(id)));

    return emotions;
  },
});
