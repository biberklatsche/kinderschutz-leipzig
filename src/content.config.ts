import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Alle Inhalte liegen als Markdown-Dateien mit flachen Kopfdaten vor,
// damit sie sich später ohne Umbau über Pages CMS bearbeiten lassen.

export const BEREICHE = ['beratung', 'gruppen', 'praevention', 'fachkraefte'] as const;
export const ZIELGRUPPEN = ['kinder-jugendliche', 'eltern', 'fachkraefte'] as const;

const angebote = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/angebote' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kurztext: z.string().describe('Ein bis zwei Sätze für Übersichten und Suchmaschinen'),
      bild: image().optional(),
      bereich: z.enum(BEREICHE),
      zielgruppen: z.array(z.enum(ZIELGRUPPEN)).default([]),
      reihenfolge: z.number().default(100),
      uebergeordnet: z.string().optional().describe('Dateiname (ohne .md) des übergeordneten Angebots'),
      entwurf: z.boolean().default(false),
    }),
});

const aktuelles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/aktuelles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      teaser: z.string().optional(),
      bild: image().optional(),
      wichtig: z.boolean().default(false).describe('Hebt die Meldung auf der Startseite hervor'),
      entwurf: z.boolean().default(false),
    }),
});

const team = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      rolle: z.string().optional(),
      foto: image().optional(),
      qualifikationen: z.array(z.string()).default([]),
      reihenfolge: z.number().default(100),
      entwurf: z.boolean().default(false),
    }),
});

const seiten = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/seiten' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      beschreibung: z.string().optional().describe('Kurzbeschreibung für Suchmaschinen'),
      einleitung: z.string().optional(),
      bild: image().optional(),
      bildBeschreibung: z.string().optional(),
      // Nur Startseite
      kinderTitel: z.string().optional(),
      kinderText: z.string().optional(),
      elternTitel: z.string().optional(),
      elternText: z.string().optional(),
      fachkraefteTitel: z.string().optional(),
      fachkraefteText: z.string().optional(),
      merkmaleTitel: z.string().optional(),
      merkmale: z.array(z.string()).optional(),
      arbeitsweiseTitel: z.string().optional(),
    }),
});

export const collections = { angebote, aktuelles, team, seiten };
