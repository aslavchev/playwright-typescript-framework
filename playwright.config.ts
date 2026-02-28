import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  fullyParallel: false,          // tests within a file run sequentially (shared cart state)
  forbidOnly: !!process.env.CI,  // fail CI if test.only() is accidentally committed
  retries: process.env.CI ? 1 : 0,        // retry once in CI, never locally
  workers: process.env.CI ? 1 : undefined, // 1 worker in CI, auto locally

  reporter: 'html', // built-in HTML report with screenshots + traces embedded

  use: {
    screenshot: 'only-on-failure',        // automatic — no ScreenshotUtils class needed
    trace: 'on-first-retry',              // records network + DOM on retry (flight recorder)
    video: 'off',                         // traces are enough, video saves CI time
  },

  projects: [
    {
      name: 'browser-auth',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com', // UI tests hit SauceDemo
        testIdAttribute: 'data-test',         // SauceDemo uses data-test, not data-testid
        storageState: 'playwright/.auth/user.json', // reuse auth — login runs once in browser-auth
      },
      dependencies: ['browser-auth'],
    },
    {
      name: 'api',
      testDir: './tests/api', // only run tests from this folder
      use: {
        baseURL: 'https://dummyjson.com', // request.get('/products') → hits dummyjson.com/products
        extraHTTPHeaders: { 'Content-Type': 'application/json' }, // every request sends JSON header automatically
      },
    },

  ],
});
