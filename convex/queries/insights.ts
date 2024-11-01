import { v } from "convex/values";

import { query } from "../_generated/server";
import { getUserId } from "../util";

export const checkInsightGenerated = query({
  args: { monthYear: v.string() },
  async handler(ctx, { monthYear }) {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const insight = await ctx.db
      .query("insights")
      .withIndex("by_userId_and_monthYear", (q) =>
        q.eq("userId", userId).eq("monthYear", monthYear)
      )
      .first();

    return !!insight;
  },
});
