/**
 * Centralised env-var typing. We deliberately do NOT throw on missing values
 * so the contact form gracefully degrades in dev/preview where secrets aren't
 * configured (lesson L20). Validation happens lazily at the call site.
 */

export const env = {
  // Public
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",

  // Server only — empty string means "feature disabled, log instead".
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ?? "",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
  RESEND_TO_EMAIL: process.env.RESEND_TO_EMAIL ?? "sunjungko0914@gmail.com",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
} as const;

/** Cloudflare's well-known dev-mode keys — render the widget without rejecting. */
export const TURNSTILE_DEV_SITE_KEY = "1x00000000000000000000AA";
