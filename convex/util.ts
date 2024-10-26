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
