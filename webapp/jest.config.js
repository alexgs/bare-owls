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
  preset: 'ts-jest',
  testEnvironment: 'node',
};
