# AI Assistant Handoff - V615 ioSudo pitch e fonti mercato

Data: 2026-07-12

## Obiettivo
Correggere due regressioni dell'app ioSudo:

1. Nei moduli con quattro valori, per esempio 4-2-3-1, 4-3-2-1, 4-3-1-2 e 3-4-2-1, il campetto deve mostrare anche la linea tra centrocampo e attacco. Il problema era il valore `attackingMidfield` nel dataset: l'app ordinava solo `attacking_midfield`, quindi quella linea non veniva renderizzata.
2. Nelle card mercato, se una voce porta fonti aggregate come `Eurosport/CalcioLecce`, l'app deve trasformarle in chip separati e cliccabili singolarmente.

## File modificati
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v615.js`
- `static/fanta-engine/css/iosudo-app-v615.css`
- `static/fanta-engine/tools/audit-iosudo-v615.mjs`
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/index.html`
- `static/fantapetillomantramanager/assets/league-config.json`

## Note tecniche
- Aggiunta `normalizeFormationLine()` per ricondurre `attackingMidfield` a `attacking_midfield`.
- Aggiunta `splitSourceNameTokens()` per separare fonti aggregate con `/`, `;` o `|`.
- Aggiunti fallback link per `Eurosport` e `CalcioLecce`.
- Nessuna modifica ai dati Sudatori: ioSudo continua a leggere `static/fanta-engine/data/sudatori/current/manifest.json` e `sudatori-data.json`.

## Comandi audit
```bash
node static/fanta-engine/tools/audit-iosudo-v615.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v615.js
node --check static/iosudo/sw.js
```
