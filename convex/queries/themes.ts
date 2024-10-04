import { v } from "convex/values";

import { query } from "../_generated/server";

export const getAllThemes = query({
  handler: async (ctx) => {
    const themes = await ctx.db.query("themes").collect();
    return themes;
  },
});

export const getAllThemesToDream = query({
  args: { dreamId: v.id("dreams") },
  handler: async (ctx, args) => {
    const { dreamId } = args;

    const dream = await ctx.db.get(dreamId);

    const themeIds = dream?.themes ?? [];

    const themes = await Promise.all(
      themeIds.map((themeId) => ctx.db.get(themeId))
    );

    return themes;
  },
});
