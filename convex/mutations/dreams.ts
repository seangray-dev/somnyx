import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
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

    const dreamId = await ctx.db.insert("dreams", {
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

    await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateDreamTitle,
      { dreamId: dreamId, details: args.details, emotions: args.emotions }
    );

    return dreamId;
  },
});

export const updateDream = mutation({
  args: {
    id: v.id("dreams"),
    isPublic: v.optional(v.boolean()),
    title: v.optional(v.string()),
    details: v.optional(v.string()),
    emotions: v.optional(v.array(v.id("emotions"))),
    role: v.optional(v.id("roles")),
    people: v.optional(v.array(v.string())),
    places: v.optional(v.array(v.string())),
    things: v.optional(v.array(v.string())),
    themes: v.optional(v.array(v.id("themes"))),
  },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      throw new Error("Dream not found");
    }

    const { ...updates } = args;

    const patchData = Object.fromEntries(
      Object.entries(updates).filter(
        ([key, value]) => value !== undefined && key !== "id"
      )
    );

    await ctx.db.patch(dream._id, patchData);
  },
});

export const updateDreamInternal = internalMutation({
  args: {
    id: v.id("dreams"),
    isPublic: v.optional(v.boolean()),
    title: v.optional(v.string()),
    details: v.optional(v.string()),
    emotions: v.optional(v.array(v.id("emotions"))),
    role: v.optional(v.id("roles")),
    people: v.optional(v.array(v.string())),
    places: v.optional(v.array(v.string())),
    things: v.optional(v.array(v.string())),
    themes: v.optional(v.array(v.id("themes"))),
  },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      throw new Error("Dream not found");
    }

    const { ...updates } = args;

    const patchData = Object.fromEntries(
      Object.entries(updates).filter(
        ([key, value]) => value !== undefined && key !== "id"
      )
    );

    await ctx.db.patch(dream._id, patchData);
  },
});

export const deleteDream = mutation({
  args: {
    id: v.id("dreams"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      throw new Error(`Dream with ID ${args.id} not found.`);
    }

    if (userId !== dream?.userId) {
      throw new Error("You do not have access to this dream.");
    }

    await ctx.db.delete(dream._id);
  },
});
