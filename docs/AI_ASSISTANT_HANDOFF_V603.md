# AI Assistant Handoff - V603 Sudatori

Versione corrente: **V603**.

## Stato

La sezione **Per i SUDATORI** mantiene i dati dell'Excel del 2026-07-11, ma corregge la colonna **Mercato** e il matching di alcuni casi ambigui.

## Correzioni V603

1. **Badge Mercato semplificati**
   - un solo badge per cella;
   - valori ammessi: `NUOVO`, `RUMOR`, `CONFERMATO`;
   - priorita: `NUOVO` > `RUMOR` > `CONFERMATO`.

2. **Gaetano Atalanta**
   - in V602 risultava `In rosa` perche la nota ufficiale era indicizzata come `Gianluca Gaetano`;
   - V603 aggiunge la nota anche alla chiave `Gaetano` e marca il giocatore come nuovo acquisto Atalanta.

3. **Giovane Napoli / Atalanta**
   - il matching listone usa il nome originale e la squadra;
   - `Giovane (Napoli)` e associato al record listone NAP e alla rosa fantacalcio `Real Pisistrius`;
   - `Giovane (Atalanta)` non eredita il record Napoli.

## File modificati

- `static/fanta-engine/js/sections/sudatori-section-v603.js`
- `static/fanta-engine/css/sudatori-section-v603.css`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v603.mjs`
- index/config delle due leghe
- documentazione V603

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v603.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v603.js
```
