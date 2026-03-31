import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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
