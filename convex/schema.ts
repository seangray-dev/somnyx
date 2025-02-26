import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    credits: v.optional(v.number()),
    isAdmin: v.optional(v.boolean()),
    adminSince: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    profileImage: v.optional(v.string()),
    onboardingCompletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  onboarding: defineTable({
    userId: v.string(),
    onboardingStep: v.number(),
    lastEmailSent: v.optional(v.string()), // Track last email type
    lastEmailDate: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_completed", ["completed"]),

  notifications: defineTable({
    userId: v.string(),
    deviceId: v.string(),
    deviceName: v.string(),
    subscription: v.object({
      endpoint: v.string(),
      expirationTime: v.optional(v.number()),
      keys: v.object({
        p256dh: v.string(),
        auth: v.string(),
      }),
      options: v.optional(
        v.object({
          applicationServerKey: v.optional(v.string()),
          userVisibleOnly: v.optional(v.boolean()),
        })
      ),
    }),
    lastActiveAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_deviceId", ["userId", "deviceId"])
    .index("by_userId_and_endpoint", ["userId", "subscription.endpoint"])
    .index("by_deviceId", ["deviceId"]),

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
    imageStorageId: v.optional(v.id("_storage")),
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

  messages: defineTable({
    body: v.string(),
    author: v.string(),
    isComplete: v.boolean(),
    conversationId: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  commonElements: defineTable({
    name: v.string(),
    count: v.number(),
    updatedAt: v.number(),
    type: v.union(v.literal("symbol"), v.literal("theme")),
    category: v.string(),
    confidence: v.number(),
    freeInterpretationIds: v.optional(v.array(v.id("freeInterpretations"))),
    dreamIds: v.optional(v.array(v.id("dreams"))),
  })
    .index("by_count", ["count"])
    .index("by_name", ["name"])
    .index("by_category", ["category"])
    .index("by_type_and_confidence", ["type", "confidence"])
    .searchIndex("search_name", {
      searchField: "name",
    }),

  themePages: defineTable({
    name: v.string(),
    seo_slug: v.string(),
    seo_description: v.string(),
    isPublished: v.optional(v.boolean()),
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
    storageId: v.optional(v.id("_storage")),
  })
    .index("by_seo_slug", ["seo_slug"])
    .searchIndex("search", {
      searchField: "name",
      filterFields: ["summary"],
    }),

  feedback: defineTable({
    type: v.union(v.literal("feedback"), v.literal("issue")),
    userId: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed"),
      v.literal("N/A")
    ),
    deviceInfo: v.optional(
      v.object({
        deviceType: v.string(),
        browser: v.string(),
        os: v.string(),
        screenResolution: v.string(),
      })
    ),
    metadata: v.optional(
      v.object({
        reportedFromBrowser: v.string(),
        reportedFromOs: v.string(),
        reportedFromScreenResolution: v.string(),
        reportedFromDeviceType: v.string(),
      })
    ),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  notificationPreferences: defineTable({
    userId: v.string(),
    dailyReminderTime: v.optional(v.number()),
    timezoneOffset: v.optional(v.number()),
    enabledTypes: v.array(v.string()),
    lastDailyReminderSent: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  emailPreferences: defineTable({
    userId: v.string(),
    dreamReminders: v.boolean(),
    lastDreamReminderSent: v.optional(v.number()),
    monthlyInsights: v.boolean(),
    newFeatures: v.boolean(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  freeInterpretations: defineTable({
    dreamText: v.string(),
    analysis: v.optional(
      v.object({
        summary: v.string(),
        emotionalBreakdown: v.string(),
        symbolicInterpretation: v.string(),
        underlyingMessage: v.string(),
        actionableTakeaway: v.string(),
      })
    ),
    isExpired: v.boolean(),
    expiresAt: v.number(),
    createdAt: v.number(),
    ipAddress: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_expiresAt", ["expiresAt"])
    .index("by_ipAddress_createdAt", ["ipAddress", "createdAt"]),
});
