# AI Assistant Handoff - V608

## Stato
- Versione corrente overlay: **V608**.
- Excel sorgente: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-12(1).xlsx`.
- Dati Sudatori: `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- JS: `static/fanta-engine/js/sections/sudatori-section-v608.js`.
- CSS: `static/fanta-engine/css/sudatori-section-v608.css`.

## Modifiche chiave
- Aggiunto `marketSummaryByTeam` con ufficialità/trattative in entrata e uscita per ciascuna squadra.
- Aggiunto `officialMovesByTeam` per separare le ufficialità dalla card delle trattative.
- `teamTransferTalksByTeam` ora contiene una sola card per giocatore, con `sources[]` aggregato.
- Filtrate dalle trattative le notizie collegate a giocatori presenti in `Ufficialita`.

## Numeri V608
- Squadre: 20
- Giocatori: 714
- Amichevoli: 90
- Card trattative aggregate: 169
- Ufficialità: 226 (95 entrata, 131 uscita)
- Infortunati/SOS: 7
- Formazioni mancanti/fuori rosa: 0

## Verifica
```bash
node static/fanta-engine/tools/audit-sudatori-section-v608.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v608.js
```
