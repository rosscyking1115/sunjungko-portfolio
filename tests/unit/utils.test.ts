import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("joins simple class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("merges conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge handles the same-property collision
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-foreground", "text-muted-foreground")).toBe(
      "text-muted-foreground",
    );
  });

  it("preserves non-conflicting classes alongside conflicts", () => {
    const result = cn("p-2 mb-4", "p-6");
    expect(result).toContain("mb-4");
    expect(result).toContain("p-6");
    expect(result).not.toContain("p-2");
  });

  it("handles arrays and objects via clsx", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });

  it("returns empty string for no args", () => {
    expect(cn()).toBe("");
  });
});
