# Overlay V621 - Sudatori/ioSudo mercato fonti extra v4

Aggiornamento del 13/07/2026 basato sul file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-13_mercato_fonti_extra_v4(1).xlsx`.

## Contenuto
- aggiornamento `sudatori-data.json` e `manifest.json`;
- nuove fonti operative dal foglio `Fonti`;
- nuove righe da `Trattative_Squadre`;
- fonti controllo ritiri/amichevoli conservate come controllo, senza aumentare il conteggio amichevoli reali;
- V620 ioSudo global buttons mantenuta e riallineata a V621;
- live rosters V618 mantenute.

## Applicazione
```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v621_mercato_fonti_extra_v4/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v621_mercato_fonti_extra_v4/docs/* docs/
```

## Audit
```bash
node static/fanta-engine/tools/audit-sudatori-section-v621.mjs
node static/fanta-engine/tools/audit-iosudo-v621.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v621.js
node --check static/fanta-engine/js/apps/iosudo-app-v621.js
node --check static/iosudo/sw.js
```
