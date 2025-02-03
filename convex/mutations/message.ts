import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // in milliseconds

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

    // Schedule deletion for user message
    await ctx.scheduler.runAfter(
      TWENTY_FOUR_HOURS,
      internal.mutations.message.destruct,
      {
        messageId: userMessageId,
      }
    );

    // Create AI message placeholder
    const aiMessageId = await ctx.db.insert("messages", {
      body: "...",
      author: "AI",
      conversationId: args.conversationId,
      isComplete: false,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(
      TWENTY_FOUR_HOURS,
      internal.mutations.message.destruct,
      {
        messageId: aiMessageId,
      }
    );

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
    await ctx.db.delete(messageId);
  },
});
