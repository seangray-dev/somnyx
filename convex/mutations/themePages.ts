import { v } from "convex/values";

import { internalMutation } from "../_generated/server";

export const createThemePage = internalMutation({
  args: {
    name: v.string(),
    seo_title: v.string(),
    seo_slug: v.string(),
    seo_description: v.string(),
    content: v.object({
      description: v.string(),
      types_variations: v.string(),
      dailyLifeSignificance: v.string(),
      emotional_experience_relationship: v.string(),
      research_studies: v.string(),
      expert_perspectives: v.string(),
    }),
    summary: v.string(),
    commonSymbols: v.array(v.string()),
    psychologicalMeaning: v.string(),
    culturalContext: v.string(),
    commonScenarios: v.array(v.string()),
    tips: v.string(),
    updatedAt: v.number(),
  },
  async handler(ctx, args) {
    const {
      name,
      seo_title,
      seo_slug,
      seo_description,
      content,
      summary,
      commonSymbols,
      psychologicalMeaning,
      culturalContext,
      commonScenarios,
      tips,
      updatedAt,
    } = args;

    await ctx.db.insert("themePages", {
      name,
      seo_title,
      seo_slug,
      seo_description,
      content,
      summary,
      commonSymbols,
      psychologicalMeaning,
      culturalContext,
      commonScenarios,
      tips,
      updatedAt,
    });
  },
});

export const updateThemePageImage = internalMutation({
  args: {
    id: v.id("themePages"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { id, storageId } = args;

    await ctx.db.patch(id, {
      storageId,
      updatedAt: Date.now(),
    });
  },
});
