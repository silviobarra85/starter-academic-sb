# AI Assistant Handoff - V599 Sudatori Excel TMW aggiornato

## Scopo
Overlay unico per aggiornare la sezione **Per i SUDATORI** al file `fantacalcio_serie_a_2026_27_tmw_aggiornato_2026-07-10(1).xlsx`.

## Modifiche principali
- dati Sudatori rigenerati dall'Excel aggiornato con fonte **TuttoMercatoWeb**;
- rose aggiornate: **Atta** spostato in Fiorentina, **Plizzari** rimosso dal Venezia;
- probabili formazioni riallineate: **Gila** fuori dall'XI Lazio e **Gigot** dentro;
- trattative/alert TMW aggiunti o rafforzati: **Khalaili**, **Emiliano Martinez**, **Akor Adams**, **Gila**, **Pulisic**;
- mantenute le correzioni V598: sinistra/destra del campetto corrette, nessun badge per disponibili, niente badge `Probabile XI` nella colonna Mercato;
- mantenute le card infortunati con contrasto scuro.

## File principali
- `static/fanta-engine/js/sections/sudatori-section-v599.js`
- `static/fanta-engine/css/sudatori-section-v599.css`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/tools/audit-sudatori-section-v599.mjs`

## Verifica
```bash
node static/fanta-engine/tools/audit-sudatori-section-v599.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v599.js
```
