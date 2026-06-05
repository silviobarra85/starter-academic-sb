# Release V339 - Filtri Calciomercato protetti

## Sommario

V339 estrae la gestione filtri Calciomercato in un modulo dedicato senza cambiare comportamento runtime.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/calciomercato/calciomercato-filters-v339.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `docs/zonaorientale/CHANGELOG_CONSOLIDATO.md`
- `docs/zonaorientale/FUNZIONALITAV339.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V339.md`
- `docs/zonaorientale/refactor/CALCIOMERCATO_FILTERS_REFACTOR_V339.md`
- `docs/zonaorientale/release/RELEASE_V339_CALCIOMERCATO_FILTERS_REFACTOR.md`

## File non modificati

- `docs/zonaorientale/FUNZIONALITA'.md`
- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/assets/calciomercato/archive/*.json`
- `static/zonaorientale/assets/listoni/*.json`
- CSS Calciomercato/Listone.

## Test

Eseguire:

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-filters-v339.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-render-v338.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Esito atteso

- Controlli obbligatori OK.
- Nessun errore asset/import.
- Nessun errore CSS.
- Warning legacy/orfani gia noti da non cancellare automaticamente.
