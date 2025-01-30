import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript files
  testEnvironment: 'node', // Use Node.js environment for testing
  roots: ['<rootDir>/src'], // Specify root directory for tests
  moduleFileExtensions: ['ts', 'js', 'json'], // Supported extensions
  testMatch: ['**/__tests__/**/*.test.ts'], // Pattern for test files
  clearMocks: true, // Automatically clear mocks between tests
};

export default config;
