// ─────────────────────────────────────────────────────────────────────────────
// environment.production.ts — PRD (Produção)
//
// ⚠️ Em CI, o pipeline substitui apenas apiUrl pelo secret PRD_API_URL.
//    A versão é sempre lida do package.json em tempo de build.
// ─────────────────────────────────────────────────────────────────────────────
import { version } from '../../package.json';

export const environment = {
  name:       'production',
  production: true,
  apiUrl:     'https://api.ceccoff.com',   // Substituído por secrets.PRD_API_URL no CI
  version,
};
