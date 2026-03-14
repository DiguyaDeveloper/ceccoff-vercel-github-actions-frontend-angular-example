// ─────────────────────────────────────────────────────────────────────────────
// environment.ts — BASE (fallback, nunca usado diretamente em builds finais)
// O angular.json substitui este arquivo via fileReplacements por ambiente.
// Em CI/CD, o pipeline gera environment.<env>.ts com os secrets corretos.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  name:       'development',
  production: false,
  apiUrl:     'http://localhost:3000',
  version:    '0.0.0-local',
};
