import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Creates a new rate limiter instance with configurable requests and time window
 * @param requests Number of requests allowed in the time window
 * @param seconds Time window in seconds
 * @param prefix Optional prefix for the rate limit key
 */
export function createRateLimit(
  requests: number,
  seconds: number,
  prefix?: string
) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, `${seconds} s`),
    analytics: true,
    prefix: prefix ? `@upstash/somnyx/${prefix}` : "@upstash/somnyx",
  });
}

/**
 * Get client IP from request headers
 * @param request Request object
 * @returns Client IP address
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "127.0.0.1"; // Fallback for local development
}
