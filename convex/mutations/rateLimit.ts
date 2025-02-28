import { MutationCtx } from "../_generated/server";

export const RATE_LIMITS = {
  FREE_INTERPRETATION: {
    MAX_REQUESTS: 1,
    // WINDOW_MS: 300000, // 5 mins
    WINDOW_MS: 3600000 * 24, // 1 day
    FEATURE_KEY: "free_interpretation",
  },
} as const;

type RateLimitFeature = keyof typeof RATE_LIMITS;

export type RateLimitStatus = {
  isAllowed: boolean;
  currentCount: number;
  maxRequests: number;
  windowMs: number;
  windowHours: number;
  nextAllowedTimestamp: number | null;
};

export async function checkRateLimit(
  ctx: MutationCtx,
  feature: RateLimitFeature,
  ipAddress: string,
  sessionId?: string
): Promise<RateLimitStatus> {
  const { MAX_REQUESTS, WINDOW_MS, FEATURE_KEY } = RATE_LIMITS[feature];
  const now = Date.now();

  // Clean up expired entries
  const expiredRecords = await ctx.db
    .query("rateLimits")
    .filter((q) => q.lt(q.field("expiresAt"), now))
    .collect();

  await Promise.all(expiredRecords.map((record) => ctx.db.delete(record._id)));

  // Get current rate limit record
  const rateLimit = await ctx.db
    .query("rateLimits")
    .withIndex("by_ip", (q) => q.eq("ipAddress", ipAddress))
    .filter((q) => q.eq(q.field("feature"), FEATURE_KEY))
    .first();

  if (!rateLimit) {
    await ctx.db.insert("rateLimits", {
      ipAddress,
      sessionId,
      feature: FEATURE_KEY,
      requestCount: 1,
      lastRequestTimestamp: now,
      expiresAt: now + WINDOW_MS,
    });

    return {
      isAllowed: true,
      currentCount: 1,
      maxRequests: MAX_REQUESTS,
      windowMs: WINDOW_MS,
      windowHours: WINDOW_MS / (60 * 60 * 1000),
      nextAllowedTimestamp: null,
    };
  }

  const isAllowed = rateLimit.requestCount < MAX_REQUESTS;

  if (isAllowed) {
    await ctx.db.patch(rateLimit._id, {
      requestCount: rateLimit.requestCount + 1,
      lastRequestTimestamp: now,
      sessionId: sessionId || rateLimit.sessionId,
    });
  }

  return {
    isAllowed,
    currentCount: rateLimit.requestCount,
    maxRequests: MAX_REQUESTS,
    windowMs: WINDOW_MS,
    windowHours: WINDOW_MS / (60 * 60 * 1000),
    nextAllowedTimestamp: rateLimit.expiresAt,
  };
}

// Helper function to check rate limit status without incrementing
export async function getRateLimitStatus(
  ctx: MutationCtx,
  feature: RateLimitFeature,
  ipAddress: string
): Promise<RateLimitStatus> {
  const { MAX_REQUESTS, WINDOW_MS, FEATURE_KEY } = RATE_LIMITS[feature];
  const now = Date.now();

  const rateLimit = await ctx.db
    .query("rateLimits")
    .withIndex("by_ip", (q) => q.eq("ipAddress", ipAddress))
    .filter((q) => q.eq(q.field("feature"), FEATURE_KEY))
    .first();

  if (!rateLimit || rateLimit.expiresAt <= now) {
    return {
      isAllowed: true,
      currentCount: 0,
      maxRequests: MAX_REQUESTS,
      windowMs: WINDOW_MS,
      windowHours: WINDOW_MS / (60 * 60 * 1000),
      nextAllowedTimestamp: null,
    };
  }

  return {
    isAllowed: rateLimit.requestCount < MAX_REQUESTS,
    currentCount: rateLimit.requestCount,
    maxRequests: MAX_REQUESTS,
    windowMs: WINDOW_MS,
    windowHours: WINDOW_MS / (60 * 60 * 1000),
    nextAllowedTimestamp: rateLimit.expiresAt,
  };
}

export function getRateLimitInfo(feature: RateLimitFeature) {
  const { MAX_REQUESTS, WINDOW_MS } = RATE_LIMITS[feature];
  return {
    maxRequests: MAX_REQUESTS,
    windowMs: WINDOW_MS,
    windowHours: WINDOW_MS / (60 * 60 * 1000),
  };
}
