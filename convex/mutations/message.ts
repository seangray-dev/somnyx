import { v } from "convex/values";

import { internalMutation, mutation } from "../_generated/server";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // in milliseconds

export const cleanupExpiredMessages = internalMutation({
  handler: async (ctx) => {
    // Get all messages older than 24 hours
    const expiredMessages = await ctx.db
      .query("messages")
      .filter((q) => q.lt(q.field("createdAt"), Date.now() - TWENTY_FOUR_HOURS))
      .collect();

    // Group messages by conversation for efficient cleanup
    const conversationIds = new Set(
      expiredMessages.map((message) => message.conversationId)
    );

    // Delete all expired messages in batches to avoid timeout
    for (const message of expiredMessages) {
      await ctx.db.delete(message._id);
    }

    console.log(
      `Cleaned up ${expiredMessages.length} expired messages from ${conversationIds.size} conversations`
    );

    return {
      deletedCount: expiredMessages.length,
      conversationCount: conversationIds.size,
    };
  },
});

export const send = mutation({
  args: {
    body: v.string(),
    author: v.string(),
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert user message
    const userMessageId = await ctx.db.insert("messages", {
      body: args.body,
      author: args.author,
      conversationId: args.conversationId,
      isComplete: true,
      createdAt: Date.now(),
    });

    // Create AI message placeholder
    const aiMessageId = await ctx.db.insert("messages", {
      body: "...",
      author: "AI",
      conversationId: args.conversationId,
      isComplete: false,
      createdAt: Date.now(),
    });

    // Get conversation messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    return { messages, messageId: aiMessageId };
  },
});

export const update = internalMutation({
  args: {
    messageId: v.id("messages"),
    body: v.string(),
    isComplete: v.boolean(),
  },
  handler: async (ctx, { messageId, body, isComplete }) => {
    await ctx.db.patch(messageId, { body, isComplete });
  },
});

export const destruct = internalMutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.db.get(messageId);
    if (!message) return;

    await ctx.db.delete(messageId);
  },
});
