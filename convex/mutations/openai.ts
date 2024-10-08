import { v } from "convex/values";
import OpenAI from "openai";

import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

const openai = new OpenAI();

export const generateDreamTitle = internalAction({
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a dream analyis expert. Given the following details, and emotions associated with the dream, write a short creative title for the dream.`,
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
