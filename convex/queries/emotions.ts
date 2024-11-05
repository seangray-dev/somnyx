import { v } from "convex/values";

import { Id } from "../_generated/dataModel";
import { internalQuery, query } from "../_generated/server";
import { getUserId } from "../util";

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

export const getEmotionFrequencies = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    const emotionIds = dreams.map((dream) => dream.emotions).flat();

    if (emotionIds.length === 0) return [];

    const emotionCounts = emotionIds.reduce(
      (acc, emotionId) => {
        const key = emotionId.toString();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const uniqueEmotionIds = Object.keys(emotionCounts);
    const emotions = await Promise.all(
      uniqueEmotionIds.map((id) => ctx.db.get(id as Id<"emotions">))
    );

    return emotions
      .filter((emotion) => emotion !== null)
      .map((emotion) => ({
        name: emotion!.name,
        emoji: emotion!.emoji,
        dreams: emotionCounts[emotion!._id.toString()],
      }));
  },
});
