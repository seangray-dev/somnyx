import { v } from "convex/values";

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
