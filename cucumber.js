module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step-definitions/**/*.ts', 'features/support/**/*.ts'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      html: {
        metadata: {
          'App Version': '1.0.0',
          'Test Environment': 'Automation Testing',
          'Platform': 'Windows',
          'Browser': 'Chromium'
        }
      }
    },
    parallel: 4,
    timeout: 30000
  },
  smoke: {
    requireModule: ['ts-node/register'],
    require: ['features/step-definitions/**/*.ts', 'features/support/**/*.ts'],
    format: ['progress-bar'],
    tags: '@smoke',
    timeout: 30000
  },
  regression: {
    requireModule: ['ts-node/register'],
    require: ['features/step-definitions/**/*.ts', 'features/support/**/*.ts'],
    format: ['progress-bar', 'html:reports/regression-report.html'],
    tags: '@regression',
    timeout: 30000
  }
}; 