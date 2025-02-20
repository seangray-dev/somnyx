import { v } from "convex/values";

import { mutation } from "../_generated/server";

export const submit = mutation({
  args: {
    type: v.union(v.literal("feedback"), v.literal("issue")),
    title: v.string(),
    description: v.string(),
    deviceInfo: v.optional(
      v.object({
        deviceType: v.string(),
        browser: v.string(),
        os: v.string(),
        screenResolution: v.string(),
      })
    ),
    metadata: v.optional(
      v.object({
        reportedFromBrowser: v.string(),
        reportedFromOs: v.string(),
        reportedFromScreenResolution: v.string(),
        reportedFromDeviceType: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    const feedback = await ctx.db.insert("feedback", {
      type: args.type,
      userId,
      title: args.title,
      description: args.description,
      deviceInfo: args.deviceInfo,
      metadata: args.metadata,
      status: args.type === "issue" ? "new" : "N/A",
      updatedAt: Date.now(),
    });

    return feedback;
  },
});
