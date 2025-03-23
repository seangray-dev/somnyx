import { v } from "convex/values";

import { internalMutation, mutation } from "../_generated/server";

function formatSeoSlug(slug: string) {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const createThemePage = internalMutation({
  args: {
    name: v.string(),
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
    isPublished: v.optional(v.boolean()),
    category: v.id("themeCategories"),
    type: v.union(v.literal("theme"), v.literal("symbol")),
  },
  async handler(ctx, args) {
    const {
      name,
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
      isPublished = false,
      category,
      type,
    } = args;

    // Format the seo_slug before saving
    const formattedSlug = formatSeoSlug(seo_slug);

    const id = await ctx.db.insert("themePages", {
      name,
      seo_slug: formattedSlug,
      seo_description,
      isPublished,
      content,
      summary,
      commonSymbols,
      psychologicalMeaning,
      culturalContext,
      commonScenarios,
      tips,
      updatedAt,
      category,
      type,
    });

    return id;
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

export const updateThemePagePublishState = internalMutation({
  args: {
    id: v.id("themePages"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, isPublished } = args;

    await ctx.db.patch(id, {
      isPublished,
      updatedAt: Date.now(),
    });
  },
});

export const togglePublishState = mutation({
  args: {
    id: v.id("themePages"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!user?.isAdmin) {
      throw new Error("Unauthorized: Only admins can publish theme pages");
    }

    const { id, isPublished } = args;

    await ctx.db.patch(id, {
      isPublished,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const fixExistingSeoSlugs = internalMutation({
  handler: async (ctx) => {
    const pages = await ctx.db.query("themePages").collect();
    let count = 0;

    for (const page of pages) {
      const formattedSlug = formatSeoSlug(page.seo_slug);

      // Only update if the slug needs to be changed
      if (formattedSlug !== page.seo_slug) {
        await ctx.db.patch(page._id, {
          seo_slug: formattedSlug,
          updatedAt: Date.now(),
        });
        count++;
      }
    }

    return `Successfully updated ${count} theme page slugs`;
  },
});

