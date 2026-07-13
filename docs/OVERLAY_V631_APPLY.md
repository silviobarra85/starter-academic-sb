# OVERLAY V631 APPLY

Overlay V631 di correzione.

## Fix

- Corretto `manifest.current`, che in V630 era diventato booleano e causava il caricamento di `/data/sudatori/current/true`.
- Aggiunto `dataFile: sudatori-data.json`.
- Resi robusti i loader di Per i SUDATORI e ioSudo: usano `dataFile/currentFile/file/current` solo se sono stringhe, altrimenti ricadono su `sudatori-data.json`.
- Dati mercato, fonti, date logiche, rose live e vista giocatori restano quelli di V630.

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v631.mjs
node static/fanta-engine/tools/audit-iosudo-v631.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v631.js
node --check static/fanta-engine/js/apps/iosudo-app-v631.js
node --check static/iosudo/sw.js
```
