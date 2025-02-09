import { v } from "convex/values";

import { internalQuery, query } from "../_generated/server";

export const getMostCommonElements = internalQuery({
  args: {},
  async handler(ctx, args) {
    const limit = 10;

    const elements = await ctx.db.query("commonElements").collect();

    const sortedElements = elements
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedElements.map((element) => ({
      name: element.name,
    }));
  },
});

export const getElementsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { category, limit = 50 } = args;

    return await ctx.db
      .query("commonElements")
      .withIndex("by_category", (q) => q.eq("category", category))
      .order("desc")
      .take(limit);
  },
});

export const getAllCommonElements = query({
  handler: async (ctx) => {
    const elements = await ctx.db.query("commonElements").collect();

    return elements;
  },
});
