import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',            // scans tests/ui/ and tests/api/ recursively
  fullyParallel: false,          // tests within a file run sequentially (shared cart state)
  forbidOnly: !!process.env.CI,  // fail CI if test.only() is accidentally committed
  retries: process.env.CI ? 1 : 0,        // retry once in CI, never locally
  workers: process.env.CI ? 1 : undefined, // 1 worker in CI, auto locally

  reporter: 'html', // built-in HTML report with screenshots + traces embedded

  use: {
    baseURL: 'https://www.saucedemo.com', // UI tests can use page.goto('/')
    testIdAttribute: 'data-test',         // SauceDemo uses data-test, not data-testid
    screenshot: 'only-on-failure',        // automatic — no ScreenshotUtils class needed
    trace: 'on-first-retry',              // records network + DOM on retry (flight recorder)
    video: 'off',                         // traces are enough, video saves CI time
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Chromium only — matches Selenium setup
    },
  ],
});
