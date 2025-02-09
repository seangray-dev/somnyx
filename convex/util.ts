import { GenericId, Validator, v } from "convex/values";

import { TableNames } from "./_generated/dataModel";
import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

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
  return (await ctx.auth.getUserIdentity())?.subject;
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
  "Chase",
  "Cheating",
  "Death",
  "Falling",
  "Flying",
  "Naked",
  "Snake",
  "Teeth",
  "Test",
];
