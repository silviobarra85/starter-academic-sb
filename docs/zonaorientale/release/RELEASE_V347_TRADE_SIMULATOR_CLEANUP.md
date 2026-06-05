# Release V347 - Cleanup duplicato simulatore trade

Data: 05/06/2026

## Tipo release

Refactor/cleanup controllato, nessun cambio funzionale.

## File rimossi

- `static/zonaorientale/assets/js/trade-notification-simulator-v255.js`

## File preservati

- `static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js`
- `static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js` resta candidato review.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-minor-legacy-v346.mjs`
- `static/zonaorientale/tools/audit-trade-simulator-v347.mjs`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- documentazione V347 in `docs/zonaorientale/`

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-trade-simulator-v347.mjs
static/zonaorientale/tools/audit-trade-simulator-v347.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
