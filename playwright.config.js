const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4180', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'python3 -m http.server 4180 --bind 127.0.0.1', url: 'http://127.0.0.1:4180', reuseExistingServer: false },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } }
  ]
});
