import { v } from "convex/values";
import OpenAI from "openai";

import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

const openai = new OpenAI();

export const generateDreamTitle = internalAction({
  args: {
    dreamId: v.id("dreams"),
    details: v.string(),
  },
  async handler(ctx, args) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a dream writer. Given the following details, write a short creative title for the dream.`,
        },
        {
          role: "user",
          content: args.details,
        },
      ],
      temperature: 0.7,
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
