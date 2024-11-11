import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    credits: v.optional(v.number()),
    subscriptionId: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    endsOn: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_subscriptionId", ["subscriptionId"]),

  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    expires: v.number(),
  }).index("by_key", ["key"]),

  emotions: defineTable({
    name: v.string(),
    emoji: v.string(),
  }),

  roles: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  dreams: defineTable({
    userId: v.string(),
    isPublic: v.optional(v.boolean()),
    date: v.string(),
    emotions: v.array(v.id("emotions")),
    role: v.optional(v.id("roles")),
    people: v.optional(v.array(v.string())),
    places: v.optional(v.array(v.string())),
    things: v.optional(v.array(v.string())),
    themes: v.optional(v.array(v.string())),
    title: v.optional(v.string()),
    details: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_date", ["userId", "date"]),

  analysis: defineTable({
    dreamId: v.string(),
    userId: v.string(),
    summary: v.string(),
    emotionalBreakdown: v.string(),
    symbolicInterpretation: v.string(),
    underlyingMessage: v.string(),
    actionableTakeaway: v.string(),
  })
    .index("by_dreamId", ["dreamId"])
    .index("by_userId", ["userId"]),

  deleteAccountFeedback: defineTable({
    reasons: v.optional(v.array(v.string())),
    feedback: v.optional(v.string()),
  }),

  insights: defineTable({
    userId: v.string(),
    monthYear: v.string(),
    insight: v.object({
      summary: v.string(),
      // Emotional Analysis (leveraging the emotion tags with emojis)
      emotionalInsights: v.object({
        dominantEmotions: v.array(
          v.object({
            emotion: v.string(),
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
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_monthYear", ["userId", "monthYear"]),
});
