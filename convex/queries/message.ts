import { v } from "convex/values";

import { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";

export const list = query({
  args: { conversationId: v.string() },
  handler: async (ctx, { conversationId }): Promise<Doc<"messages">[]> => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(2);
    return messages.reverse();
  },
});
