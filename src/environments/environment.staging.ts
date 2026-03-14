// ─────────────────────────────────────────────────────────────────────────────
// environment.staging.ts — HML (Homologação)
//
// ⚠️ Este arquivo é GERADO pelo pipeline antes do build.
//    Em CI, os valores abaixo são substituídos pelos secrets do GitHub.
//    NÃO commite URLs ou chaves reais neste arquivo.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  name:       'staging',
  production: false,
  apiUrl:     'https://api.staging.ceccoff.com',  // Substituído por secrets.HML_API_URL
  version:    '0.0.0-staging',                    // Substituído pela tag Git
};
