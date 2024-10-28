import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
import { getMyUser } from "../users";
import { CREDIT_COSTS } from "../util";

export const generateInsight = mutation({
  args: { month: v.string() },
  handler: async (ctx, args) => {
    const user = await getMyUser(ctx, {});

    if (!user) throw new Error("You must be logged in.");

    await ctx.runMutation(internal.users.consumeCredits, {
      userId: user.userId,
      cost: CREDIT_COSTS.INSIGHT,
    });

    const dreams = await ctx.runQuery(
      internal.queries.dreams.getDreamsByMonth,
      {
        userId: user.userId,
        month: args.month,
      }
    );

    await ctx.scheduler.runAfter(0, internal.mutations.openai.generateInsight, {
      dreams,
      userId: user.userId,
    });
  },
});

export const addNewInsight = internalMutation({
  args: {
    userId: v.string(),
    monthYear: v.string(),
    insight: v.object({
      summary: v.string(),
      emotionalPatterns: v.string(),
      recurringThemes: v.string(),
      symbolicMeaning: v.string(),
      actionableReflection: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("insights", {
      userId: args.userId,
      monthYear: args.monthYear,
      insight: args.insight,
    });
  },
});
