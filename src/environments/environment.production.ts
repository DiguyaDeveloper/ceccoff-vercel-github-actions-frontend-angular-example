// ─────────────────────────────────────────────────────────────────────────────
// environment.production.ts — PRD (Produção)
//
// ⚠️ Este arquivo é GERADO pelo pipeline antes do build.
//    Em CI, os valores abaixo são substituídos pelos secrets do GitHub.
//    NÃO commite URLs ou chaves reais neste arquivo.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  name:       'production',
  production: true,
  apiUrl:     'https://api.ceccoff.com',   // Substituído por secrets.PRD_API_URL
  version:    '0.0.0',                     // Substituído pela tag Git
};
