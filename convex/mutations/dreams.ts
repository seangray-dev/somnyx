import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalMutation, mutation } from "../_generated/server";
import { CREDIT_COSTS, getUserId } from "../util";

export const addNewDream = mutation({
  args: {
    date: v.string(),
    details: v.string(),
    isRecurring: v.optional(v.boolean()),
    isLucid: v.optional(v.boolean()),
    emotions: v.array(v.id("emotions")),
    role: v.id("roles"),
    people: v.optional(v.array(v.string())),
    places: v.optional(v.array(v.string())),
    things: v.optional(v.array(v.string())),
    title: v.optional(v.string()),
    withAnalysis: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) throw new Error("You must be logged in.");

    const dreamId = await ctx.db.insert("dreams", {
      userId,
      isPublic: false,
      date: args.date,
      emotions: args.emotions,
      role: args.role,
      people: args.people,
      places: args.places,
      things: args.things,
      title: args.title,
      details: args.details,
      isRecurring: args.isRecurring,
      isLucid: args.isLucid,
    });

    // Generate title and themes (these are free features)
    await ctx.scheduler.runAfter(
      0,
      // @ts-ignore
      internal.mutations.openai.generateDreamTitle,
      {
        dreamId,
        details: args.details,
        emotions: args.emotions,
        dreamDate: args.date,
      }
    );

    await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateDreamThemesFree,
      {
        source: {
          id: dreamId,
          type: "dream",
        },
        details: args.details,
      }
    );

    // Generate analysis if requested
    if (args.withAnalysis) {
      await ctx.runMutation(internal.mutations.generateAnalysisInternal, {
        dreamId,
        userId,
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
    themes: v.optional(v.array(v.string())),
    symbols: v.optional(v.array(v.string())),
    date: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    isLucid: v.optional(v.boolean()),
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
    symbols: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
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

    // Delete storage items first
    await Promise.all(
      analysis
        .filter((a) => a.imageStorageId)
        .map((a) => ctx.storage.delete(a.imageStorageId!))
    );

    // Delete insights related to these dreams
    const insights = await ctx.db
      .query("insights")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();
    await Promise.all(insights.map((i) => ctx.db.delete(i._id)));

    // Delete analysis records
    await Promise.all(analysis.map((a) => ctx.db.delete(a._id)));

    // Finally delete dreams
    await Promise.all(dreams.map((d) => ctx.db.delete(d._id)));
  },
});

export const migrateToSlugs = internalMutation({
  handler: async (ctx) => {
    // Get all dreams
    const dreams = await ctx.db.query("dreams").collect();
    let updated = 0;
    let errors = 0;

    for (const dream of dreams) {
      try {
        if (!dream.title) continue; // Skip if no title

        // Create base slug from title
        let baseSlug = dream.title
          .toLowerCase()
          // Replace special characters with space
          .replace(/[^a-z0-9]+/g, " ")
          // Remove extra spaces and trim
          .trim()
          // Replace spaces with hyphens
          .replace(/\s+/g, "-");

        // Check for existing dreams with same date and similar slug
        const existingDreams = await ctx.db
          .query("dreams")
          .withIndex("by_userId_date_slug")
          .filter((q) =>
            q.and(
              q.eq(q.field("userId"), dream.userId),
              q.eq(q.field("date"), dream.date),
              q.neq(q.field("_id"), dream._id)
            )
          )
          .collect();

        // If we find dreams with similar slugs, append a number
        const similarSlugs = existingDreams
          .map((d) => d.slug)
          .filter((slug) => slug?.startsWith(baseSlug));

        let finalSlug = baseSlug;
        if (similarSlugs.length > 0) {
          finalSlug = `${baseSlug}-${similarSlugs.length + 1}`;
        }

        // Update the dream with the new slug
        await ctx.db.patch(dream._id, { slug: finalSlug });
        updated++;
      } catch (error) {
        errors++;
        console.error(`Error processing dream ${dream._id}:`, error);
      }
    }

    return { updated, errors, total: dreams.length };
  },
});

// convex/mutations/dreams.ts
export const migrateDreamDates = internalMutation({
  handler: async (ctx) => {
    const dreams = await ctx.db.query("dreams").collect();
    let updated = 0;
    let errors = 0;

    for (const dream of dreams) {
      try {
        // Convert ISO string to YYYY-MM-DD
        const simpleDate = new Date(dream.date).toISOString().split("T")[0];

        // Update the dream with the new date format
        await ctx.db.patch(dream._id, { date: simpleDate });
        updated++;
      } catch (error) {
        errors++;
        console.error(`Error processing dream ${dream._id}:`, error);
      }
    }

    return {
      updated,
      errors,
      total: dreams.length,
      message: `Updated ${updated} dreams to YYYY-MM-DD format`,
    };
  },
});
