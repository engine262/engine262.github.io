'use strict';

module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
  },
  env: {
    browser: true,
  },
  overrides: [
    {
      files: ['*.js', '.*.js'],
      parserOptions: { sourceType: 'script' },
    },
  ],
  globals: {
    BigInt: false,
    Atomics: false,
    SharedArrayBuffer: false,
    WeakRef: false,
  },
  rules: {
    'quote-props': ['error', 'consistent'],
    'strict': ['error', 'global'],
    'prefer-destructuring': 'off',
    'no-multiple-empty-lines': ['error', { maxBOF: 0, max: 2 }],
    'arrow-parens': ['error', 'always'],
    'lines-between-class-members': 'off',
    'max-classes-per-file': 'off',
    'no-restricted-syntax': 'off',
    'import/no-cycle': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-mutable-exports': 'off',
    'global-require': 'off',
  },
};
