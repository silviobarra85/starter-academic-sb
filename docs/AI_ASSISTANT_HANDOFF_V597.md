# AI Assistant Handoff - V597 Sudatori formazioni coerenti da Excel aggiornato

## Scopo
Overlay unico per aggiornare la sezione **Per i SUDATORI** al nuovo file `fantacalcio_serie_a_2026_27_formazioni_coerenti_2026-07-10(1).xlsx`.

## Modifiche principali
- dati Sudatori rigenerati dal nuovo Excel formazioni coerenti;
- `Probabili_Formazioni` ora guida direttamente il campetto con il campo **Modulo formazione usato**;
- 20/20 squadre con 11 giocatori in XI, 0 giocatori fuori rosa, 0 incoerenze ruolo/posizione;
- mantenute le segnalazioni infortunati/SOS Fanta e il contrasto scuro introdotto in V596;
- esempi controllati: Atalanta con Kossounou e Gaetano, Lazio con Cancellieri; Hien e Isaksen fuori dagli XI.

## File principali
- `static/fanta-engine/js/sections/sudatori-section-v597.js`
- `static/fanta-engine/css/sudatori-section-v597.css`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/tools/audit-sudatori-section-v597.mjs`

## Verifica
```bash
node static/fanta-engine/tools/audit-sudatori-section-v597.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v597.js
```
