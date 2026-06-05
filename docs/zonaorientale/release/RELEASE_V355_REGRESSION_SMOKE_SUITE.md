# RELEASE_V355_REGRESSION_SMOKE_SUITE

## Tipo release

Chore/refactor safety. Nessun cambio funzionale.

## Modifiche

- Aggiunto audit statico regressione V355.
- Aggiunto marker runtime V355.
- Aggiunta checklist manuale completa.
- Aggiornati documenti e handoff.
- Aggiornata versione runtime/cache-buster/footer a V355.

## Rischio

Basso. Non sono stati modificati feed, dati, CSS funzionali, Netlify Functions o Firebase.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh --quiet
static/zonaorientale/tools/audit-css-v300.sh
node --check netlify/functions/calciomercato-feed.js
```

## Note

Dopo V355 non procedere con nuove rimozioni senza completare la checklist manuale.

