import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility scan on every public page. axe-core's "wcag2a", "wcag2aa", and
 * "best-practice" tags are enabled. Known false positives can be added to the
 * `disableRules` list if needed.
 */

const pages = [
  { path: "/", name: "home" },
  { path: "/work", name: "work" },
  { path: "/work/patagonia-brand-evaluation", name: "case study detail" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
];

for (const { path, name } of pages) {
  test(`${name} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "best-practice"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
