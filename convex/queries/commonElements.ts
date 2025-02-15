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
    const identity = await ctx.auth.getUserIdentity();
    const user = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
          .first()
      : null;

    const elements = await ctx.db.query("commonElements").collect();

    // If user is not admin, filter out elements that don't have published theme pages
    if (!user?.isAdmin) {
      const publishedThemePages = await ctx.db
        .query("themePages")
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();

      const publishedNames = new Set(
        publishedThemePages.map((page) => page.name.toLowerCase())
      );

      return elements.filter((element) =>
        publishedNames.has(element.name.toLowerCase())
      );
    }

    return elements;
  },
});

export const getAnimalSymbols = internalQuery({
  handler: async (ctx) => {
    const elements = await ctx.db
      .query("commonElements")
      .withIndex("by_category", (q) => q.eq("category", "Animals"))
      .collect();

    return elements;
  },
});

export const getElementSymbols = internalQuery({
  handler: async (ctx) => {
    const elements = await ctx.db
      .query("commonElements")
      .withIndex("by_category", (q) => q.eq("category", "Elements"))
      .collect();

    return elements;
  },
});

export const getCommonElementByName = internalQuery({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const element = await ctx.db
      .query("commonElements")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    return element;
  },
});
