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
    const identity = await ctx.auth.getUserIdentity();
    const user = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
          .first()
      : null;

    const query = args.query?.toLowerCase().trim();
    let dbQuery = ctx.db.query("themePages");

    // Filter out unpublished pages for non-admin users
    if (!user?.isAdmin) {
      dbQuery = dbQuery.filter((q) => q.eq(q.field("isPublished"), true));
    }

    if (!query) {
      return await dbQuery.order("desc").take(20);
    }

    return await dbQuery
      .withSearchIndex("search", (q) => q.search("name", query))
      .take(20);
  },
});

export const getAllThemePages = query({
  handler: async (ctx) => {
    const themePages = await ctx.db.query("themePages").collect();
    return themePages.length;
  },
});

export const getAllThemePagesAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    // Only allow admin to access this query
    // if (userId !== "user_2YCqK8BfgJcxrKxmwEjxCXhL6rF") {
    //   return null;
    // }

    const themePages = await ctx.db.query("themePages").order("desc").collect();
    return themePages;
  },
});

export const getPublishedThemePageNames = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
          .first()
      : null;

    let dbQuery = ctx.db.query("themePages");

    // Filter out unpublished pages for non-admin users
    if (!user?.isAdmin) {
      dbQuery = dbQuery.filter((q) => q.eq(q.field("isPublished"), true));
    }

    const pages = await dbQuery.collect();
    return pages.map((page) => page.name.toLowerCase());
  },
});
