# Release V346 - Minor legacy audit

## Sintesi

V346 introduce un audit dei candidati legacy minori rimasti dopo le pulizie V343-V345. Non rimuove file e non cambia UI/dati.

## Modifiche

- Aggiunto `audit-minor-legacy-v346.mjs`.
- Aggiunta diagnostica `window.ZonaOrientaleMinorLegacyAuditV346`.
- Aggiornato `check-zonaorientale.sh`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V346.
- Aggiunta documentazione V346.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-minor-legacy-v346.mjs
static/zonaorientale/tools/audit-minor-legacy-v346.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh --quiet
static/zonaorientale/tools/audit-css-v300.sh
```

## Funzionalita preservate

Nessuna modifica intenzionale a UI, feed, dati, Firebase, Netlify, Calciomercato, Listone, Rose, Admin o mobile navigation.
