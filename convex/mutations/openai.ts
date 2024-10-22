import { v } from "convex/values";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

const openai = new OpenAI();

const Analysis = z.object({
  summary: z.string(),
  emotionalBreakdown: z.string(),
  symbolicInterpretation: z.string(),
  underlyingMessage: z.string(),
  actionableTakeaway: z.string(),
});

const Themes = z.object({
  themes: z.array(z.string()),
});

const DreamTitle = z.object({
  title: z.string().max(20),
});

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
          content:
            "You are a dream analyis expert. Given the following details, and emotions associated with the dream, write a short creative title for the dream. Do not return special characters, only letters",
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

export const generateDreamThemes = internalAction({
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

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a dream analyis expert. Given the following details, and emotions associated with the dream, determine the themes present in the dream. 2-3 themes maximum. Do not return special characters, only letters",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(Themes, "themes"),
      temperature: 0.8,
    });

    let themes = response.choices[0].message.parsed?.themes;

    if (!themes || themes.length === 0) {
      throw new Error("Failed to generate themes");
    }

    if (themes.length > 3) {
      themes = themes.slice(0, 3);
    }

    await ctx.runMutation(internal.mutations.dreams.updateDreamInternal, {
      id: args.dreamId,
      themes,
    });
  },
});

export const generateAnalysis = internalAction({
  args: {
    dreamId: v.id("dreams"),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const { dreamId, userId } = args;
    const dream = await ctx.runQuery(
      internal.queries.dreams.getDreamByIdInternal,
      {
        id: dreamId,
        userId: args.userId,
      }
    );

    const emotions = await ctx.runQuery(
      internal.queries.emotions.getEmotionsByDreamIdInternal,
      {
        id: dreamId,
      }
    );

    const role = await ctx.runQuery(
      internal.queries.roles.getRoleByIdInternal,
      {
        id: dream.role as Id<"roles">,
      }
    );

    const formattedEmotions = emotions.map((e) => e?.name).join(", ");
    const people = dream.people?.join(", ") || "N/A";
    const places = dream.places?.join(", ") || "N/A";
    const things = dream.things?.join(", ") || "N/A";
    const roleDescription = role?.name || "Unknown Role";
    const details = dream.details;

    const userPrompt = `
      Dream Details:
      --------------
      "${details}"

      Emotions Experienced: ${formattedEmotions},
      Role in the dream: ${roleDescription},
      People Involved: ${people},
      Places Involved: ${places},
      Important Symbols or Things: ${things}
    `;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert Dream Interpreter, you are expected to assist users in delving into the symbolic language of their dreams. You should possess a comprehensive understanding of prominent psychological and cross-cultural theories of dream interpretation, as well as the potential emotional and situational triggers of common dream motifs. 
          
          Precision in extracting details of the dream scenario, the dreamer's feeling during and after the dream, and the dream symbols are all crucial elements. Be sensitive to the user's emotions and psychological state, providing interpretations that are empathetic, insightful, and respectful.
          
          Your ultimate goal is to guide users towards a broader consciousness of their subconscious, aiding them in illuminating possible hidden messages, emotions, or situations reflected through their dreams. Remember, as a Dream Interpreter, you are a guide to self-discovery, unfolding the symbolic narratives of the dreamers' night-time landscapes.`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(Analysis, "analysis"),
    });

    const analysis = response.choices[0].message.parsed;

    if (!analysis) {
      throw new Error("Failed to generate analysis");
    }

    await ctx.runMutation(internal.mutations.analysis.addNewAnalysis, {
      dreamId,
      userId,
      analysis,
    });
  },
});
