import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { format } from "date-fns";

import { Id } from "../_generated/dataModel";
import { internalQuery, query } from "../_generated/server";
import { getUserId } from "../util";

export const getRecentUserDreams = query({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const amount = args.amount ?? 6;

    if (!userId) {
      // throw new Error("You must be logged in.");
    }

    return await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .order("desc")
      .take(amount);
  },
});

export const getDreamById = query({
  args: { id: v.id("dreams"), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      return null;
    }

    if (dream.isPublic) {
      return dream;
    }

    if (args.userId !== dream?.userId) {
      return null;
    }

    return dream;
  },
});

export const getDreamByDateAndSlug = query({
  args: {
    date: v.string(),
    slug: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { date, slug, userId } = args;

    // First try to find a public dream with this date/title
    const publicDream = await ctx.db
      .query("dreams")
      .withIndex("by_isPublic_date_slug", (q) =>
        q.eq("isPublic", true).eq("date", date).eq("slug", slug)
      )
      .first();

    if (publicDream) return publicDream;

    // If user is logged in, try to find their private dream
    if (userId) {
      const privateDream = await ctx.db
        .query("dreams")
        .withIndex("by_userId_date_slug", (q) =>
          q.eq("userId", userId).eq("date", date).eq("slug", slug)
        )
        .first();

      if (privateDream) return privateDream;
    }

    return null;
  },
});

export const getDreamByIdInternal = internalQuery({
  args: { id: v.id("dreams"), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      throw new Error(`Dream with ID ${args.id} not found.`);
    }

    if (dream.isPublic) {
      return dream;
    }

    if (args.userId !== dream?.userId) {
      throw new Error("You do not have access to this dream.");
    }

    return dream;
  },
});

export const getDreamsByMonth = internalQuery({
  args: { userId: v.string(), monthYear: v.string() },
  handler: async (ctx, { userId, monthYear }) => {
    const [monthNumber, year] = monthYear.split("-").map(Number);

    const startDate = new Date(year, monthNumber - 1, 1).toISOString();
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59).toISOString();

    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", userId).gte("date", startDate).lte("date", endDate)
      )
      .collect();

    return dreams;
  },
});

export const hasAccessToDream = query({
  args: { dreamId: v.id("dreams"), userId: v.string() },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.dreamId);

    if (!dream) {
      throw new Error(`Dream with ID ${args.dreamId} not found.`);
    }

    if (args.userId !== dream?.userId) {
      return false;
    }

    return true;
  },
});

export const journalEntries = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.string(),
    order: v.union(v.literal("asc"), v.literal("desc")),
    timePeriod: v.optional(v.string()),
    emotions: v.optional(v.array(v.id("emotions"))),
    themes: v.optional(v.array(v.id("themes"))),
    role: v.optional(v.id("roles")),
  },
  handler: async (ctx, args) => {
    const { userId, order } = args;
    let query = ctx.db
      .query("dreams")
      .withIndex("by_userId_and_date", (q) => q.eq("userId", userId));

    let results = await query.paginate(args.paginationOpts);

    results.page = results.page.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    return results;
  },
});

export const getTotalDreamsCount = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    return dreams.length;
  },
});

export const getDreamsInCurrentMonthCount = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const currentMonth = new Date().getMonth();
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    return dreams.filter((dream) => {
      const month = new Date(dream.date).getMonth();
      return month === currentMonth;
    }).length;
  },
});

export const getAvailbleMonthsForInsights = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const currentDate = new Date();
    const currentMonthYear = format(currentDate, "MM-yyyy");

    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .collect();

    const monthsSet = new Set(
      dreams.map((dream) => {
        const dreamDate = new Date(dream.date);
        return format(dreamDate, "MM-yyyy");
      })
    );

    monthsSet.add(currentMonthYear);

    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  },
});

export const getDreamCountByMonth = query({
  async handler(ctx) {
    const userId = await getUserId(ctx);

    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId_and_date", (q) => q.eq("userId", userId!))
      .collect();

    const dreamCountsByMonth = dreams.reduce(
      (acc, dream) => {
        const dreamDate = new Date(dream.date);
        const monthYear = `${String(dreamDate.getMonth() + 1).padStart(2, "0")}-${dreamDate.getFullYear()}`;

        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += 1;

        return acc;
      },
      {} as Record<string, number>
    );

    return dreamCountsByMonth;
  },
});

export const getDreamForMetadataById = query({
  args: { id: v.id("dreams") },
  handler: async (ctx, args) => {
    const dream = await ctx.db.get(args.id);

    if (!dream) {
      return null;
    }

    // Only return minimal data needed for OG image
    return {
      id: dream._id,
      title: dream.title,
      details: dream.details,
      isPublic: dream.isPublic,
    };
  },
});

export const getPublicDreams = query({
  args: {
    paginationOpts: paginationOptsValidator,
    sortBy: v.union(v.literal("recent"), v.literal("random")),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, sortBy } = args;

    // Get all public dreams first
    const query = ctx.db
      .query("dreams")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc");

    if (sortBy === "random") {
      // For random sort, we need to get all dreams first
      const publicDreams = await query.collect();

      // Add optional analysis data to each dream
      const dreamsWithOptionalAnalysis = await Promise.all(
        publicDreams.map(async (dream) => {
          const analysis = await ctx.db
            .query("analysis")
            .withIndex("by_dreamId", (q) => q.eq("dreamId", dream._id))
            .first();

          // Return the dream with analysis data if it exists
          return {
            ...dream,
            analysisId: analysis?._id,
            imageStorageId: analysis?.imageStorageId as
              | Id<"_storage">
              | undefined,
          };
        })
      );

      // Use a seeded random sort based on the cursor to maintain consistency
      const startIndex = paginationOpts.cursor
        ? parseInt(paginationOpts.cursor)
        : 0;
      const endIndex = startIndex + paginationOpts.numItems;

      // Fisher-Yates shuffle with a seeded random number generator
      const shuffledDreams = [...dreamsWithOptionalAnalysis];
      for (let i = shuffledDreams.length - 1; i > 0; i--) {
        // Use a consistent seed for each session
        const j = Math.floor(((Math.sin(i) + 1) * (i + 1)) / 2);
        [shuffledDreams[i], shuffledDreams[j]] = [
          shuffledDreams[j],
          shuffledDreams[i],
        ];
      }

      const page = shuffledDreams.slice(startIndex, endIndex);
      const isDone = endIndex >= shuffledDreams.length;

      return {
        page,
        continueCursor: isDone ? "end" : endIndex.toString(),
        isDone,
      };
    }

    // For recent sort, use Convex's built-in pagination
    const results = await query.paginate(paginationOpts);

    // Add optional analysis data to each dream in the page
    const dreamsWithOptionalAnalysis = await Promise.all(
      results.page.map(async (dream) => {
        const analysis = await ctx.db
          .query("analysis")
          .withIndex("by_dreamId", (q) => q.eq("dreamId", dream._id))
          .first();

        // Return the dream with analysis data if it exists
        return {
          ...dream,
          analysisId: analysis?._id,
          imageStorageId: analysis?.imageStorageId as
            | Id<"_storage">
            | undefined,
        };
      })
    );

    return {
      ...results,
      page: dreamsWithOptionalAnalysis,
      continueCursor: results.continueCursor ?? "end",
    };
  },
});

export const check = query({
  handler: async (ctx) => {
    const dreams = await ctx.db
      .query("dreams")
      .filter((q) =>
        q.and(
          q.eq(q.field("date"), "2025-03-07"),
          q.eq(q.field("slug"), "echoes-of-the-past")
        )
      )
      .collect();

    return {
      found: dreams.length > 0,
      dreams: dreams,
      // Also show all dreams for this date to see what we have
      allDreamsOnDate: await ctx.db
        .query("dreams")
        .filter((q) => q.eq(q.field("date"), "2025-03-07"))
        .collect(),
    };
  },
});

export const getDreamsByDateAndSlugPattern = internalQuery({
  args: {
    date: v.string(),
    slugPattern: v.string(),
  },
  handler: async (ctx, args) => {
    const { date, slugPattern } = args;

    // First get all dreams for this date
    const dreams = await ctx.db
      .query("dreams")
      .filter((q) => q.eq(q.field("date"), date))
      .collect();

    // Then filter in memory for slugs that start with our pattern
    // Explicitly handle undefined slugs
    return dreams.filter(
      (dream): dream is typeof dream & { slug: string } =>
        typeof dream.slug === "string" && dream.slug.startsWith(slugPattern)
    );
  },
});
