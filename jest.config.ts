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

  // Thresholds — aumentar gradualmente conforme o projeto amadurece.
  // Convenção da comunidade: não bloquear CI com valores irreais em projetos novos.
  // Referência: angular/components, nx, analog — partem de valores baixos ou sem threshold.
  coverageThreshold: {
    global: {
      statements: 0,
      branches:   0,
      functions:  0,
      lines:      0,
    },
  },

  // ── Verbose ───────────────────────────────────────────────────────────────
  // false em CI (evita ruído), true localmente — controlado pela flag --verbose
  verbose: false,
};

export default config;
