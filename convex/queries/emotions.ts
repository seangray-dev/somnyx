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

export const getEmotionsByDreamIdInternal = internalQuery({
  args: { id: v.id("dreams") },
  handler: async (ctx, args) => {
    const { id } = args;

    const dream = await ctx.db.get(id);

    if (!dream) {
      throw new Error(`Dream with ID ${id} not found.`);
    }

    const emotionIds = dream.emotions;

    const emotions = await Promise.all(
      emotionIds.map((emotionId) => ctx.db.get(emotionId))
    );

    return emotions;
  },
});

export const getEmotionsByIdsInternal = internalQuery({
  args: { ids: v.array(v.id("emotions")) },
  handler: async (ctx, args) => {
    const emotions = await Promise.all(args.ids.map((id) => ctx.db.get(id)));

    return emotions;
  },
});
