# Release V344 - Cleanup JS legacy Calciomercato

Data: 05/06/2026

## Modifiche

- Rimossi dal pacchetto i moduli JS Calciomercato player V335 e V337, superati da V340.
- Aggiunto tool `static/zonaorientale/tools/audit-js-legacy-v344.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleJsLegacyCleanupV344`.
- Aggiornati `check-zonaorientale.sh`, cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V344.
- Aggiunti documenti V344 in `docs/zonaorientale`.

## Nessuna modifica a

- Netlify Functions;
- `links.json`;
- archivi JSON Calciomercato;
- JSON Listone;
- CSS;
- renderer card;
- filtri;
- pannello Solo Admin;
- Firebase/Auth/EmailJS;
- Listone, Rose, Fantamercato, Dashboard Presidente, Admin generale.

## Applicazione locale

Dopo `cp -R` dello zip, rimuovere i file legacy se ancora presenti:

```bash
git rm static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js \
  static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js
```

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-js-legacy-v344.mjs
static/zonaorientale/tools/audit-js-legacy-v344.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
