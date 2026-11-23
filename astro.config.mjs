// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vorschau from './integrations/vorschau.mjs';

// Vorschau auf GitHub Pages: siehe integrations/vorschau.mjs und .github/workflows/vorschau.yml.
const vorschauBase = process.env.VORSCHAU_BASE;

export default defineConfig({
  site: vorschauBase ? (process.env.VORSCHAU_SITE ?? 'https://biberklatsche.github.io') : 'https://www.kinderschutz-leipzig.de',
  base: vorschauBase || undefined,
  trailingSlash: 'always',
  integrations: vorschauBase ? [vorschau(vorschauBase)] : [sitemap()],
  // Die HTML-Komprimierung entfernt Zeilenumbrüche zwischen Text und Inline-Elementen
  // (<strong>, <a> …) ersatzlos, wodurch im Fließtext Leerzeichen verschwinden können.
  compressHTML: false,
});
