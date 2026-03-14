// ─────────────────────────────────────────────────────────────────────────────
// environment.development.ts — DEV
//
// ⚠️ Este arquivo é GERADO pelo pipeline antes do build.
//    Em CI, os valores abaixo são substituídos pelos secrets do GitHub.
//    Localmente, use valores de desenvolvimento.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  name:       'development',
  production: false,
  apiUrl:     'http://localhost:3000',   // Substituído por secrets.DEV_API_URL
  version:    '0.0.0-dev',              // Substituído pela tag Git
};
