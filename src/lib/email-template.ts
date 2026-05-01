import "server-only";
import type { ContactInput } from "./contact-schema";

/**
 * Renders the contact-form email as both HTML and plain text. Brevo accepts
 * both; major email clients will pick whichever they prefer (Apple Mail
 * preview pulls from text, full open renders HTML).
 */

interface RenderArgs extends ContactInput {
  ip?: string | null;
  userAgent?: string | null;
  receivedAt?: Date;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderContactEmail(args: RenderArgs) {
  const { name, email, message, ip, userAgent, receivedAt = new Date() } = args;
  const when = receivedAt.toISOString();

  const subject = `New contact form submission — ${name}`;

  const htmlContent = `<!doctype html>
<html lang="en">
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #666; margin: 0 0 16px;">Contact form · evelynsjko.com</p>
  <h1 style="font-size: 22px; font-weight: 600; margin: 0 0 24px; color: #1a1a1a;">New message from ${escapeHtml(name)}</h1>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; color: #666; width: 80px; vertical-align: top;">Name</td>
      <td style="padding: 8px 0;">${escapeHtml(name)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #666; vertical-align: top;">Email</td>
      <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #9C7B5C;">${escapeHtml(email)}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #666; vertical-align: top;">Received</td>
      <td style="padding: 8px 0; color: #666;">${escapeHtml(when)}</td>
    </tr>
  </table>
  <h2 style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #666; margin: 32px 0 12px; font-weight: 500;">Message</h2>
  <div style="white-space: pre-wrap; line-height: 1.6; padding: 16px; background: #f6f4f0; border-radius: 4px; border-left: 3px solid #9C7B5C;">${escapeHtml(message)}</div>
  ${ip || userAgent ? `<p style="font-size: 11px; color: #999; margin-top: 32px;">Diagnostics: ${escapeHtml(ip ?? "unknown IP")}${userAgent ? ` · ${escapeHtml(userAgent)}` : ""}</p>` : ""}
  <p style="font-size: 11px; color: #999; margin-top: 24px;">Reply directly to this email to respond — Reply-To is set to the visitor's address.</p>
</body>
</html>`;

  const textContent = [
    `New contact form submission — evelynsjko.com`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `When:    ${when}`,
    ``,
    `Message:`,
    message,
    ``,
    ip ? `IP:      ${ip}` : null,
    userAgent ? `Agent:   ${userAgent}` : null,
    ``,
    `Reply directly to this email — Reply-To is set to the visitor's address.`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, htmlContent, textContent };
}
