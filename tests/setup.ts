import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Tear down React Testing Library renders between tests.
afterEach(() => {
  cleanup();
});
