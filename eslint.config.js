const playwright = require('eslint-plugin-playwright');
const tsParser    = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts'],
    plugins: { playwright: playwright },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error', // no Thread.sleep equivalent
      'playwright/no-focused-test':     'error', // no test.only() committed
      'playwright/no-skipped-test':     'error', // skipped tests must not accumulate silently
    },
  },
];
