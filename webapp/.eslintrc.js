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
  extends: ['eslint:recommended', 'next', 'prettier'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['*.js'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint', 'import', 'jest', 'react', 'react-hooks'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      settings: {
        'import/internal-regex': '^components|^lib|^server-lib|^types',
        react: {
          version: 'detect',
        },
      },
      rules: {
        'import/no-unresolved': [
          'error',
          {
            ignore: ['^components', '^lib', '^server-lib', '^types'],
          },
        ],
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
    {
      // Disable rules that cause errors with how we're importing design tokens
      files: ['pages/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
};
