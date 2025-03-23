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
      return await ctx.db
        .query("themePages")
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();
    }

    return await ctx.db
      .query("themePages")
      .withSearchIndex("search", (q) => q.search("name", query))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
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

export const getPublishedThemePages = query({
  handler: async (ctx) => {
    // Get all published pages that have a category
    const pages = await ctx.db
      .query("themePages")
      .filter((q) =>
        q.and(
          q.eq(q.field("isPublished"), true),
          q.neq(q.field("category"), undefined)
        )
      )
      .collect();

    // Get all categories in one go
    const categories = await ctx.db.query("themeCategories").collect();
    const categoryMap = new Map(categories.map((cat) => [cat._id, cat]));

    // Map pages to include their category
    return pages
      .map((page) => ({
        ...page,
        category: page.category ? categoryMap.get(page.category) : undefined,
      }))
      .filter(
        (
          page
        ): page is typeof page & {
          category: NonNullable<typeof page.category>;
        } => page.category !== undefined
      );
  },
});

export const getThemePageWithImageByNamePublic = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const theme = await ctx.db
      .query("themePages")
      .filter((q) => q.eq(q.field("name"), args.name.toLowerCase()))
      .first();

    if (!theme?.storageId) return null;

    // Get the URL for the image
    const imageUrl = await ctx.storage.getUrl(theme.storageId);

    return {
      ...theme,
      imageUrl,
    };
  },
});

export const getThemePageMapping = query({
  handler: async (ctx) => {
    const pages = await ctx.db
      .query("themePages")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    // Return minimal data structure
    return pages.reduce(
      (acc, page) => ({
        ...acc,
        [page.name.toLowerCase()]: page.seo_slug,
      }),
      {} as { [key: string]: string }
    );
  },
});
