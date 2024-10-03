import { v } from "convex/values";

import { mutation } from "../_generated/server";
import { getUserId } from "../util";

export const addNewDream = mutation({
  args: {
    date: v.string(),
    emotions: v.array(v.id("emotions")),
    role: v.id("roles"),
    people: v.optional(v.array(v.string())),
    places: v.optional(v.array(v.string())),
    things: v.optional(v.array(v.string())),
    themes: v.optional(v.array(v.id("themes"))),
    title: v.optional(v.string()),
    details: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in.");
    }

    await ctx.db.insert("dreams", {
      userId: userId,
      isPublic: false,
      date: args.date,
      emotions: args.emotions,
      role: args.role,
      people: args.people,
      places: args.places,
      things: args.things,
      themes: args.themes,
      title: args.title,
      details: args.details,
    });
  },
});
