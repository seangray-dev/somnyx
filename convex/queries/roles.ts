import { query } from "../_generated/server";

export const getAllRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query("roles").collect();
  },
});
