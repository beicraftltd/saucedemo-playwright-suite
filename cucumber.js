module.exports = {
  default: {
    require: [
      'features/step-definitions/*.ts',
      'features/support/*.ts'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json'
    ],
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    worldParameters: {
      headless: process.env.HEADLESS !== 'false',
      baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
      browser: process.env.BROWSER || 'chromium'
    },
    parallel: parseInt(process.env.PARALLEL_WORKERS) || 1, // Start with 1 to debug
    retry: process.env.CI ? 1 : 0,
    timeout: 60000,
    tags: process.env.TAGS || 'not @skip'
  },
  
  // Debug profile for troubleshooting
  debug: {
    require: [
      'features/step-definitions/*.ts',
      'features/support/*.ts'
    ],
    format: ['progress-bar'],
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    parallel: 1,
    timeout: 120000,
    tags: '@debug or @smoke'
  },
  
  // Smoke test profile
  smoke: {
    require: [
      'features/step-definitions/*.ts',
      'features/support/*.ts'
    ],
    format: ['progress-bar', 'json:reports/smoke-report.json'],
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    tags: '@smoke',
    parallel: 1,
    timeout: 30000
  }
};

// Environment-specific overrides
if (process.env.CI) {
  module.exports.default.parallel = parseInt(process.env.PARALLEL_WORKERS) || 2;
  module.exports.default.retry = 2;
  module.exports.default.format.push('junit:reports/cucumber-junit.xml');
}

if (process.env.DEBUG) {
  module.exports.default.parallel = 1;
  module.exports.default.format = ['progress-bar'];
  module.exports.default.timeout = 120000;
} 