// ─────────────────────────────────────────────────────────────────────────────
// environment.staging.ts — HML (Homologação)
//
// ⚠️ Em CI, o pipeline substitui apenas apiUrl pelo secret HML_API_URL.
//    A versão é sempre lida do package.json em tempo de build.
// ─────────────────────────────────────────────────────────────────────────────
import { version } from '../../package.json';

export const environment = {
  name:       'staging',
  production: false,
  apiUrl:     'https://api.staging.ceccoff.com',   // Substituído por secrets.HML_API_URL no CI
  version:    `${version}-staging`,
};
