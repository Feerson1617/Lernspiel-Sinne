import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests/scorm-browser', timeout: 120_000, expect: { timeout: 7000 },
  fullyParallel: true, workers: 2, retries: 0,
  outputDir: 'test-results/scorm',
  reporter: [['list'], ['json', { outputFile: 'test-results/scorm-results.json' }]],
  use: { baseURL: 'https://127.0.0.1:4175', ignoreHTTPSErrors: true, viewport: { width: 1024, height: 768 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', launchOptions: { executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] } } },
    ...(process.env.TEST_WEBKIT ? [{ name: 'webkit', use: { browserName: 'webkit' } }] : [])
  ],
  webServer: { command: 'node scripts/serve-scorm-test.mjs', url: 'https://127.0.0.1:4175/player.html', ignoreHTTPSErrors: true, reuseExistingServer: false }
});
