# AI Assistant Handoff - V598 Sudatori orientamento campo e badge

## Scopo
Overlay unico per correggere tre aspetti UI della sezione **Per i SUDATORI** dopo V597.

## Modifiche principali
- campetto ordinato sinistra-centro-destra: ruoli con **S** a sinistra (`DS`, `DCS`, `ES`, `AS`) e ruoli con **D** a destra (`DD`, `DCD`, `ED`, `AD`);
- sul campetto non viene mostrato alcun badge per i giocatori disponibili o senza segnalazioni;
- sul campetto compare un badge rosso solo quando esiste una segnalazione fisica reale;
- rimosso il badge **Probabile XI** dalla colonna **Mercato** nella tabella rosa;
- dati Excel, infortunati SOS Fanta e card scure V597 restano invariati.

## File principali
- `static/fanta-engine/js/sections/sudatori-section-v598.js`
- `static/fanta-engine/css/sudatori-section-v598.css`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/tools/audit-sudatori-section-v598.mjs`

## Verifica
```bash
node static/fanta-engine/tools/audit-sudatori-section-v598.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v598.js
```
