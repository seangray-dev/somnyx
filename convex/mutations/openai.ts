import { v } from "convex/values";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";
import { SYSTEM_PROMPT, getSystemPromptForThemePage } from "../util";
import { ThemePage } from "../zodSchemas";

const openai = new OpenAI();

const Analysis = z.object({
  summary: z.string(),
  emotionalBreakdown: z.string(),
  symbolicInterpretation: z.string(),
  underlyingMessage: z.string(),
  actionableTakeaway: z.string(),
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

    await ctx.runMutation(internal.mutations.dreams.updateDreamInternal, {
      id: args.dreamId,
      title: title,
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

    await ctx.runMutation(internal.mutations.dreams.updateDreamInternal, {
      id: args.dreamId,
      themes,
    });
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

    await ctx.runMutation(internal.mutations.analysis.addNewAnalysis, {
      dreamId,
      userId,
      analysis,
    });
  },
});

export const generateInsight = internalAction({
  // TODO: Refactor the arguments to reduce payload (_id, _creationTime, title, isPublic, userId)
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
        details: v.string(),
      })
    ),
    userId: v.string(),
    monthYear: v.string(),
  },
  async handler(ctx, args) {
    const formattedDreams = await Promise.all(
      args.dreams.map(async (dream) => {
        const {
          date,
          emotions: emotionIds,
          role: roleId,
          people = [],
          places = [],
          things = [],
          themes = [],
          details,
        } = dream;

        // Fetch emotions and role details for the dream
        const emotions = await ctx.runQuery(
          internal.queries.emotions.getEmotionsByDreamIdInternal,
          { id: dream._id }
        );

        const role = await ctx.runQuery(
          internal.queries.roles.getRoleByIdInternal,
          {
            id: dream.role as Id<"roles">,
          }
        );

        // Format dream into a string for the prompt
        return `
        Dream Date: ${date}
        Role: ${role?.name || "N/A"}
        Emotions: ${
          emotions.length ? emotions.map((e) => e?.name).join(", ") : "None"
        }
        People: ${people.length ? people.join(", ") : "None"}
        Places: ${places.length ? places.join(", ") : "None"}
        Things: ${things.length ? things.join(", ") : "None"}
        Themes: ${themes.length ? themes.join(", ") : "None"}
        Details: ${details}
        `;
      })
    );

    const userPrompt = `
      Dreams: ${formattedDreams.join("\n\n")}
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
  },
});

// export const determineDreamThemesFree = internalAction({
//   args: {
//     details: v.string(),
//   },
//   async handler(ctx, args) {
//     const userPrompt = `Details: ${args.details}`;

//     const response = await openai.beta.chat.completions.parse({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: SYSTEM_PROMPT_THEMES,
//         },
//         {
//           role: "user",
//           content: userPrompt,
//         },
//       ],
//       response_format: zodResponseFormat(CommonElements, "commonElements"),
//       temperature: 0.1,
//     });

//     console.info(response);

//     try {
//       const commonElements = response.choices[0].message.parsed;

//       if (!commonElements) {
//         console.warn("No common elements found in response");
//         return;
//       }

//       const { themes, symbols } = commonElements;

//       if (!themes || !symbols) {
//         console.warn("No themes or symbols found in response");
//         return;
//       }

//       for (const symbol of symbols) {
//         if (symbol.confidence >= 0.7) {
//           await ctx.runMutation(internal.mutations.commonElements.upsertDreamElement, {
//             name: symbol.name.toLowerCase(),
//             type: "symbol",
//             category: symbol.category.toLowerCase(),
//             confidence: symbol.confidence,
//           });
//         }
//       }
//       for (const theme of themes) {
//         if (theme.confidence >= 0.7) {
//           await ctx.runMutation(internal.mutations.commonElements.upsertDreamElement, {
//               name: theme.name.toLowerCase(),
//               type: "theme",
//               category: theme.category.toLowerCase(),
//               confidence: theme.confidence,
//             });
//           }
//         }

//       return;
//     } catch (error) {
//       console.error(error);
//       throw new Error("Failed to generate common elements");
//     }
//   },
// });

export const initThemePages = internalAction({
  async handler(ctx) {
    try {
      const commonElements = await ctx.runQuery(
        // @ts-ignore
        internal.queries.commonElements.getAllCommonElements
      );

      // Better error handling for empty results
      if (!commonElements || commonElements.length === 0) {
        console.error("[InitThemePages]: No common elements found");
        return;
      }

      for (const element of commonElements) {
        try {
          // Check if theme page already exists
          const existingPage = await ctx.runQuery(
            internal.queries.themePages.getThemePageByName,
            { name: element.name }
          );

          if (existingPage) {
            console.warn(
              `[InitThemePages]: Theme page for "${element.name}" already exists, skipping`
            );
            continue;
          }

          const systemPrompt = getSystemPromptForThemePage(element.name);

          const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: `Generate detailed content for ${element.name} dreams.`,
              },
            ],
            response_format: zodResponseFormat(ThemePage, "themePage"),
            temperature: 0.7,
          });

          const page = response.choices[0].message.parsed;

          if (!page) {
            throw new Error(`No page content generated for ${element.name}`);
          }

          // Validate required fields
          if (!page.seo_title || !page.content || !page.summary) {
            throw new Error(
              `Missing required fields in generated content for ${element.name}`
            );
          }

          await ctx.runMutation(internal.mutations.themePages.createThemePage, {
            name: element.name,
            seo_title: page.seo_title,
            seo_slug: element.name.toLowerCase(),
            seo_description:
              page.seo_description ||
              `Learn about ${element.name} dreams and their meaning`,
            content: page.content,
            summary: page.summary,
            commonSymbols: page.commonSymbols || [],
            psychologicalMeaning: page.psychologicalMeaning || "",
            culturalContext: page.culturalContext || "",
            commonScenarios: page.commonScenarios || [],
            tips: page.tips || "",
            updatedAt: Date.now(),
          });

          // Add delay to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(
            `[InitThemePages]: Error processing ${element.name}:`,
            error
          );
          // Continue with next element instead of stopping completely
          continue;
        }
      }

      return { success: true };
    } catch (error) {
      console.error("[InitThemePages]: Fatal error:", error);
      throw error;
    }
  },
});
