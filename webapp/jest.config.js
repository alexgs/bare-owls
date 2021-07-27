/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

/* eslint-env node */

module.exports = {
  moduleNameMapper: {
    // Having the ^ and $ markers in these regexes is critical to making Jest work correctly
    '^components$': '<rootDir>/components',
    '^components/(.*)$': '<rootDir>/components/$1',
    '^lib$': '<rootDir>/lib',
    '^server-lib$': '<rootDir>/server-lib',
    '^server-lib/(.*)$': '<rootDir>/server-lib/$1',
  },
};
