/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

/* eslint-env node */

module.exports = (api) => {
  if (api.env('test')) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
      ],
    };
  }

  if (api.env(['development', 'production'])) {
    return {
      presets: ['next/babel'],
    };
  }

  throw new Error(`Unknown environment: "${api.env()}"`);
};
