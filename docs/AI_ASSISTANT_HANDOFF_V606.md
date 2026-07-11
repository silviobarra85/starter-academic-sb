# AI Assistant Handoff - CURRENT

Versione corrente overlay: **V606**.

## Stato
- Sezione **Per i SUDATORI** aggiornata con `fantacalcio_serie_a_2026_27_aggiornato_2026-07-11_pomeriggio(1).xlsx`.
- Dati caricati da `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- Badge Mercato invariati e corretti: un solo badge per riga (`NUOVO`, `RUMOR`, `CONFERMATO`).
- Correzioni precedenti mantenute: destra/sinistra campetto, badge fisico solo per segnalazioni, testo neutro mercato non genera RUMOR.
- Disambiguazione Giovane Napoli/Atalanta mantenuta; Gaetano Atalanta resta nuovo acquisto.

## Numeri V606
- Squadre: 20
- Giocatori: 724
- Amichevoli: 89
- Trattative/rumors squadra: 162
- Rumors Transfermarkt: 48
- Pagine Transfermarkt tracciate: 20
- Infortunati/SOS: 6
- Formazioni mancanti/fuori rosa: 0

## Verifica
```bash
node static/fanta-engine/tools/audit-sudatori-section-v606.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v606.js
```
