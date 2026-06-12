import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: '../playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    video: 'on',
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: 'npx ng serve --port 4200',
        port: 4200,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
