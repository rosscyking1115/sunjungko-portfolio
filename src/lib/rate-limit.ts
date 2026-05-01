import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

/**
 * Upstash sliding-window rate limit, 5 submissions per IP per minute.
 *
 * Returns null when Upstash isn't configured — the server action treats null
 * as "no rate limit configured" rather than failing closed. In production this
 * is set; in dev you can run without it and just rely on the honeypot +
 * Turnstile.
 */
export function makeRateLimiter(): Ratelimit | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: false,
    prefix: "sunjungko-contact",
  });
}
