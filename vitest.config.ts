import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Vitest config — kit lessons applied:
 *
 * L8: No `vite-tsconfig-paths`. Wire @/* via explicit resolve.alias to avoid
 *     the ESM/CJS conflict that breaks Vitest at config load time.
 * L9: Stub `server-only` so modules that import it don't throw at test time.
 *     The package itself raises if imported in a non-RSC environment.
 * L15: Coverage `include` is intentionally tight — only modules with real
 *      unit tests, so the 80% threshold is honest rather than aspirational.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/component/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: [
        "src/lib/utils.ts",
        "src/lib/contact-schema.ts",
        "src/lib/email-template.ts",
        "src/lib/theme-cookie.ts",
        "src/types/case-study.ts",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server-only": path.resolve(__dirname, "./tests/__mocks__/server-only.ts"),
    },
  },
});
