import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { format } from "date-fns";

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
