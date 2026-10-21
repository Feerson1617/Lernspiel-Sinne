import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 120_000,
  expect: { timeout: 7000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/browser-results.json' }]],
  use: { baseURL: 'http://127.0.0.1:4173/Lernspiel-Sinne/', viewport: { width: 1440, height: 900 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', launchOptions: { executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] } } },
    ...(process.env.TEST_WEBKIT ? [{ name: 'webkit', use: { browserName: 'webkit' } }] : [])
  ],
  webServer: { command: 'npm run start', port: 4173, reuseExistingServer: !process.env.CI }
});
