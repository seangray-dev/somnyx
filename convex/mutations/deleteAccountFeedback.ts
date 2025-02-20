import { v } from "convex/values";

import { mutation } from "../_generated/server";

export const collectDeleteAccountFeedback = mutation({
  args: {
    reasons: v.optional(v.array(v.string())),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("deleteAccountFeedback", {
      reasons: args.reasons,
      feedback: args.feedback,
    });
  },
});
