import { v } from "convex/values";

import { query } from "../_generated/server";
import { getUserId } from "../util";

export const getRecentUserDreams = query({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const amount = args.amount ?? 5;

    if (!userId) {
      // throw new Error("You must be logged in.");
    }

    return await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(amount);
  },
});
