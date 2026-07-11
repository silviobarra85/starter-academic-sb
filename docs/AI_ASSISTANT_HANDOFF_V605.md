# AI Assistant Handoff - CURRENT

Versione corrente overlay: **V605**.

## Stato
- Sezione **Per i SUDATORI** aggiornata con `fantacalcio_serie_a_2026_27_tm_pagine_1_20_2026-07-11(1).xlsx`.
- Dati caricati da `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- Badge Mercato: un solo badge per riga: `NUOVO`, `RUMOR`, `CONFERMATO`.
- Correzioni V598/V604 mantenute: destra/sinistra campetto, badge fisico solo per segnalazioni, testo neutro mercato non genera RUMOR.
- Giovane Napoli/Atalanta resta disambiguato; Gaetano Atalanta resta nuovo acquisto.

## Numeri V605
- Squadre: 20
- Giocatori: 724
- Amichevoli: 89
- Trattative/rumors squadra: 152
- Rumors Transfermarkt: 45
- Pagine Transfermarkt tracciate: 20
- Infortunati/SOS: 6

## Verifica
```bash
node static/fanta-engine/tools/audit-sudatori-section-v605.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v605.js
```
