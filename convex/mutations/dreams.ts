import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalMutation, mutation } from "../_generated/server";
import { getMyUser } from "../users";
import { CREDIT_COSTS, getUserId } from "../util";

export const addNewDream = mutation({
  args: {
    date: v.string(),
    emotions: v.array(v.id("emotions")),
    role: v.id("roles"),
    people: v.optional(v.array(v.string())),
    places: v.optional(v.array(v.string())),
    things: v.optional(v.array(v.string())),
    title: v.optional(v.string()),
    details: v.string(),
    withAnalysis: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getMyUser(ctx, {});

    if (!user) throw new Error("You must be logged in.");

    const dreamId = await ctx.db.insert("dreams", {
      userId: user.userId,
      isPublic: false,
      date: args.date,
      emotions: args.emotions,
      role: args.role,
      people: args.people,
      places: args.places,
      things: args.things,
      title: args.title,
      details: args.details,
    });

    // Generate title and themes (these are free features)
    await ctx.scheduler.runAfter(
      0,
      // @ts-ignore
      internal.mutations.openai.generateDreamTitle,
      { dreamId, details: args.details, emotions: args.emotions }
    );

    await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateDreamThemes,
      { dreamId, details: args.details, emotions: args.emotions }
    );

    // Generate analysis if requested
    if (args.withAnalysis) {
      await ctx.runMutation(internal.mutations.generateAnalysisInternal, {
        dreamId,
        userId: user.userId,
      });
    }

    return dreamId;
  },
});

export const generateAnalysis = mutation({
  args: { dreamId: v.id("dreams"), userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.users.consumeCredits, {
      cost: CREDIT_COSTS.ANALYSIS,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateAnalysis,
      { dreamId: args.dreamId, userId: args.userId }
    );
  },
});

export const generateAnalysisInternal = internalMutation({
  args: { dreamId: v.id("dreams"), userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.users.consumeCredits, {
      cost: CREDIT_COSTS.ANALYSIS,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateAnalysis,
      { dreamId: args.dreamId, userId: args.userId }
    );
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
    themes: v.optional(v.array(v.string())),
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
  args: { id: v.id("dreams") },
  handler: async (ctx, args): Promise<Id<"_scheduled_functions">> => {
    const userId = await getUserId(ctx);
    const dream = await ctx.db.get(args.id);

    if (!dream) throw new Error(`Dream with ID ${args.id} not found.`);
    if (userId !== dream.userId) throw new Error("Unauthorized access.");

    // Schedule the deletion after 10 seconds
    const taskId = await ctx.scheduler.runAfter(
      10 * 1000,
      internal.mutations.deleteDreamScheduler,
      { id: dream._id }
    );

    return taskId;
  },
});

export const deleteDreamScheduler = internalMutation({
  args: { id: v.id("dreams") },
  handler: async (ctx, args) => {
    const analysis = await ctx.db
      .query("analysis")
      .withIndex("by_dreamId", (q) => q.eq("dreamId", args.id))
      .collect();

    for (const entry of analysis) {
      await ctx.db.delete(entry._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const cancelScheduledDeletion = mutation({
  args: { taskId: v.id("_scheduled_functions") },
  handler: async (ctx, args) => {
    await ctx.scheduler.cancel(args.taskId);
  },
});

export const deleteAllUserDreams = mutation({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    const analysis = await ctx.db
      .query("analysis")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    await Promise.all(dreams.map((d) => ctx.db.delete(d._id)));
    await Promise.all(analysis.map((a) => ctx.db.delete(a._id)));
  },
});
