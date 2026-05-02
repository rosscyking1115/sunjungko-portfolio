import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

describe("contactSchema", () => {
  const valid = {
    name: "Jane Smith",
    email: "jane@example.com",
    message: "Hi, I'd love to chat about a brand strategy role at our agency.",
  };

  it("accepts a valid submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 2 chars", () => {
    const result = contactSchema.safeParse({ ...valid, name: "X" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/enter your name/i);
    }
  });

  it("rejects a name longer than 120 chars", () => {
    const result = contactSchema.safeParse({ ...valid, name: "a".repeat(121) });
    expect(result.success).toBe(false);
  });

  it("rejects an empty email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/valid email/i);
    }
  });

  it("rejects a message shorter than 10 chars", () => {
    const result = contactSchema.safeParse({ ...valid, message: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a message longer than 2000 chars", () => {
    const result = contactSchema.safeParse({ ...valid, message: "x".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("accepts a message at the maximum length", () => {
    const result = contactSchema.safeParse({ ...valid, message: "x".repeat(2000) });
    expect(result.success).toBe(true);
  });
});
