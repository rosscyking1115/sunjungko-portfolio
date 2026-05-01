import { defineConfig, devices } from "@playwright/test";

/**
 * Run E2E against the production build (`next start`) for realism — Playwright
 * boots the build in `webServer` and tears it down at the end. This catches
 * issues that only surface in the production output (e.g. runtime CSP).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  // Serialise — running 5+ axe-injecting tests in parallel against one
  // `next start` instance overwhelms it on Windows, causing intermittent
  // worker crashes (STATUS_ACCESS_VIOLATION) and 30s page.goto timeouts.
  // Portfolio tests don't need parallel speed.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // axe-core scans + page navigation + Next.js cold-routes can exceed 30s
  // on the first hit. 60s is generous but avoids spurious failures.
  timeout: 60_000,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Each navigation gets up to 30s by default; bump for the production
    // server's first cold hit per route.
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
