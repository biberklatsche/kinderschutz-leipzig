# Kinderschutz-Zentrum Leipzig – Website

Statische Website auf Basis von [Astro](https://astro.build). Die Inhalte liegen als Markdown- und JSON-Dateien im Repository und sind so aufgebaut, dass sie später über [Pages CMS](https://pagescms.org) bearbeitet werden können (noch nicht eingerichtet).

## Entwickeln

```sh
npm install
npm run dev      # Entwicklungsserver auf http://localhost:4321
npm run build    # erzeugt die fertige Seite in dist/
npm run preview  # zeigt den Stand aus dist/ an
```

## Wo steht was?

| Inhalt | Ort |
| --- | --- |
| Telefon, Zeiten, Standorte, Träger, Bank, Downloads, Hinweisbanner, „Seite verlassen" | `src/data/einstellungen.json` |
| Angebote (eine Datei je Angebot) | `src/content/angebote/` |
| Meldungen unter „Aktuelles" (Dateiname `JJJJ-MM-TT-titel.md`) | `src/content/aktuelles/` |
| Team (eine Datei je Person) | `src/content/team/` |
| Startseite, Förderverein, Impressum, Datenschutz | `src/content/seiten/` |
| Bilder (werden beim Bauen verkleinert) | `src/assets/bilder/` |
| PDFs zum Herunterladen | `public/downloads/` |
| Weiterleitungen der alten Adressen | `public/_redirects` |

Die erlaubten Felder je Inhaltstyp stehen in `src/content.config.ts`.

### Angebote

- `bereich`: `beratung`, `gruppen`, `praevention` oder `fachkraefte` (Gruppierung in der Übersicht)
- `zielgruppen`: `kinder-jugendliche`, `eltern`, `fachkraefte` (Filter in der Übersicht)
- `uebergeordnet`: Dateiname des übergeordneten Angebots, z. B. bei den Unterseiten der Prävention
- `reihenfolge`: kleinere Zahl steht weiter oben
- `entwurf: true` blendet einen Eintrag aus

### Hinweisbanner

In `einstellungen.json` unter `hinweis` einen Text eintragen und `aktiv` auf `true` setzen. Der Banner erscheint dann auf jeder Seite über der Kopfzeile.

### „Seite verlassen"

Der Knopf ist auf jeder Seite fest sichtbar und öffnet sofort die Adresse aus `schnellausstieg.ziel`. Weder „Zurück“ noch „Vorwärts“ im Browser führen danach wieder auf diese Website. Die Chronik des Browsers (Liste aller besuchten Seiten) kann eine Website nicht löschen. Mit `schnellausstieg.aktiv: false` lässt sich der Knopf abschalten. Die Funktionsweise ist in `src/components/Schnellausstieg.astro` beschrieben.

### Karte

Das Kartenbild auf der Kontaktseite (`src/assets/karte/standorte.png`) ist ein fertiges Bild auf Grundlage von OpenStreetMap-Daten. Es werden keine Daten an Kartendienste übertragen, deshalb braucht die Seite kein Cookie-Banner. Ändert sich ein Standort, muss das Bild neu erzeugt werden.

## Veröffentlichen

Die Seite ist rein statisch: Build-Befehl `npm run build`, Ausgabeordner `dist`. `public/_redirects` wird von Cloudflare Pages und Netlify ausgewertet.

### Vorschau auf GitHub Pages

Jeder Push auf `main` veröffentlicht eine Vorschau unter https://biberklatsche.github.io/kinderschutz-leipzig/ (`.github/workflows/vorschau.yml`). Dafür wird mit `VORSCHAU_BASE=/kinderschutz-leipzig` gebaut: `integrations/vorschau.mjs` setzt dann den Unterordner vor alle Links, sperrt die Vorschau für Suchmaschinen und lässt `_redirects` weg (GitHub Pages kennt keine Weiterleitungen).
