// ─────────────────────────────────────────────────────────────────────────────
// environment.ts — BASE (fallback local, nunca usado em builds de CI)
// O angular.json substitui este arquivo via fileReplacements por ambiente.
// ─────────────────────────────────────────────────────────────────────────────
import { version } from '../../package.json';

export const environment = {
  name:         'development',
  production:   false,
  apiUrl:       'http://localhost:3000',
  version:      `${version}-local`,
  enableMockApi: true,
};
