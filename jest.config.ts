import type { Config } from 'jest';

const config: Config = {
  // ── Preset ────────────────────────────────────────────────────────────────
  // jest-preset-angular configura transformers, moduleNameMapper e globals
  // necessários para compilar componentes Angular com esbuild/ts-jest.
  preset: 'jest-preset-angular',

  // ── Setup ─────────────────────────────────────────────────────────────────
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // ── Ambiente ──────────────────────────────────────────────────────────────
  // jsdom simula o DOM do browser — necessário para renderizar componentes.
  testEnvironment: 'jsdom',

  // ── Onde buscar testes ────────────────────────────────────────────────────
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],

  // ── Transforms ────────────────────────────────────────────────────────────
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },

  // ── Ignorar ───────────────────────────────────────────────────────────────
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],

  // ── Module aliases (espelha tsconfig paths se tiver) ─────────────────────
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },

  // ── Coverage ──────────────────────────────────────────────────────────────
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',                     // bootstrap, não tem lógica
    '!src/environments/**',             // gerados em CI, sem lógica
    '!src/**/*.spec.ts',                // os próprios testes
    '!src/**/*.module.ts',              // módulos NgModule (se existir)
    '!src/**/index.ts',                 // barrel exports
  ],

  coverageDirectory: 'coverage',

  // Reporters utilizados em CI e localmente:
  // - text:         tabela no terminal (sempre)
  // - lcov:         para Codecov / SonarQube (lcov.info)
  // - html:         relatório navegável em coverage/index.html
  // - json-summary: para badges e scripts externos
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Thresholds — ajuste conforme maturidade do projeto
  coverageThreshold: {
    global: {
      statements: 50,
      branches:   50,
      functions:  50,
      lines:      50,
    },
  },

  // ── Verbose ───────────────────────────────────────────────────────────────
  // false em CI (evita ruído), true localmente — controlado pela flag --verbose
  verbose: false,
};

export default config;
