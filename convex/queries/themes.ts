import { query } from "../_generated/server";

export const getAllThemes = query({
  handler: async (ctx) => {
    return await ctx.db.query("themes").collect();
  },
});
