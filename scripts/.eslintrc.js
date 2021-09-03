/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

/* eslint-env node */

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [],
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['*.js'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
      ],
      settings: {},
      rules: {
        'import/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
            },
            groups: [
              ['builtin', 'external'],
              'internal',
              'parent',
              ['index', 'sibling'],
            ],
            'newlines-between': 'always',
          },
        ],
      },
    },
  ],
};
