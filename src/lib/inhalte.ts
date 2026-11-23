import { statSync } from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export const BEREICH_TITEL: Record<string, string> = {
  beratung: 'Beratung',
  gruppen: 'Gruppen',
  praevention: 'Prävention',
  fachkraefte: 'Für Fachkräfte',
};

export const ZIELGRUPPE_TITEL: Record<string, string> = {
  'kinder-jugendliche': 'Kinder und Jugendliche',
  eltern: 'Eltern und Familien',
  fachkraefte: 'Fachkräfte',
};

/** Anzahl der Meldungen je Seite in der Übersicht */
export const PRO_SEITE = 10;

export type Angebot = CollectionEntry<'angebote'>;
export type Meldung = CollectionEntry<'aktuelles'>;

export async function alleAngebote(): Promise<Angebot[]> {
  const items = await getCollection('angebote', ({ data }) => !data.entwurf);
  return items.sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
}

export async function alleMeldungen(): Promise<Meldung[]> {
  const items = await getCollection('aktuelles', ({ data }) => !data.entwurf);
  return items.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

const datumLang = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function datum(d: Date): string {
  return datumLang.format(d);
}

export function isoDatum(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Dateigröße einer Datei unter public/, z. B. "205 KB"; leer, wenn die Datei fehlt. */
export function dateigroesse(publicPath: string): string {
  try {
    const bytes = statSync(path.join(process.cwd(), 'public', publicPath)).size;
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  } catch {
    return '';
  }
}

export function routenLink(strasse: string, ort: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${strasse}, ${ort}`)}`;
}
