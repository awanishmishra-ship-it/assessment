const { defineConfig, devices } = require('@playwright/test');
const { uiBaseUrl, apiBaseUrl } = require('./utils/env');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // The public Toolshop host is shared and rate-sensitive; serial execution
  // prevents concurrent registration/login/cart flows from interfering.
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testMatch: /tests[\\/]ui[\\/].*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiBaseUrl,
      },
    },
    {
      name: 'api',
      testMatch: /tests[\\/]api[\\/].*\.spec\.js/,
      use: {
        baseURL: apiBaseUrl,
      },
    },
  ],
  outputDir: 'test-results',
});
