import { v } from "convex/values";

import { internalQuery } from "../_generated/server";

export const getCommonThemes = internalQuery({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const { name } = args;

    return await ctx.db
      .query("commonThemes")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();
  },
});
