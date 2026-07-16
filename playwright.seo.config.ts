import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.SEO_TEST_PORT ?? 3200);
const baseURL = `http://127.0.0.1:${port}`;

process.env.PORT = String(port);
process.env.PLAYWRIGHT_BASE_URL = baseURL;
process.env.NEXT_PUBLIC_SITE_URL = process.env.SEO_TEST_SITE_URL ?? "https://www.hermanos.asia";
process.env.GOOGLE_SITE_VERIFICATION = "seo-google-test-token";
process.env.BING_SITE_VERIFICATION = "seo-bing-test-token";

export default defineConfig({
  testDir: "./tests",
  testMatch: /technical-seo\.e2e\.ts/,
  globalSetup: "./tests/helpers/playwright-global-setup.mjs",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "seo-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
