import { describe, it, expect } from "vitest";
import { renderContactEmail } from "@/lib/email-template";

describe("renderContactEmail()", () => {
  const baseInput = {
    name: "Jane Smith",
    email: "jane@example.com",
    message: "Quick question about brand strategy.",
  };

  it("returns subject, htmlContent and textContent", () => {
    const result = renderContactEmail(baseInput);
    expect(result.subject).toContain("Jane Smith");
    expect(result.htmlContent).toContain("<html");
    expect(result.textContent).toContain("Jane Smith");
    expect(result.textContent).toContain("jane@example.com");
  });

  it("escapes HTML in the visitor's name", () => {
    const result = renderContactEmail({
      ...baseInput,
      name: "<script>alert('xss')</script>",
    });
    expect(result.htmlContent).not.toContain("<script>alert");
    expect(result.htmlContent).toContain("&lt;script&gt;");
  });

  it("escapes HTML in the email field", () => {
    const result = renderContactEmail({
      ...baseInput,
      email: 'evil"@example.com',
    });
    expect(result.htmlContent).not.toContain('evil"@');
    expect(result.htmlContent).toContain("&quot;");
  });

  it("escapes HTML in the message body", () => {
    const result = renderContactEmail({
      ...baseInput,
      message: "<b>bold</b> & <i>italic</i>",
    });
    expect(result.htmlContent).not.toContain("<b>bold</b>");
    expect(result.htmlContent).toContain("&lt;b&gt;bold&lt;/b&gt;");
  });

  it("includes diagnostic IP and user agent when provided", () => {
    const result = renderContactEmail({
      ...baseInput,
      ip: "203.0.113.42",
      userAgent: "Mozilla/5.0 Test",
    });
    expect(result.htmlContent).toContain("203.0.113.42");
    expect(result.htmlContent).toContain("Mozilla/5.0 Test");
  });

  it("omits diagnostics block when IP and user agent are missing", () => {
    const result = renderContactEmail(baseInput);
    expect(result.htmlContent).not.toContain("Diagnostics");
  });

  it("uses the receivedAt timestamp when provided", () => {
    const fixed = new Date("2026-05-01T12:34:56.000Z");
    const result = renderContactEmail({ ...baseInput, receivedAt: fixed });
    expect(result.textContent).toContain("2026-05-01T12:34:56");
  });
});
