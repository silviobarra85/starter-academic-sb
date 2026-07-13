# AI Assistant Handoff - V634

## Stato

- Overlay: `fantacalcio_overlay_sudatori_iosudo_v634_tmw_link_puntuali_v12.zip`
- Sorgente Excel: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-13_tmw_link_puntuali_v12(1).xlsx`
- Dataset: `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- Manifest: `static/fanta-engine/data/sudatori/current/manifest.json`

## Cambiamenti

- Versione Sudatori/ioSudo aggiornata a V634.
- Applicati link TMW puntuali da `Agg_13_07_v12_TMW_Link`.
- Aggiunte 24 fonti mancanti dal foglio `Fonti`.
- Nessun articolo mancante: `missingPreciseArticlesV634 = 0`.

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v634.mjs
node static/fanta-engine/tools/audit-iosudo-v634.mjs
```
