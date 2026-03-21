// ─────────────────────────────────────────────────────────────────────────────
// environment.development.ts — DEV
//
// ⚠️ Em CI, o pipeline substitui apenas apiUrl pelo secret DEV_API_URL.
//    A versão é sempre lida do package.json em tempo de build.
// ─────────────────────────────────────────────────────────────────────────────
import { version } from '../../package.json';

export const environment = {
  name:       'development',
  production: false,
  apiUrl:     'http://localhost:3000',   // Substituído por secrets.DEV_API_URL no CI
  version:    `${version}-dev`,
};
