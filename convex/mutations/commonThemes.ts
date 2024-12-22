import { v } from "convex/values";

import { internalMutation } from "../_generated/server";

export const addNewCommonTheme = internalMutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const { name } = args;

    // Check if theme already exists
    const existing = await ctx.db
      .query("commonThemes")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();

    if (existing) {
      return existing;
    }

    // Create new theme with initial count of 1
    return await ctx.db.insert("commonThemes", {
      name,
      count: 1,
    });
  },
});

export const incrementCommonThemeCount = internalMutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const { name } = args;

    const theme = await ctx.db
      .query("commonThemes")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();

    if (!theme) {
      return null;
    }

    return await ctx.db.patch(theme._id, {
      count: (theme.count || 0) + 1,
    });
  },
});
