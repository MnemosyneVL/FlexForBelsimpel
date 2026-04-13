// Jest configuration for the React frontend.
//
// Key decisions:
//   - ts-jest for TypeScript support (no Babel needed)
//   - jsdom environment to simulate browser APIs (DOM, window, etc.)
//   - Module name mapping for our ~/ path alias and CSS Modules
//   - Setup file imports @testing-library/jest-dom matchers

import type { Config } from "jest";

const config: Config = {
  // jsdom simulates a browser environment in Node.js
  // so we can test React components that use document, window, etc.
  testEnvironment: "jsdom",

  // Use ts-jest to compile TypeScript test files
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  // Map our path aliases and handle non-JS imports
  moduleNameMapper: {
    // ~/something → app/something (matches tsconfig paths)
    "^~/(.*)$": "<rootDir>/app/$1",

    // CSS Modules → return an empty object (we test behavior, not styles)
    "\\.module\\.css$": "identity-obj-proxy",

    // Plain CSS imports → ignore
    "\\.css$": "<rootDir>/test/__mocks__/styleMock.ts",
  },

  // Run this file before each test suite
  setupFilesAfterSetup: ["<rootDir>/jest.setup.ts"],

  // Only look for tests in the app directory
  roots: ["<rootDir>/app"],

  // Match test files
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
};

export default config;
