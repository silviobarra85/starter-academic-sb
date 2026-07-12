# AI Assistant Handoff V617

Versione: **V617**

## Scopo
Aggiorna Per i SUDATORI e ioSudo con il nuovo Excel `mercato_fonti_extra_v2`.

## Delta rilevato rispetto alla V616

- Nuova scheda di log: `Agg_12_07_Fonti_News`.
- Fonti aggiunte: 7.
- Righe trattative aggiunte: 10.
- Righe controllo ritiri/amichevoli aggiunte: 2.
- Rose, ufficialità, infortunati, rumors TM e probabili formazioni risultano invariati rispetto a V616.

## Conteggi dataset

- Giocatori: 714.
- Amichevoli reali: 90.
- Card trattative aggregate: 171.
- Ufficialità in entrata: 97.
- Ufficialità in uscita: 135.
- Fonti totali: 102.

## File principali

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/sections/sudatori-section-v617.js`
- `static/fanta-engine/js/apps/iosudo-app-v617.js`

## Nota deduplica

V617 aggrega anche alias/cognomi nella stessa card trattativa quando il nome esteso e il solo cognome indicano lo stesso giocatore.
