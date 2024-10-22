import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
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
});
