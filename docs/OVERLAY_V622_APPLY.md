# Overlay V622 - Sudatori/ioSudo mercato Udinese amichevoli v5

Aggiornamento del 13/07/2026 basato sul file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-13_mercato_udinese_amichevoli_v5(1).xlsx`.

## Contenuto

- Aggiornamento `sudatori-data.json` e `manifest.json`.
- Nuove fonti operative Udinese/Bwin.
- Nuove righe `Trattative_Squadre` aggregate nelle card esistenti o nuove.
- Amichevoli Udinese da Bwin inserite come da confermare.
- ioSudo aggiornata con vista rapida `GIOCATORI`.
- Live rosters V618 mantenute.

## Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v622_mercato_udinese_amichevoli_players/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v622_mercato_udinese_amichevoli_players/docs/* docs/
```

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v622.mjs
node static/fanta-engine/tools/audit-iosudo-v622.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v622.js
node --check static/fanta-engine/js/apps/iosudo-app-v622.js
node --check static/iosudo/sw.js
```
