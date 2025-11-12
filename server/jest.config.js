export default {
  preset: null,
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!jest.config.js',
  ],
};
