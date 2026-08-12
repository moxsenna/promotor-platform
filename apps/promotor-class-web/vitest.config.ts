import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest for the web package. Node environment (no DOM) — the mock store
 * receives injected storage in tests; `@/*` mirrors tsconfig paths so module
 * boundary files resolve exactly as they do under Next.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
  },
});
