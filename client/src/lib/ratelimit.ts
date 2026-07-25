import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting is abuse prevention, not a security boundary — if Upstash
// itself is unreachable, fail open (allow the request) rather than crashing
// every mutating route. `success === false` from a normal limiter response
// still returns 429 exactly as before.
export async function checkRatelimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<{ success: boolean }> {
  try {
    const { success } = await limiter.limit(identifier);
    return { success };
  } catch (err) {
    console.error("Rate limiter unreachable, failing open:", err);
    return { success: true };
  }
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 20 bookmark saves per user per hour
export const bookmarkRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  prefix: "recall:bookmark",
});

// 30 tag operations per user per hour
export const tagRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  prefix: "recall:tag",
});

// 60 collection operations per user per hour
export const collectionRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 h"),
  prefix: "recall:collection",
});
