import { v } from "convex/values";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { action, internalAction } from "../_generated/server";
import {
  CREDIT_COSTS,
  SYSTEM_PROMPT,
  analysisImagePrompt,
  getSystemPromptForThemePage,
  getUserId,
} from "../util";
import { ThemePage } from "../zodSchemas";

const openai = new OpenAI();

const Analysis = z.object({
  summary: z.string(),
  emotionalBreakdown: z.string(),
  symbolicInterpretation: z.string(),
  underlyingMessage: z.string(),
  actionableTakeaway: z.string(),
});

const DreamCategory = z.enum([
  "relationships_social",
  "emotional_states",
  "physical_elements",
  "animals_creatures",
  "objects_symbols",
  "settings_places",
  "actions_events",
  "personal_growth",
  "body_health",
  "nature_environment",
  "travel_journey",
  "time_memory",
  "power_control",
  "spiritual_mystical",
]);

const ThemesAndSymbols = z.object({
  themes: z.array(
    z.object({
      name: z.string(),
      confidence: z.number(),
      category: DreamCategory,
    })
  ),
  symbols: z.array(
    z.object({
      name: z.string(),
      confidence: z.number(),
      category: DreamCategory,
    })
  ),
});

const Themes = z.object({
  themes: z.array(z.string()),
});

const DreamElement = z.object({
  name: z.string(),
  category: z.string(),
  confidence: z.number(),
});

const CommonElements = z.object({
  themes: z.array(DreamElement),
  symbols: z.array(DreamElement),
});

const Insight = z.object({
  summary: z.string(),
  // Emotional Analysis (leveraging the emotion tags with emojis)
  emotionalInsights: z.object({
    dominantEmotions: z.array(
      z.object({
        emotion: z.string(),
        // emoji: z.string(),
        frequency: z.number(),
        percentage: z.number(),
        associatedThemes: z.array(z.string()),
      })
    ),
    emotionalTrends: z.object({
      weeklyProgression: z.array(
        z.object({
          week: z.string(),
          primaryEmotions: z.array(z.string()),
          trend: z.string(),
        })
      ),
      insights: z.string(),
    }),
    emotionalTriggers: z.array(
      z.object({
        trigger: z.string(),
        associatedEmotions: z.array(z.string()),
        frequency: z.number(),
      })
    ),
  }),

  // Role Analysis (based on user-selected roles)
  rolePatterns: z.object({
    primaryRoles: z.array(
      z.object({
        role: z.string(),
        frequency: z.number(),
        description: z.string(),
        associatedEmotions: z.array(z.string()),
        significantPatterns: z.string(),
      })
    ),
    roleInsights: z.string(),
  }),

  // Social Dynamics (from people field)
  socialDynamics: z.object({
    recurringCharacters: z.array(
      z.object({
        name: z.string(),
        frequency: z.number(),
        associatedEmotions: z.array(z.string()),
        contextsAppearing: z.array(z.string()),
      })
    ),
    relationshipPatterns: z.string(),
    socialThemes: z.array(z.string()),
  }),

  // Setting Analysis (from places field)
  settingAnalysis: z.object({
    commonLocations: z.array(
      z.object({
        place: z.string(),
        frequency: z.number(),
        associatedEmotions: z.array(z.string()),
        symbolism: z.string(),
      })
    ),
    environmentalPatterns: z.string(),
    settingTransitions: z.string(), // How settings change within/across dreams
  }),

  // Symbol Analysis (from things field)
  symbolism: z.object({
    recurringSymbols: z.array(
      z.object({
        symbol: z.string(),
        frequency: z.number(),
        contexts: z.array(z.string()),
        interpretation: z.string(),
        associatedEmotions: z.array(z.string()),
      })
    ),
    symbolPatterns: z.string(),
    uniqueSymbols: z.array(z.string()), // One-off but significant symbols
  }),

  // Thematic Analysis (derived from all fields)
  thematicAnalysis: z.object({
    majorThemes: z.array(
      z.object({
        theme: z.string(),
        frequency: z.number(),
        relatedSymbols: z.array(z.string()),
        relatedEmotions: z.array(z.string()),
        interpretation: z.string(),
      })
    ),
    themeProgression: z.string(),
    recurrentPatterns: z.array(z.string()),
  }),

  // Personal Growth Insights
  personalGrowth: z.object({
    keyInsights: z.array(z.string()),
    challengesIdentified: z.array(
      z.object({
        challenge: z.string(),
        relatedPatterns: z.array(z.string()),
        suggestedActions: z.array(z.string()),
      })
    ),
    growthOpportunities: z.array(
      z.object({
        area: z.string(),
        evidence: z.array(z.string()),
        recommendations: z.array(z.string()),
      })
    ),
    actionableSteps: z.array(z.string()),
  }),

  // Temporal Patterns
  temporalPatterns: z.object({
    timeBasedPatterns: z.array(
      z.object({
        pattern: z.string(),
        frequency: z.number(),
        significance: z.string(),
      })
    ),
    monthlyProgression: z.string(),
    dateCorrelations: z.array(
      z.object({
        date: z.string(),
        significance: z.string(),
        patterns: z.array(z.string()),
      })
    ),
  }),
});

export const generateDreamTitle = internalAction({
  args: {
    dreamId: v.id("dreams"),
    dreamDate: v.string(),
    details: v.string(),
    emotions: v.array(v.id("emotions")),
  },
  async handler(ctx, args) {
    const emotions = await ctx.runQuery(
      // @ts-ignore
      internal.queries.emotions.getEmotionsByIdsInternal,
      { ids: args.emotions }
    );

    const emotionNames =
      emotions
        .map((e) => e?.name)
        .filter(Boolean)
        .join(", ") || "No specific emotions were recorded.";

    const userPrompt = `Details: ${args.details} | Emotions: ${emotionNames}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a dream analyis expert. Given the following details, and emotions associated with the dream, write a short creative title for the dream. Do not return special characters, only letters",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.8,
    });

    const title = response.choices[0]?.message.content;

    if (!title) {
      throw new Error("Failed to generate title");
    }

    // Create base slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, "-");

    // Check for existing dreams with same date and similar slug
    const existingDreams = await ctx.runQuery(
      internal.queries.dreams.getDreamsByDateAndSlugPattern,
      {
        date: args.dreamDate,
        slugPattern: baseSlug,
      }
    );

    // If we find dreams with similar slugs, append a number
    let finalSlug = baseSlug;
    if (existingDreams.length > 0) {
      // Escape special characters in baseSlug for RegExp
      const escapedBaseSlug = baseSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Find the highest number suffix used
      const suffixNumbers = existingDreams
        .map((dream) => {
          if (!dream.slug) return 0;
          const match = dream.slug.match(
            new RegExp(`^${escapedBaseSlug}(?:-([0-9]+))?$`)
          );
          return match ? parseInt(match[1] || "0") : 0;
        })
        .filter((num) => !isNaN(num));

      // If we found any valid numbers, increment the highest one
      // If no numbers found, start with 1
      const highestNumber =
        suffixNumbers.length > 0 ? Math.max(...suffixNumbers) : 0;

      finalSlug = `${baseSlug}-${highestNumber + 1}`;
    }

    // Update the dream with both title and slug
    await ctx.runMutation(internal.mutations.dreams.updateDreamInternal, {
      id: args.dreamId,
      title: title,
      slug: finalSlug,
    });
  },
});

export const generateDreamThemes = internalAction({
  args: {
    dreamId: v.id("dreams"),
    details: v.string(),
    emotions: v.array(v.id("emotions")),
  },
  async handler(ctx, args) {
    const emotions = await ctx.runQuery(
      internal.queries.emotions.getEmotionsByIdsInternal,
      { ids: args.emotions }
    );

    const emotionNames =
      emotions
        .map((e) => e?.name)
        .filter(Boolean)
        .join(", ") || "No specific emotions were recorded.";

    const userPrompt = `Details: ${args.details} | Emotions: ${emotionNames}`;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a dream analyis expert. Given the following details, and emotions associated with the dream, determine the themes present in the dream. 2-3 themes maximum. Do not return special characters, only letters",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(Themes, "themes"),
      temperature: 0.8,
    });

    let themes = response.choices[0].message.parsed?.themes;

    if (!themes || themes.length === 0) {
      throw new Error("Failed to generate themes");
    }

    if (themes.length > 3) {
      themes = themes.slice(0, 3);
    }
  },
});

export const generateAnalysis = internalAction({
  args: {
    dreamId: v.id("dreams"),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const { dreamId, userId } = args;
    const dream = await ctx.runQuery(
      // @ts-ignore
      internal.queries.dreams.getDreamByIdInternal,
      {
        id: dreamId,
        userId: args.userId,
      }
    );

    const emotions = await ctx.runQuery(
      internal.queries.emotions.getEmotionsByDreamIdInternal,
      {
        id: dreamId,
      }
    );

    const role = await ctx.runQuery(
      internal.queries.roles.getRoleByIdInternal,
      {
        id: dream.role as Id<"roles">,
      }
    );

    const formattedEmotions = emotions.map((e) => e?.name).join(", ");
    const people = dream.people?.join(", ") || "N/A";
    const places = dream.places?.join(", ") || "N/A";
    const things = dream.things?.join(", ") || "N/A";
    const roleDescription = role?.name || "Unknown Role";
    const details = dream.details;
    const isRecurring = dream.isRecurring;
    const isLucid = dream.isLucid;

    const userPrompt = `
      Dream Details:
      --------------
      "${details}"

      Emotions Experienced: ${formattedEmotions},
      Role in the dream: ${roleDescription},
      People Involved: ${people},
      Places Involved: ${places},
      Important Symbols or Things: ${things}
      ${isRecurring ? "This is a recurring dream" : ""}
      ${isLucid ? "This is a lucid dream" : ""}
    `;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(Analysis, "analysis"),
    });

    const analysis = response.choices[0].message.parsed;

    if (!analysis) {
      throw new Error("Failed to generate analysis");
    }

    const analysisId = await ctx.runMutation(
      internal.mutations.analysis.addNewAnalysis,
      {
        dreamId,
        userId,
        analysis,
      }
    );

    // generate image
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: analysisImagePrompt(userPrompt),
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        throw new Error("No image generated");
      }
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      const storageId = await ctx.storage.store(imageBlob);

      await ctx.runMutation(internal.mutations.analysis.addAnalysisImage, {
        analysisId: analysisId,
        storageId: storageId,
      });
    } catch (err) {
      console.error("Error generating analysis image:", err);
      throw err;
    }
  },
});

export const generateAnalysisFree = internalAction({
  args: {
    interpretationId: v.id("freeInterpretations"),
  },
  async handler(ctx, args) {
    const { interpretationId } = args;

    const interpretation = await ctx.runQuery(
      internal.queries.interpretations.getInterpretationByIdInternal,
      {
        interpretationId,
      }
    );

    if (!interpretation) {
      throw new Error("Interpretation not found");
    }

    const userPrompt = `
      Dream Details:
      --------------
      "${interpretation.dreamText}"
    `;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(Analysis, "analysis"),
    });

    const analysis = response.choices[0].message.parsed;

    if (!analysis) {
      throw new Error("Failed to generate analysis");
    }

    await ctx.runMutation(
      internal.mutations.interpretations.patchInterpretation,
      {
        interpretationId,
        analysis,
      }
    );
  },
});

export const generateDreamThemesFree = internalAction({
  args: {
    source: v.union(
      v.object({
        type: v.literal("interpretation"),
        sourceType: v.union(v.literal("reddit"), v.literal("free")),
        id: v.union(v.id("redditPosts"), v.id("freeInterpretations")),
      }),
      v.object({
        type: v.literal("dream"),
        id: v.id("dreams"),
      })
    ),
    details: v.string(),
  },
  async handler(ctx, args) {
    const { source, details } = args;

    const themeCategories = await ctx.runQuery(
      internal.queries.themeCategories.getAllThemeCategoriesInternal
    );

    const themeCategoriesString = themeCategories
      .map(
        (category) =>
          `${category.name}: ${category.description} - Examples: ${category.examples.join(
            ", "
          )}`
      )
      .join("\n");

    const userPrompt = `Details: ${details}`;
    const systemPrompt = `You are a dream analysis expert. Given the following dream details, identify key themes and symbols, categorizing them into these specific predetermined categories:

    Categories:
    ${themeCategoriesString}

    For each theme or symbol identified:
    1. ALWAYS extract the universal archetype, not the specific instance
    2. Keep names VERY concise (maximum 30 characters)
    3. Use simple, clear terms that capture the core meaning
    4. Assign to the most appropriate predetermined category
    5. Provide a confidence score (0.0-1.0)
    6. Limit to 2-3 most prominent themes and 2-3 most significant symbols

    Examples of concise naming:
    TOO LONG -> CONCISE
    - "struggles with mental health" -> "mental health"
    - "feelings of isolation and sadness" -> "isolation"
    - "school dynamics and peer interactions" -> "peer dynamics"
    - "difficulty with authority figures" -> "authority conflict"

    Key Rules:
    - Analyze each dream independently
    - Use universal/archetypal interpretations
    - Keep names brief but meaningful
    - Emotional themes ONLY go under "emotional_states"
    - Relationship dynamics ONLY go under "relationships_social"
    - Never mix categories (e.g., emotions should not be under "physical_elements")`;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(ThemesAndSymbols, "themesAndSymbols"),
      temperature: 0.8,
    });

    let themes = response.choices[0].message.parsed?.themes;
    let symbols = response.choices[0].message.parsed?.symbols;

    if (!themes || themes.length === 0 || !symbols || symbols.length === 0) {
      throw new Error("Failed to generate themes or symbols");
    }

    // match the category to the theme and store the ID of the category

    for (const symbol of symbols) {
      const categoryId = themeCategories.find(
        (category) => category.name === symbol.category
      )?._id;

      if (!categoryId) {
        throw new Error(`Category not found: ${symbol.category}`);
      }
      await ctx.runMutation(
        internal.mutations.commonElements.upsertDreamElement,
        {
          name: symbol.name.toLowerCase(),
          type: "symbol",
          category: categoryId,
          confidence: symbol.confidence,
          ...(source.type === "interpretation"
            ? source.sourceType === "reddit"
              ? { redditPostId: source.id as Id<"redditPosts"> }
              : { freeInterpretationId: source.id as Id<"freeInterpretations"> }
            : { dreamId: source.id }),
        }
      );
    }

    for (const theme of themes) {
      const categoryId = themeCategories.find(
        (category) => category.name === theme.category
      )?._id;

      if (!categoryId) {
        throw new Error(`Category not found: ${theme.category}`);
      }
      await ctx.runMutation(
        internal.mutations.commonElements.upsertDreamElement,
        {
          name: theme.name.toLowerCase(),
          type: "theme",
          category: categoryId,
          confidence: theme.confidence,
          ...(source.type === "interpretation"
            ? source.sourceType === "reddit"
              ? { redditPostId: source.id as Id<"redditPosts"> }
              : { freeInterpretationId: source.id as Id<"freeInterpretations"> }
            : { dreamId: source.id }),
        }
      );
    }

    if (source.type === "dream") {
      await ctx.runMutation(internal.mutations.dreams.updateDreamInternal, {
        id: source.id,
        themes: themes.map((theme) => theme.name),
        symbols: symbols.map((symbol) => symbol.name),
      });
    }
  },
});

export const regenerateAnalysisImage = action({
  args: {
    analysisId: v.id("analysis"),
    dreamId: v.id("dreams"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const dream = await ctx.runQuery(
      internal.queries.dreams.getDreamByIdInternal,
      {
        id: args.dreamId,
        userId: userId,
      }
    );

    if (!dream) {
      throw new Error("Dream not found");
    }

    const emotions = await ctx.runQuery(
      internal.queries.emotions.getEmotionsByDreamIdInternal,
      {
        id: dream._id,
      }
    );

    const role = await ctx.runQuery(
      internal.queries.roles.getRoleByIdInternal,
      {
        id: dream.role as Id<"roles">,
      }
    );

    const formattedEmotions = emotions.map((e) => e?.name).join(", ");
    const people = dream.people?.join(", ") || "N/A";
    const places = dream.places?.join(", ") || "N/A";
    const things = dream.things?.join(", ") || "N/A";
    const roleDescription = role?.name || "Unknown Role";
    const details = dream.details;

    const userPrompt = `
      Dream Details:
      --------------
      "${details}"

      Emotions Experienced: ${formattedEmotions},
      Role in the dream: ${roleDescription},
      People Involved: ${people},
      Places Involved: ${places},
      Important Symbols or Things: ${things}
    `;

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: analysisImagePrompt(userPrompt),
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        throw new Error("No image generated");
      }
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      const storageId = await ctx.storage.store(imageBlob);

      await ctx.runMutation(internal.mutations.analysis.addAnalysisImage, {
        analysisId: args.analysisId,
        storageId: storageId,
      });
    } catch (err) {
      console.error("Error generating analysis image:", err);
    }
  },
});

export const generateInsight = internalAction({
  args: {
    dreams: v.array(
      v.object({
        _id: v.id("dreams"),
        _creationTime: v.optional(v.number()),
        isPublic: v.optional(v.boolean()),
        title: v.optional(v.string()),
        userId: v.string(),
        date: v.string(),
        emotions: v.array(v.id("emotions")),
        role: v.optional(v.id("roles")),
        people: v.optional(v.array(v.string())),
        places: v.optional(v.array(v.string())),
        things: v.optional(v.array(v.string())),
        themes: v.optional(v.array(v.string())),
        symbols: v.optional(v.array(v.string())),
        details: v.string(),
      })
    ),
    userId: v.string(),
    monthYear: v.string(),
  },
  async handler(ctx, args) {
    try {
      const formattedDreams = await Promise.all(
        args.dreams.map(async (dream) => {
          const {
            date,
            people = [],
            places = [],
            things = [],
            themes = [],
            symbols = [],
            details,
          } = dream;

          // Fetch emotions and role details for the dream
          const emotions = await ctx.runQuery(
            internal.queries.emotions.getEmotionsByDreamIdInternal,
            { id: dream._id }
          );

          const role = await ctx.runQuery(
            // @ts-ignore
            internal.queries.roles.getRoleByIdInternal,
            {
              id: dream.role as Id<"roles">,
            }
          );

          return `
          Dream Date: ${date}
          Role: ${role?.name || "N/A"}
          Emotions: ${emotions.length ? emotions.map((e) => e?.name).join(", ") : "None"}
          People: ${people.length ? people.join(", ") : "None"}
          Places: ${places.length ? places.join(", ") : "None"}
          Things: ${things.length ? things.join(", ") : "None"}
          Themes: ${themes.length ? themes.join(", ") : "None"}
          Symbols: ${symbols.length ? symbols.join(", ") : "None"}
          Details: ${details}
          `;
        })
      );

      const userPrompt = `Dreams: ${formattedDreams.join("\n\n")}`;

      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        response_format: zodResponseFormat(Insight, "insight"),
      });

      const insight = response.choices[0].message.parsed;

      if (!insight) {
        throw new Error("Failed to generate insight");
      }

      // Save the generated insight
      await ctx.runMutation(internal.mutations.insights.addNewInsight, {
        userId: args.userId,
        monthYear: args.monthYear,
        insight,
      });
    } catch (error) {
      // Refund credits if anything fails
      await ctx.runMutation(internal.users.updateUserCredits, {
        userId: args.userId,
        amount: CREDIT_COSTS.INSIGHT,
      });
      console.error("Failed to generate insight:", error);
      throw error;
    }
  },
});

export const generateThemeOrSymbolPageWithElement = action({
  args: {
    name: v.string(),
    type: v.union(v.literal("theme"), v.literal("symbol")),
    category: v.id("themeCategories"),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    pageId?: Id<"themePages">;
    reason?: string;
  }> => {
    try {
      // Check if element already exists
      const existingElement = await ctx.runQuery(
        internal.queries.commonElements.getCommonElementByName,
        { name: args.name }
      );

      if (existingElement) {
        console.warn(
          `[GenerateThemeOrSymbolPageWithElement]: Element "${args.category}" already exists, skipping`
        );
        return { success: false, reason: "Element already exists" };
      }

      // Create element
      const element = await ctx.runMutation(
        internal.mutations.commonElements.createCommonElement,
        {
          name: args.name,
          type: args.type,
          category: args.category,
        }
      );

      if (!element) {
        throw new Error("Failed to create element");
      }

      // Check if page already exists
      const existingPage = await ctx.runQuery(
        internal.queries.themePages.getThemePageByName,
        { name: args.name }
      );

      if (existingPage) {
        console.warn(
          `[GenerateThemeOrSymbolPageWithElement]: Page for "${args.name}" already exists, skipping`
        );
        return { success: false, reason: "Page already exists" };
      }

      const systemPrompt = getSystemPromptForThemePage(args.name, args.type);

      // Generate page content
      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Generate detailed content for ${args.name} ${args.type === "symbol" ? "as a dream symbol" : "dreams"}.`,
          },
        ],
        response_format: zodResponseFormat(ThemePage, "themePage"),
        temperature: 0.7,
      });

      const page = response.choices[0].message.parsed;

      if (!page) {
        throw new Error(`No page content generated for ${args.name}`);
      }

      // Create the page first
      const result = await ctx.runMutation(
        internal.mutations.themePages.createThemePage,
        {
          name: args.name,
          seo_slug: args.name.toLowerCase(),
          seo_description:
            page.seo_description ||
            `Learn about ${args.name} ${args.type === "symbol" ? "as a dream symbol" : "dreams"} and their meaning`,
          content: page.content,
          summary: page.summary,
          commonSymbols: page.commonSymbols || [],
          psychologicalMeaning: page.psychologicalMeaning || "",
          culturalContext: page.culturalContext || "",
          commonScenarios: page.commonScenarios || [],
          tips: page.tips || "",
          updatedAt: Date.now(),
          isPublished: false,
          category: args.category,
          type: args.type,
        }
      );

      if (!result) {
        throw new Error("Failed to create theme page");
      }

      // Generate and store image
      const imagePrompt = `Create a dreamlike artistic illustration without any text, words, letters, numbers, or writing of any kind. Theme: "${args.name}" in dreams.

        Key requirements:
        - NO TEXT OR WRITING OF ANY KIND in the image
        - Surreal and symbolic imagery based on: ${page.summary}
        - Soft, atmospheric colors with ethereal lighting
        - Artistic and metaphorical composition
        - Mystical and thought-provoking mood
        - Professional and elegant style
        - Avoid scary or disturbing elements
        - Incorporate these symbols subtly: ${page.commonSymbols.join(", ")}

        Style reference: Think of a blend between surrealist art and ethereal fantasy illustration, focusing purely on imagery without any textual elements.`;

      // Generate image using DALL-E 3
      try {
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        });

        const imageUrl = imageResponse.data[0]?.url;

        if (imageUrl) {
          // Fetch and store the image
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const storageId = await ctx.storage.store(blob);

          // Update the theme page with the image
          await ctx.runMutation(
            internal.mutations.themePages.updateThemePageImage,
            {
              id: result,
              storageId,
            }
          );
        }
      } catch (error: any) {
        console.error("[GenerateThemeOrSymbolPageWithElement]: Error:", error);
      }

      return { success: true, pageId: result };
    } catch (error: any) {
      console.error("[GenerateThemeOrSymbolPageWithElement]: Error:", error);
      throw error;
    }
  },
});

export const regenerateThemePageImageAction = action({
  args: {
    pageId: v.id("themePages"),
  },
  handler: async (ctx, args) => {
    const page = await ctx.runQuery(
      internal.queries.themePages.getThemePageById,
      {
        id: args.pageId,
      }
    );

    if (!page) {
      throw new Error("Theme page not found");
    }

    // Delete old image if it exists
    if (page.storageId) {
      try {
        await ctx.storage.delete(page.storageId);
      } catch (error) {
        console.error(
          "[RegenerateThemePageImage]: Failed to delete old image:",
          error
        );
        // Continue with regeneration even if deletion fails
      }
    }

    const imagePrompt = `Create a dreamlike artistic illustration without any text, words, letters, numbers, or writing of any kind. Theme: "${page.name}" in dreams.

Key requirements:
- NO TEXT OR WRITING OF ANY KIND in the image
- Surreal and symbolic imagery based on: ${page.summary}
- Soft, atmospheric colors with ethereal lighting
- Artistic and metaphorical composition
- Mystical and thought-provoking mood
- Professional and elegant style
- Avoid scary or disturbing elements
- Incorporate these symbols subtly: ${page.commonSymbols.join(", ")}

Style reference: Think of a blend between surrealist art and ethereal fantasy illustration, focusing purely on imagery without any textual elements.`;

    try {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
      });

      const imageUrl = imageResponse.data[0]?.url;

      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const storageId = await ctx.storage.store(blob);

        await ctx.runMutation(
          internal.mutations.themePages.updateThemePageImage,
          {
            id: args.pageId,
            storageId,
          }
        );

        return { success: true };
      }
    } catch (error: any) {
      console.error("[RegenerateThemePageImage]: Error:", error);
      throw error;
    }
  },
});
