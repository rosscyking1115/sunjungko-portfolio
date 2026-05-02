import { describe, it, expect, beforeEach } from "vitest";
import { readClientTheme, writeClientTheme } from "@/lib/theme-cookie";

describe("theme-cookie", () => {
  beforeEach(() => {
    // Reset cookies between tests
    document.cookie = "theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  });

  it("readClientTheme defaults to light when no cookie set", () => {
    expect(readClientTheme()).toBe("light");
  });

  it("readClientTheme returns 'dark' when the cookie says dark", () => {
    document.cookie = "theme=dark; path=/";
    expect(readClientTheme()).toBe("dark");
  });

  it("readClientTheme returns 'light' when the cookie says light", () => {
    document.cookie = "theme=light; path=/";
    expect(readClientTheme()).toBe("light");
  });

  it("readClientTheme falls back to light for an invalid cookie value", () => {
    document.cookie = "theme=purple; path=/";
    expect(readClientTheme()).toBe("light");
  });

  it("writeClientTheme writes the dark theme cookie", () => {
    writeClientTheme("dark");
    expect(document.cookie).toContain("theme=dark");
  });

  it("writeClientTheme writes the light theme cookie", () => {
    writeClientTheme("light");
    expect(document.cookie).toContain("theme=light");
  });

  it("round-trips a theme write and read", () => {
    writeClientTheme("dark");
    expect(readClientTheme()).toBe("dark");
    writeClientTheme("light");
    expect(readClientTheme()).toBe("light");
  });
});
