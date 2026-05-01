"use server";

import "server-only";
import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { renderContactEmail } from "@/lib/email-template";
import { makeRateLimiter } from "@/lib/rate-limit";
import { env } from "@/lib/env";

export type ContactActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof ContactInput, string>>;
    };

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function getClientIp(): Promise<string | null> {
  const h = await headers();
  // Vercel sets x-forwarded-for; fall back to x-real-ip.
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("x-real-ip");
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    // Dev fallback: no secret configured → skip verification but log it.
    console.warn("[contact] TURNSTILE_SECRET_KEY not set — skipping bot verification");
    return true;
  }
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[contact] Turnstile verification failed:", err);
    return false;
  }
}

async function sendViaResend(
  input: ContactInput,
  meta: { ip: string | null; userAgent: string | null },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { subject, htmlContent, textContent } = renderContactEmail({
    ...input,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  if (!env.RESEND_API_KEY) {
    // Dev fallback: log the email instead of sending.
    console.log("[contact] RESEND_API_KEY not set — logging email instead of sending:");
    console.log({
      from: env.RESEND_FROM_EMAIL,
      to: env.RESEND_TO_EMAIL,
      replyTo: input.email,
      subject,
      message: input.message,
    });
    return { ok: true };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: env.RESEND_TO_EMAIL,
      replyTo: input.email,
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("[contact] Resend send failed:", error);
      return { ok: false, error: "Email service rejected the request." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] Resend send threw:", err);
    return { ok: false, error: "Email service is unavailable. Please try again." };
  }
}

export async function submitContact(formData: FormData): Promise<ContactActionResult> {
  // 1. Honeypot — bots happily fill this hidden field. Silent success on hit.
  if (formData.get("website")) {
    console.warn("[contact] honeypot triggered, silently accepting");
    return { ok: true };
  }

  // 2. Validate
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactInput | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  // 3. Rate limit by IP
  const ip = await getClientIp();
  const ratelimiter = makeRateLimiter();
  if (ratelimiter && ip) {
    const { success, reset } = await ratelimiter.limit(ip);
    if (!success) {
      const wait = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return {
        ok: false,
        error: `Too many submissions. Please try again in ${wait}s.`,
      };
    }
  }

  // 4. Turnstile
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  if (!turnstileToken && env.TURNSTILE_SECRET_KEY) {
    return { ok: false, error: "Please complete the bot check above." };
  }
  if (turnstileToken) {
    const valid = await verifyTurnstile(turnstileToken, ip);
    if (!valid) {
      return { ok: false, error: "Bot check failed. Please refresh and try again." };
    }
  }

  // 5. Send
  const h = await headers();
  const userAgent = h.get("user-agent");
  const sendResult = await sendViaResend(parsed.data, { ip, userAgent });
  return sendResult;
}
