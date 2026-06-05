# Release V340 - Archivio Admin e matching giocatore

Data: 05/06/2026

## Tipo modifica

Refactor protetto + fix conservativo matching giocatore.

## File modificati principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-admin-v340.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/FUNZIONALITAV340.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md
docs/zonaorientale/refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md
```

## Dettagli

- Estratto il rendering del pannello `Solo Admin` Calciomercato in `calciomercato-admin-v340.js`.
- Il download JSON giorno/intervallo resta invariato.
- La diagnostica archivio V324 resta invariata.
- Il toggle Espandi/Riduci resta operativo e delega al modulo V340.
- Aggiornato matching giocatore a V340 con controllo maiuscole per alias singoli.
- Corretto il caso `Giovane` giocatore vs `giovane` aggettivo.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V340.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- TMW squadra.
- Archivio statico.
- Download archivio Admin.
- Filtri Calciomercato V339.
- Renderer card V338.
- Fallback immagini V334.
- Timeline giocatore modal V336.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## Note

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
