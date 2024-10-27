import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { Id } from "../_generated/dataModel";
import { internalQuery, query } from "../_generated/server";
import { getUserId } from "../util";

export const getRecentUserDreams = query({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const amount = args.amount ?? 6;

    if (!userId) {
      // throw new Error("You must be logged in.");
    }

    return await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .order("desc")
      .take(amount);
  },
});

export const getDreamById = query({
  args: { id: v.id("dreams"), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      throw new Error(`Dream with ID ${args.id} not found.`);
    }

    if (dream.isPublic) {
      return dream;
    }

    if (args.userId !== dream?.userId) {
      throw new Error("You do not have access to this dream.");
    }

    return dream;
  },
});

export const getDreamByIdInternal = internalQuery({
  args: { id: v.id("dreams"), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      throw new Error(`Dream with ID ${args.id} not found.`);
    }

    if (dream.isPublic) {
      return dream;
    }

    if (args.userId !== dream?.userId) {
      throw new Error("You do not have access to this dream.");
    }

    return dream;
  },
});

export const hasAccessToDream = query({
  args: { dreamId: v.id("dreams"), userId: v.string() },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.dreamId);

    if (!dream) {
      throw new Error(`Dream with ID ${args.dreamId} not found.`);
    }

    if (args.userId !== dream?.userId) {
      return false;
    }

    return true;
  },
});

export const journalEntries = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.string(),
    order: v.union(v.literal("asc"), v.literal("desc")),
    timePeriod: v.optional(v.string()),
    emotions: v.optional(v.array(v.id("emotions"))),
    themes: v.optional(v.array(v.id("themes"))),
    role: v.optional(v.id("roles")),
  },
  handler: async (ctx, args) => {
    const { userId, order } = args;
    let query = ctx.db
      .query("dreams")
      .withIndex("by_userId_and_date", (q) => q.eq("userId", userId));

    let results = await query.paginate(args.paginationOpts);

    results.page = results.page.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    return results;
  },
});

export const getTotalDreamsCount = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    return dreams.length;
  },
});

export const getDreamsInCurrentMonthCount = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const currentMonth = new Date().getMonth();
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    return dreams.filter((dream) => {
      const month = new Date(dream.date).getMonth();
      return month === currentMonth;
    }).length;
  },
});

export const getMostFrequentEmotion = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    const emotions = dreams.map((dream) => dream.emotions).flat();

    if (emotions.length === 0) {
      return null; // Return null if no emotions
    }

    const emotionCounts = emotions.reduce(
      (acc, emotion) => {
        const emotionKey = emotion.toString(); // Convert Id<"emotions"> to string
        acc[emotionKey] = (acc[emotionKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostFrequentEmotionId = Object.entries(emotionCounts).reduce(
      (acc, curr) => (acc[1] < curr[1] ? curr : acc),
      ["", 0] // Initial value
    )[0];

    // Fetch the emotion details from the emotions table
    const mostFrequentEmotion = await ctx.db.get(
      mostFrequentEmotionId as Id<"emotions">
    );

    return {
      emotionName: mostFrequentEmotion?.name,
      emoji: mostFrequentEmotion?.emoji,
      count: emotionCounts[mostFrequentEmotionId],
    };
  },
});

export const getAvailbleMonthsForInsights = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const currentMonth = new Date().getMonth();
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    const months = dreams.map((dream) => {
      const month = new Date(dream.date).getMonth();
      return month === currentMonth
        ? `${month + 1}-${new Date().getFullYear()}`
        : `${month + 1}-${new Date(dream.date).getFullYear()}`;
    });

    return months;
  },
});
