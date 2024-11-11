import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalMutation, mutation } from "../_generated/server";
import { getMyUser } from "../users";
import { CREDIT_COSTS } from "../util";

export const generateInsight = mutation({
  args: { monthYear: v.string() },
  handler: async (ctx, args): Promise<Id<"_scheduled_functions">> => {
    const user = await getMyUser(ctx, {});

    if (!user) throw new Error("You must be logged in.");

    await ctx.runMutation(internal.users.consumeCredits, {
      userId: user.userId,
      cost: CREDIT_COSTS.INSIGHT,
    });

    const dreams = await ctx.runQuery(
      internal.queries.dreams.getDreamsByMonth,
      {
        userId: user.userId,
        monthYear: args.monthYear,
      }
    );

    const functionId = await ctx.scheduler.runAfter(
      0,
      internal.mutations.openai.generateInsight,
      {
        dreams,
        userId: user.userId,
        monthYear: args.monthYear,
      }
    );

    return functionId;
  },
});

export const addNewInsight = internalMutation({
  args: {
    userId: v.string(),
    monthYear: v.string(),
    insight: v.object({
      summary: v.string(),
      // Emotional Analysis (leveraging the emotion tags with emojis)
      emotionalInsights: v.object({
        dominantEmotions: v.array(
          v.object({
            emotion: v.string(),
            // emoji: v.string(),
            frequency: v.number(),
            percentage: v.number(),
            associatedThemes: v.array(v.string()),
          })
        ),
        emotionalTrends: v.object({
          weeklyProgression: v.array(
            v.object({
              week: v.string(),
              primaryEmotions: v.array(v.string()),
              trend: v.string(),
            })
          ),
          insights: v.string(),
        }),
        emotionalTriggers: v.array(
          v.object({
            trigger: v.string(),
            associatedEmotions: v.array(v.string()),
            frequency: v.number(),
          })
        ),
      }),

      // Role Analysis (based on user-selected roles)
      rolePatterns: v.object({
        primaryRoles: v.array(
          v.object({
            role: v.string(),
            frequency: v.number(),
            description: v.string(),
            associatedEmotions: v.array(v.string()),
            significantPatterns: v.string(),
          })
        ),
        roleInsights: v.string(),
      }),

      // Social Dynamics (from people field)
      socialDynamics: v.object({
        recurringCharacters: v.array(
          v.object({
            name: v.string(),
            frequency: v.number(),
            associatedEmotions: v.array(v.string()),
            contextsAppearing: v.array(v.string()),
          })
        ),
        relationshipPatterns: v.string(),
        socialThemes: v.array(v.string()),
      }),

      // Setting Analysis (from places field)
      settingAnalysis: v.object({
        commonLocations: v.array(
          v.object({
            place: v.string(),
            frequency: v.number(),
            associatedEmotions: v.array(v.string()),
            symbolism: v.string(),
          })
        ),
        environmentalPatterns: v.string(),
        settingTransitions: v.string(), // How settings change within/across dreams
      }),

      // Symbol Analysis (from things field)
      symbolism: v.object({
        recurringSymbols: v.array(
          v.object({
            symbol: v.string(),
            frequency: v.number(),
            contexts: v.array(v.string()),
            interpretation: v.string(),
            associatedEmotions: v.array(v.string()),
          })
        ),
        symbolPatterns: v.string(),
        uniqueSymbols: v.array(v.string()), // One-off but significant symbols
      }),

      // Thematic Analysis (derived from all fields)
      thematicAnalysis: v.object({
        majorThemes: v.array(
          v.object({
            theme: v.string(),
            frequency: v.number(),
            relatedSymbols: v.array(v.string()),
            relatedEmotions: v.array(v.string()),
            interpretation: v.string(),
          })
        ),
        themeProgression: v.string(),
        recurrentPatterns: v.array(v.string()),
      }),

      // Personal Growth Insights
      personalGrowth: v.object({
        keyInsights: v.array(v.string()),
        challengesIdentified: v.array(
          v.object({
            challenge: v.string(),
            relatedPatterns: v.array(v.string()),
            suggestedActions: v.array(v.string()),
          })
        ),
        growthOpportunities: v.array(
          v.object({
            area: v.string(),
            evidence: v.array(v.string()),
            recommendations: v.array(v.string()),
          })
        ),
        actionableSteps: v.array(v.string()),
      }),

      // Temporal Patterns
      temporalPatterns: v.object({
        timeBasedPatterns: v.array(
          v.object({
            pattern: v.string(),
            frequency: v.number(),
            significance: v.string(),
          })
        ),
        monthlyProgression: v.string(),
        dateCorrelations: v.array(
          v.object({
            date: v.string(),
            significance: v.string(),
            patterns: v.array(v.string()),
          })
        ),
      }),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("insights", {
      userId: args.userId,
      monthYear: args.monthYear,
      insight: args.insight,
    });
  },
});
