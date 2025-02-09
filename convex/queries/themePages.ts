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
