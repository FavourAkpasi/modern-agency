import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const rootDir = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path alias from tsconfig.json.
    alias: { "@": rootDir },
  },
  // Disable PostCSS for tests. Otherwise Vite's CSS transform tries to run the
  // app's Tailwind v4 pipeline on any imported stylesheet, which fails here.
  css: { postcss: { plugins: [] } },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/integration/setup.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      // `json-summary` + `json` are required by davelosert/vitest-coverage-report-action.
      reporter: ["text", "json", "json-summary"],
      reportsDirectory: "test/integration/coverage",
      include: [
        "app/**",
        "components/**",
        "hooks/**",
        "lib/**",
        "services/**",
        "stores/**",
      ],
      exclude: ["**/__tests__/**", "**/*.d.ts"],
    },
  },
})
