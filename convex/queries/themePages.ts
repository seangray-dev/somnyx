import { v } from "convex/values";

import { internalQuery, query } from "../_generated/server";

export const getThemePageByName = internalQuery({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("themePages")
      .withIndex("by_seo_slug", (q) => q.eq("seo_slug", args.name))
      .first();
  },
});

export const getThemePageByNamePublic = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const themePage = await ctx.db
      .query("themePages")
      .withIndex("by_seo_slug", (q) => q.eq("seo_slug", args.name))
      .first();

    if (!themePage) {
      return null;
    }

    return themePage;
  },
});

export const getThemePageById = internalQuery({
  args: {
    id: v.id("themePages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getThemePageImageUrl = query({
  args: {
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const searchThemePages = query({
  args: {
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const query = args.query?.toLowerCase().trim();

    if (!query) {
      return await ctx.db.query("themePages").order("desc").take(20);
    }

    return await ctx.db
      .query("themePages")
      .withSearchIndex("search", (q) => q.search("name", query))
      .take(20);
  },
});

export const getAllThemePages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("themePages").collect();
  },
});
