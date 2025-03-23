import { GenericId, Validator, v } from "convex/values";

import { TableNames } from "./_generated/dataModel";
import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

export const NOTIFICATION_TYPES = {
  ANALYSIS_COMPLETE: "ANALYSIS_COMPLETE",
  MONTHLY_INSIGHTS: "MONTHLY_INSIGHTS",
  DAILY_REMINDER: "DAILY_REMINDER",
  LOW_CREDITS: "LOW_CREDITS",
  INACTIVITY_REMINDER: "INACTIVITY_REMINDER",
  APP_UPDATE: "APP_UPDATE",
  STREAK_MILESTONE: "STREAK_MILESTONE",
} as const;

export function vid<TableName extends TableNames>(
  tableName: TableName
): Validator<GenericId<TableName>> {
  return v.id(tableName);
}

export function filterNullishValues<T>(
  arr: (T | null | undefined)[]
): NonNullable<T>[] {
  return arr.filter(
    (value): value is NonNullable<T> => value !== null && value !== undefined
  );
}

export async function getUserId(ctx: QueryCtx | ActionCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    console.error("No user identity found");
    return null;
  }

  return identity?.subject;
}

export function formatName(
  firstName?: string | null,
  lastName?: string | null
) {
  firstName = firstName ?? "";
  lastName = lastName ?? "";
  let combinedName = `${firstName} ${lastName}`.trim();
  if (combinedName === "") {
    combinedName = "Anonymous";
  }
  return combinedName;
}

export const CREDIT_COSTS = {
  ANALYSIS: 100,
  INSIGHT: 300,
};

export const STRIPE_PRICE_IDS = {
  insgiht: "price_1QDzJHLT8ZdHoeo7mWVgJRGe",
  dreamer: "price_1QDzKNLT8ZdHoeo7ZQ8XG7NJ",
  visionary: "price_1QDzNHLT8ZdHoeo7r36QQ9SU",
};

export const STRIPE_PRODUCTS = {
  insgiht: { priceId: "price_1QDzJHLT8ZdHoeo7mWVgJRGe", credits: 700 },
  dreamer: { priceId: "price_1QDzKNLT8ZdHoeo7ZQ8XG7NJ", credits: 3000 },
  visionary: { priceId: "price_1QDzNHLT8ZdHoeo7r36QQ9SU", credits: 5000 },
};

export const SYSTEM_PROMPT = `You are an expert Dream Interpreter, you are expected to assist users in delving into the symbolic language of their dreams. You should possess a comprehensive understanding of prominent psychological and cross-cultural theories of dream interpretation, as well as the potential emotional and situational triggers of common dream motifs. 

Precision in extracting details of the dream scenario, the dreamer's feeling during and after the dream, and the dream symbols are all crucial elements. Be sensitive to the user's emotions and psychological state, providing interpretations that are empathetic, insightful, and respectful.
          
Your ultimate goal is to guide users towards a broader consciousness of their subconscious, aiding them in illuminating possible hidden messages, emotions, or situations reflected through their dreams. Remember, as a Dream Interpreter, you are a guide to self-discovery, unfolding the symbolic narratives of the dreamers' night-time landscapes.`;

export const SYSTEM_PROMPT_SYMBOLS = `You are a literal dream scanner that extracts ONLY words that appeared in the dream text.

When someone shares a dream, respond by completing these sentences:

The exact objects or beings I see in this dream text are: [extract 2-3 main nouns]
The exact actions or events I see in this dream text are: [extract 1-2 main verbs/actions]


Remember: ONLY use words that actually appear in the dream text.`;

export const COMMON_DREAM_THEMES = [
  "chase",
  "cheating",
  "death",
  "falling",
  "flying",
  "naked",
  "snake",
  "teeth",
  "test",
];

export const COMMON_DREAM_SYMBOLS_ANIMALS = [
  "wolf",
  "bird",
  "cat",
  "dog",
  "horse",
  "butterfly",
  "lion",
  "owl",
  "spider",
  "fish",
];

export const COMMON_DREAM_SYMBOLS_ELEMENTS = [
  "fire",
  "water",
  "earth",
  "air",
  "lightning",
  "ice",
  "metal",
  "crystal",
  "smoke",
  "Lava",
];

export const getSystemPromptForThemePage = (
  name: string,
  type: "theme" | "symbol" = "theme"
) => {
  const isSymbol = type === "symbol";
  return `You are a professional dream analyst and content writer. Create engaging, well-structured content about ${name} ${
    isSymbol ? "symbols" : "dreams"
  }.

      For the main content: Write a comprehensive article about ${name} ${
        isSymbol ? "as a dream symbol" : "dreams"
      }. Include:
      - ${isSymbol ? "What this symbol represents and its significance" : "What these dreams are and why they occur"}
      - Different contexts and variations where ${isSymbol ? "this symbol appears" : "these dreams occur"}
      - The significance in daily life and personal growth
      - How it relates to our emotions and experiences
      - Research or studies about ${isSymbol ? "this symbol" : "these dreams"}
      - Expert perspectives
      Structure this as a flowing article with clear paragraphs, not separate sections.

      For psychological meaning: Provide a detailed, specific interpretation focusing on the unique aspects of ${name} ${
        isSymbol ? "as a dream symbol" : "dreams"
      } avoiding generic explanations.

      For cultural context: Include specific examples from different cultures and their unique interpretations of ${name} ${
        isSymbol ? "symbolism" : "dreams"
      }.

      For common scenarios: List 4-5 specific, detailed variations of how ${name} ${
        isSymbol ? "appears in dreams" : "dreams occur"
      }. Keep these short.
      
      For tips: Provide actionable, practical advice for understanding and working with ${name} ${
        isSymbol ? "symbols in dreams" : "dreams"
      }.
      
      Remember:
      - Be specific to ${name}, avoid generic interpretations
      - Use clear, engaging language
      - Provide concrete examples
      - Keep formatting simple - no markdown, no special characters or special formatting
      - Make content unique and valuable`;
};

export const analysisImagePrompt = (details: string) => {
  return `Create a symbolic, abstract artistic interpretation that captures the essence of this dream in a safe, non-explicit way. 
  The image should be dreamlike and metaphorical, using:
  - Soft, ethereal colors and lighting
  - Abstract shapes and forms
  - Natural elements like clouds, water, or stars
  - Symbolic representations rather than literal scenes
  - Gentle, calming imagery
  Style: Artistic, surreal, and non-threatening. Focus on mood and atmosphere rather than specific details.
  The overall tone should be peaceful and contemplative.
  
  Dream essence to interpret: "${details}"`;
};
