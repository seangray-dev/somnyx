import { v } from "convex/values";

import { internalQuery } from "../_generated/server";

export const getAllThemeCategories = internalQuery({
  handler: async (ctx) => {
    const categories = await ctx.db.query("themeCategories").collect();
    return categories;
  },
});

type CategoryName =
  | "relationships_social"
  | "emotional_states"
  | "physical_elements"
  | "animals_creatures"
  | "objects_symbols"
  | "settings_places"
  | "actions_events"
  | "personal_growth"
  | "body_health"
  | "nature_environment"
  | "travel_journey"
  | "time_memory"
  | "power_control"
  | "spiritual_mystical";

export const getByName = internalQuery({
  args: {
    name: v.union(
      v.literal("relationships_social"),
      v.literal("emotional_states"),
      v.literal("physical_elements"),
      v.literal("animals_creatures"),
      v.literal("objects_symbols"),
      v.literal("settings_places"),
      v.literal("actions_events"),
      v.literal("personal_growth"),
      v.literal("body_health"),
      v.literal("nature_environment"),
      v.literal("travel_journey"),
      v.literal("time_memory"),
      v.literal("power_control"),
      v.literal("spiritual_mystical")
    ),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("themeCategories")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});
