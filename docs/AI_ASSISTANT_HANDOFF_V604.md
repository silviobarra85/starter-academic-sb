# AI Assistant Handoff - V604 Sudatori

Versione corrente: **V604**.

## Stato

La sezione **Per i SUDATORI** mantiene i dati dell'Excel del 2026-07-11, ma corregge la colonna **Mercato** e il matching di alcuni casi ambigui.

## Correzioni V604

1. **Badge Mercato semplificati**
   - un solo badge per cella;
   - valori ammessi: `NUOVO`, `RUMOR`, `CONFERMATO`;
   - priorita: `NUOVO` > `RUMOR` > `CONFERMATO`.

2. **Gaetano Atalanta**
   - in V602 risultava `In rosa` perche la nota ufficiale era indicizzata come `Gianluca Gaetano`;
   - V604 aggiunge la nota anche alla chiave `Gaetano` e marca il giocatore come nuovo acquisto Atalanta.

3. **Giovane Napoli / Atalanta**
   - il matching listone usa il nome originale e la squadra;
   - `Giovane (Napoli)` e associato al record listone NAP e alla rosa fantacalcio `Real Pisistrius`;
   - `Giovane (Atalanta)` non eredita il record Napoli.


## Perche V603 sbagliava i badge

La logica V603 cercava la parola `mercato` dentro tutto il testo del giocatore. Siccome i giocatori senza segnalazioni hanno come dettaglio neutro `Nessuna segnalazione mercato rilevante nelle fonti consultate`, anche loro venivano classificati come `RUMOR`.

V604 separa i testi neutri dai veri segnali di mercato: `Nessuna segnalazione mercato` produce `CONFERMATO`; le note TMW/Transfermarkt reali producono `RUMOR`; i nuovi acquisti ufficiali producono `NUOVO`.

## File modificati

- `static/fanta-engine/js/sections/sudatori-section-v604.js`
- `static/fanta-engine/css/sudatori-section-v604.css`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v604.mjs`
- index/config delle due leghe
- documentazione V604

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v604.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v604.js
```
