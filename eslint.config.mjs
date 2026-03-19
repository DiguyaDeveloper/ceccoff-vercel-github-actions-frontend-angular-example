// @ts-check
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  // ─── TypeScript + Angular source files ───────────────────────────────────
  {
    files: ['**/*.ts'],
    extends: [
      // recommendedTypeChecked: type-aware rules (requer parserOptions.project)
      // Captura: floating promises, unsafe any, unnecessary assertions, etc.
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: true,                        // usa tsconfig.json para type-awareness
        tsconfigRootDir: import.meta.dirname, // raiz do projeto
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // ── Selectors ─────────────────────────────────────────────────────────
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],

      // ── Angular 21+ best practices ────────────────────────────────────────
      // Rule 1 - Change Detection: força OnPush em todos os componentes
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',

      // Rule 3 - Bundle: força standalone (sem NgModules)
      '@angular-eslint/prefer-standalone': 'error',

      // Memory Management: remove lifecycle vazio que causa overhead
      '@angular-eslint/no-empty-lifecycle-method': 'error',

      // Garante que interfaces de lifecycle são implementadas explicitamente
      '@angular-eslint/use-lifecycle-interface': 'error',

      // Evita shadow de eventos nativos do DOM (click, blur, etc.)
      '@angular-eslint/no-output-native': 'error',

      // Convenção: outputs não devem ter prefixo "on" (use (valueChange) não (onValueChange))
      '@angular-eslint/no-output-on-prefix': 'error',

      // Evita renomear inputs — prejudica refactor e DX
      '@angular-eslint/no-input-rename': 'error',

      // Valida que lifecycle hooks são usados no contexto correto
      '@angular-eslint/contextual-lifecycle': 'error',

      // ── TypeScript strict ─────────────────────────────────────────────────
      // Proíbe any explícito — use unknown ou tipos específicos
      '@typescript-eslint/no-explicit-any': 'error',

      // Promessas não tratadas são bugs silenciosos — force await ou void
      '@typescript-eslint/no-floating-promises': 'error',

      // Remove type assertions desnecessários (value as string quando já é string)
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Prefere ?? (nullish coalescing) sobre || para evitar falsy bugs
      // warn (não error) para migração gradual
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',

      // Prefere optional chaining a.b?.c ao invés de a.b && a.b.c
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // Variáveis declaradas mas não usadas são ruído e possível bug
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',  // _param permite ignorar intencionalmente
        varsIgnorePattern: '^_',
      }],

      // ── Geral ─────────────────────────────────────────────────────────────
      // console.log em produção → use um logger adequado
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Retorno explícito pode ser verboso demais em Angular — manter off
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // ─── Spec/Test files — regras relaxadas ──────────────────────────────────
  {
    files: ['**/*.spec.ts'],
    rules: {
      // Testes frequentemente precisam de any para mocking
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // Promessas em beforeEach/it são tratadas pelo runner
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // ─── HTML Templates ───────────────────────────────────────────────────────
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
