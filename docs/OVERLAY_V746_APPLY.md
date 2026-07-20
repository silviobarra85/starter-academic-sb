# Overlay ioSudo V746

Applicare copiando le cartelle `static/` e `docs/` nella root del sito.

## Contenuto
- Dataset aggiornato dal file `v124_2026-07-20_fantacalcio_serie_a_2026_27_aggiornamento_globale_alias_v745.xlsx`.
- Rimossa amichevole aggregata errata `Basilea-Juventus / Bologna-Arminia / Atalanta-U23`.
- Aggiunto tabellino Lazio-Lazio U20 3-1.
- Fix tasto installazione PWA in alto a destra: visibile quando l'app non è installata, con fallback manuale.

## Verifica
```bash
node --check static/fanta-engine/js/apps/iosudo-app-v746.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v746.mjs
```
