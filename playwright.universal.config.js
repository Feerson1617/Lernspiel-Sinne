import original from './playwright.scorm.config.js';
export default {
  ...original,
  outputDir: 'test-results/universal-sinneslabor',
  reporter: [['list'], ['json', { outputFile: 'test-results/universal-sinneslabor.json' }]],
  webServer: { ...original.webServer, command: 'node scripts/serve-universal-sinneslabor.mjs' }
};
