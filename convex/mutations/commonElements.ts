import { v } from "convex/values";

import { internalMutation } from "../_generated/server";
import {
  COMMON_DREAM_SYMBOLS_ANIMALS,
  COMMON_DREAM_SYMBOLS_ELEMENTS,
  COMMON_DREAM_THEMES,
} from "../util";

export const upsertDreamElement = internalMutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("symbol"), v.literal("theme")),
    category: v.string(),
    confidence: v.number(),
  },
  async handler(ctx, args) {
    const existing = await ctx.db
      .query("commonElements")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      // Update existing entry
      const newConfidence =
        (existing.confidence * existing.count + args.confidence) /
        (existing.count + 1);

      await ctx.db.patch(existing._id, {
        count: existing.count + 1,
        updatedAt: Date.now(),
        confidence: newConfidence,
      });
    } else {
      // Create new entry
      await ctx.db.insert("commonElements", {
        name: args.name,
        type: args.type,
        category: args.category,
        count: 1,
        confidence: args.confidence,
        updatedAt: Date.now(),
      });
    }
  },
});

export const populateCommonElements = internalMutation({
  args: {},
  async handler(ctx) {
    for (const theme of COMMON_DREAM_THEMES) {
      await ctx.db.insert("commonElements", {
        name: theme,
        count: 0,
        type: "theme",
        category: "Common Themes",
        confidence: 1,
        updatedAt: Date.now(),
      });
    }
  },
});

export const populateCommonAnimalSymbols = internalMutation({
  args: {},
  async handler(ctx) {
    for (const animal of COMMON_DREAM_SYMBOLS_ANIMALS) {
      const existing = await ctx.db
        .query("commonElements")
        .withIndex("by_name", (q) => q.eq("name", animal))
        .first();

      if (!existing) {
        await ctx.db.insert("commonElements", {
          name: animal,
          count: 0,
          type: "symbol",
          category: "Animals",
          confidence: 1,
          updatedAt: Date.now(),
        });
      }
    }
  },
});

export const populateElementSymbols = internalMutation({
  args: {},
  async handler(ctx) {
    for (const element of COMMON_DREAM_SYMBOLS_ELEMENTS) {
      const existing = await ctx.db
        .query("commonElements")
        .withIndex("by_name", (q) => q.eq("name", element))
        .first();

      if (!existing) {
        await ctx.db.insert("commonElements", {
          name: element,
          count: 0,
          type: "symbol",
          category: "Elements",
          confidence: 1,
          updatedAt: Date.now(),
        });
      }
    }
  },
});
