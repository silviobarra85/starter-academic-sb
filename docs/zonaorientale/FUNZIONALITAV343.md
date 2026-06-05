# FUNZIONALITAV343 - Cleanup CSS legacy e Diagnostica Admin

Versione: V343
Data: 05/06/2026

## Obiettivo

La V343 prosegue il refactor protetto senza rimuovere o scollegare funzionalita runtime. La modifica principale e doppia:

1. preparare e verificare la rimozione controllata dei CSS refactor versionati V291/V292 ormai sostituiti dagli alias stabili;
2. rendere visibile il funzionamento del tasto Admin `Aggiorna diagnostica` mostrando data e ora italiana dell'ultimo refresh.

Il file canonico `FUNZIONALITA'.md` non e stato modificato.

## Funzionalita preservate

- Dashboard pubblica e navigazione principale.
- Menu mobile, bottom navigation, menu Altro e pulsante Su.
- Tema Dark unico e Light mode sospesa.
- News e share WhatsApp dinamico.
- Listone pubblico e Admin, filtro Modifiche, colonna Modifica, usciti storici, export CSV solo Admin.
- Rose pubbliche, pagina squadra, dettagli rosa e tabelle mobile.
- Fantamercato interno e flussi presidente.
- Dashboard Presidente.
- Admin generale: login, rendering pannelli, attach handlers, richieste presidenti, convertitore listone, diagnostica dati.
- Diagnostica dati Admin V276/V303/V321/V322.
- Calciomercato: feed RSS/HTML, TMW squadre, archivio statico, Solo Admin, download JSON, filtri, card compatte, fallback immagini, tag giocatore, timeline modal.
- Netlify Functions `news-share.js` e `calciomercato-feed.js`.
- Firebase, Auth, EmailJS.
- Pagine standalone `competition.html` e `player.html`.

## Nuovo comportamento visibile

Nel pannello Admin `Diagnostica dati`, vicino al pulsante `Aggiorna diagnostica`, appare:

```text
Ultimo aggiornamento: mai aggiornata in questa sessione
```

Dopo il click viene mostrata data/ora italiana, per esempio:

```text
Ultimo aggiornamento: 05/06/2026, 09:31:22
```

Il refresh resta locale e non scrive su Firebase.

## Pulizia CSS legacy

Sono candidati alla rimozione controllata:

```text
assets/css/refactor/mobile-controls-v291.css
assets/css/refactor/rosters-tables-v291.css
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
assets/css/refactor/theme-light-suspended-v292.css
```

Sono preservati come CSS attivi/stabili:

```text
assets/css/refactor/mobile-controls.css
assets/css/refactor/rosters-tables.css
assets/css/refactor/listone.css
assets/css/refactor/calciomercato.css
assets/css/refactor/theme-light-suspended.css
```

La pulizia e assistita da:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

Dry-run:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

Applicazione:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh --apply
```

## Diagnostiche runtime

```js
window.ZonaOrientaleAdminDiagnosticsV343
window.ZonaOrientaleCssLegacyCleanupV343
```

Smoke test Admin:

```js
window.ZonaOrientaleAdminDiagnosticsV343.runSmokeTest()
```

## Test richiesti dopo applicazione

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

## Note per i prossimi refactor

Non cancellare altri JS/CSS legacy senza una release dedicata. I prossimi candidati JS, come vecchi moduli Calciomercato player matching, restano da verificare separatamente.
