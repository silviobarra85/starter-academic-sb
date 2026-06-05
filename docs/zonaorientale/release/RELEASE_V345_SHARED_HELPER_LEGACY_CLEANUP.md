# Release V345 - Shared helper legacy cleanup

## Sintesi

V345 rimuove il vecchio helper `shared-helpers-v294.js` e consolida l'uso di `shared-helpers-v295.js` + `shared-helper-bridge-v341.js`.

## Modifiche

- Rimozione controllata di `assets/js/utils/shared-helpers-v294.js`.
- Aggiunto `audit-shared-helpers-v345.mjs`.
- Aggiunta diagnostica `window.ZonaOrientaleSharedHelperLegacyCleanupV345`.
- Aggiornato `check-zonaorientale.sh`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V345.
- Aggiunta documentazione V345.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-shared-helpers-v345.mjs
static/zonaorientale/tools/audit-shared-helpers-v345.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh --quiet
static/zonaorientale/tools/audit-css-v300.sh
```

## Funzionalita preservate

Nessuna modifica intenzionale a UI, feed, dati, Firebase, Netlify, Calciomercato, Listone, Rose, Admin o mobile navigation.
