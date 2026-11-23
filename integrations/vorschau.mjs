// Vorschau-Build für GitHub Pages (z. B. https://biberklatsche.github.io/kinderschutz-leipzig/).
//
// Aktiv nur, wenn beim Bauen die Umgebungsvariable VORSCHAU_BASE gesetzt ist, etwa
//   VORSCHAU_BASE=/kinderschutz-leipzig VORSCHAU_SITE=https://biberklatsche.github.io npm run build
// Der normale Build für die echte Domain bleibt davon unberührt.
//
// Was die Integration tut:
//   - Alle Links, die mit „/" beginnen (auch in den Markdown-Inhalten und in einstellungen.json),
//     bekommen nach dem Bauen den Unterordner vorangestellt.
//   - Jede Seite erhält <meta name="robots" content="noindex">, und robots.txt sperrt alles,
//     damit die Vorschau nicht in Suchmaschinen erscheint.
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function* htmlDateien(dir) {
  for (const eintrag of await readdir(dir, { withFileTypes: true })) {
    const pfad = join(dir, eintrag.name);
    if (eintrag.isDirectory()) yield* htmlDateien(pfad);
    else if (eintrag.name.endsWith('.html')) yield pfad;
  }
}

export default function vorschau(base) {
  const prefix = base.replace(/\/+$/, ''); // z. B. "/kinderschutz-leipzig"

  // "/irgendwas" → "/kinderschutz-leipzig/irgendwas"; schon angepasste und "//host"-Adressen bleiben.
  const mitBase = (url) =>
    url.startsWith('//') || url === prefix || url.startsWith(prefix + '/') ? url : prefix + url;

  const umschreiben = (html) =>
    html
      .replace(/\b(href|src|action|poster)=(["'])(\/[^"']*)\2/g, (_, attr, q, url) => `${attr}=${q}${mitBase(url)}${q}`)
      .replace(/\bsrcset=(["'])([^"']*)\1/g, (_, q, set) =>
        `srcset=${q}${set.replace(/(^|,\s*)(\/[^\s,]+)/g, (_m, sep, url) => sep + mitBase(url))}${q}`,
      )
      .replace(/url\((["']?)(\/[^)"']*)\1\)/g, (_, q, url) => `url(${q}${mitBase(url)}${q})`)
      .replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />');

  return {
    name: 'vorschau',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        for await (const datei of htmlDateien(root)) {
          await writeFile(datei, umschreiben(await readFile(datei, 'utf8')));
        }
        await writeFile(join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
        // GitHub Pages wertet _redirects nicht aus.
        await rm(join(root, '_redirects'), { force: true });
      },
    },
  };
}
