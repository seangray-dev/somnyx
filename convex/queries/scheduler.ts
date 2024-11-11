import { v } from "convex/values";

import { query } from "../_generated/server";

export const getScheduledFunction = query({
  args: { id: v.id("_scheduled_functions") },
  handler: async (ctx, args) => {
    return await ctx.db.system.get(args.id);
  },
});
