import { query } from "../_generated/server";

export const getAllEmotions = query({
  handler: async (ctx) => {
    return await ctx.db.query("emotions").collect();
  },
});
