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

      const themePageMap = new Map(
        publishedThemePages.map((page) => [
          page.name.toLowerCase(),
          page.seo_slug,
        ])
      );

      return elements.filter((element) => {
        const lowerName = element.name.toLowerCase();
        const hasPublishedPage = themePageMap.has(lowerName);
        if (hasPublishedPage) {
          return {
            ...element,
            seo_slug: themePageMap.get(lowerName),
          };
        }
        return false;
      });
    }

    // For admin, still include seo_slugs where available
    const allThemePages = await ctx.db.query("themePages").collect();
    const themePageMap = new Map(
      allThemePages.map((page) => [page.name.toLowerCase(), page.seo_slug])
    );

    return elements.map((element) => ({
      ...element,
      seo_slug:
        themePageMap.get(element.name.toLowerCase()) ||
        element.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
    }));
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

export const getAllUniqueCategories = internalQuery({
  handler: async (ctx) => {
    const elements = await ctx.db.query("commonElements").collect();

    const uniqueCategories = [
      ...new Set(
        elements
          .map((element) => element.category?.toLowerCase().trim())
          .filter(Boolean) // Remove null/undefined/empty strings
      ),
    ].sort();

    return uniqueCategories;
  },
});
