# AI Assistant Handoff - V607

Versione corrente overlay: **V607**.

## Stato
- Sezione **Per i SUDATORI** aggiornata con `fantacalcio_serie_a_2026_27_aggiornato_finale_2026-07-11(1).xlsx`.
- Dati caricati da `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- Badge Mercato invariati e corretti: un solo badge per riga (`NUOVO`, `RUMOR`, `CONFERMATO`).
- Correzioni precedenti mantenute: destra/sinistra campetto, badge fisico solo per segnalazioni, testo neutro mercato non genera RUMOR.
- Disambiguazione Giovane Napoli/Atalanta mantenuta; Gaetano Atalanta resta nuovo acquisto.
- Controlli finali rose applicati: rimozioni/uscite e casi da non rimuovere documentati in `finalRosterControls`.

## Numeri V607
- Squadre: 20
- Giocatori: 713
- Amichevoli: 89
- Trattative/rumors squadra: 175
- Rumors Transfermarkt: 48
- Pagine Transfermarkt tracciate: 20
- Infortunati/SOS: 7
- Formazioni mancanti/fuori rosa: 0

## Verifica
```bash
node static/fanta-engine/tools/audit-sudatori-section-v607.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v607.js
```
