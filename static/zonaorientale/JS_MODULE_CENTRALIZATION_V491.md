# Centralizzazione moduli JS V491

La V491 centralizza selettivamente 12 moduli JS comuni e identici in `static/fanta-engine/js/shared/v491/`. Solo 11 moduli sono usati come import runtime primari da `assets/app.js`; `calciomercato-players-v340.js` viene copiato nel motore ma non viene ancora agganciato perché il runtime usa una versione diversa. Le copie locali restano in entrambe le leghe e nella copia annidata ZonaOrientale: non sono stati cancellati fallback/rollback locali. Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni e calciomercato dati non sono stati modificati.

## Moduli centralizzati

- `assets/js/calciomercato/calciomercato-images-v334.js`
- `assets/js/calciomercato/calciomercato-players-v340.js`
- `assets/js/core/constants.js`
- `assets/js/core/dom.js`
- `assets/js/core/utils.js`
- `assets/js/domain/entities.js`
- `assets/js/domain/labels.js`
- `assets/js/domain/news.js`
- `assets/js/market/transfer-market.js`
- `assets/js/mobile/mobile-rosters.js`
- `assets/js/mobile/mobile-tables.js`
- `assets/js/refactor/public-admin-render-orchestrator-v221.js`

## Guardrail

- Nessuna funzionalita' rimossa.
- Nessuna copia locale cancellata.
- Nessun modulo Firebase o EmailJS centralizzato.
- I moduli con import relativi fragili restano locali.
- `app.js` resta lega-specifico.

## Verifiche

Da `static`:

```bash
node fanta-engine/tools/audit-js-module-centralization-v491.mjs
node fanta-engine/tools/audit-multileague-contamination-v491.mjs
```
