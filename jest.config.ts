import type { Config } from 'jest';

const config: Config = {
  // jest-preset-angular configura: transform, transformIgnorePatterns,
  // testEnvironment (jsdom), moduleFileExtensions e snapshotSerializers.
  preset: 'jest-preset-angular',

  // ── Setup ─────────────────────────────────────────────────────────────────
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // ── Onde buscar testes ────────────────────────────────────────────────────
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],

  // ── Module aliases (espelha tsconfig paths) ───────────────────────────────
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },

  // ── Coverage ──────────────────────────────────────────────────────────────
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/environments/**',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/**/index.ts',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },

  verbose: false,
};

export default config;
