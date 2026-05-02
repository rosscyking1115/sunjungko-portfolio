import { test, expect } from "@playwright/test";

/**
 * Smoke test for every public route. Doesn't assert exact text — just that the
 * page renders, has the right h1, and links work. Detailed copy assertions are
 * fragile; structural assertions are stable.
 */
test.describe("smoke", () => {
  test("home page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("SunJung");
  });

  test("nav has all four links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Work", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "About", exact: true })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Contact", exact: true }),
    ).toBeVisible();
  });

  test("/work renders gallery with at least one case study", async ({ page }) => {
    await page.goto("/work");
    await expect(page.locator("h1")).toContainText("Selected work");
    const cards = page.locator("ul li a");
    await expect(cards.first()).toBeVisible();
  });

  test("/work/patagonia-brand-evaluation renders the case study", async ({ page }) => {
    await page.goto("/work/patagonia-brand-evaluation");
    await expect(page.locator("h1")).toContainText("Patagonia");
    await expect(page.getByText("Read case study")).not.toBeVisible();
  });

  test("/about renders the bio", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toContainText("SunJung");
    await expect(page.getByRole("link", { name: /Download CV/i })).toBeVisible();
  });

  test("/contact renders the form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toContainText("Get in touch");
    // getByRole("textbox") is unambiguous — won't collide with the footer
    // mailto link, unlike getByLabel.
    await expect(page.getByRole("textbox", { name: /Name/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Email/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Message/ })).toBeVisible();
  });

  test("/work/nonexistent returns 404", async ({ page }) => {
    const response = await page.goto("/work/nonexistent-slug-that-does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("CV PDF is reachable", async ({ request }) => {
    const response = await request.get("/cv.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });

  test("security.txt is reachable", async ({ request }) => {
    const response = await request.get("/.well-known/security.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Contact:");
    expect(body).toContain("Expires:");
  });
});
