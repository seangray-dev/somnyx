import { v } from "convex/values";

import { internalMutation, mutation } from "../_generated/server";

export const send = mutation({
  args: {
    body: v.string(),
    author: v.string(),
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert user message
    await ctx.db.insert("messages", {
      body: args.body,
      author: args.author,
      conversationId: args.conversationId,
      isComplete: true,
      createdAt: Date.now(),
    });

    // Create AI message placeholder
    const messageId = await ctx.db.insert("messages", {
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

    return { messages, messageId };
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
