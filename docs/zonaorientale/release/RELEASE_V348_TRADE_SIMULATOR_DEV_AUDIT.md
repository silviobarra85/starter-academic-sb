# Release V348 - Audit simulatore trade dev

Data: 05/06/2026

## Tipo release

Audit/refactor protetto. Nessuna rimozione file.

## Modifiche

- Aggiunto `audit-trade-simulator-dev-v348.mjs`.
- Aggiunto marker runtime `window.ZonaOrientaleTradeSimulatorDevAuditV348`.
- Aggiornato `check-zonaorientale.sh` con controlli V348.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V348.
- Aggiornata documentazione V348.

## Rischio

Basso. Nessuna funzionalita runtime e' stata modificata. L'area sensibile e' Fantamercato/notifiche trade, ma la V348 verifica solo gli agganci.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
