export default {
  // Use jsdom environment for React/browser tests
  testEnvironment: 'jsdom',

  // Inject Jest globals (describe, test, expect, jest, etc.)
  injectGlobals: true,

  // Support ES modules and JSX transformation
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.{js,jsx}',
    '**/?(*.)+(spec|test).{js,jsx}'
  ],

  // Coverage configuration (required: 70% statements/functions/lines, 50% branches)
  collectCoverage: false, // Set to true when running coverage
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  coverageThreshold: {
    global: {
      statements: 70,
      branches: 50,
      functions: 70,
      lines: 70
    }
  },

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/main.jsx',
    '!src/utils/socket.js',
    '!src/store/index.js',
    '!**/node_modules/**'
  ],

  // Module paths
  moduleDirectories: ['node_modules', 'src'],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/'],

  // Setup files (for React Testing Library if needed)
  // setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module name mapper for CSS/assets (Vite uses these)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // Verbose output
  verbose: true
};
