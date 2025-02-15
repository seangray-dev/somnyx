import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Creates a new rate limiter instance with configurable requests and time window
 * @param requests Number of requests allowed in the time window
 * @param seconds Time window in seconds
 */

export function createRateLimit(requests: number, seconds: number) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, `${seconds} s`),
    analytics: true,
    prefix: "@upstash/somnyx",
  });
}
