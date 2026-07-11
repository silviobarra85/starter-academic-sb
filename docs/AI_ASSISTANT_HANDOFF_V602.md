# AI Assistant Handoff - V602 Sudatori

Versione corrente: **V602**.

## Stato

Overlay UI sulla sezione **Per i SUDATORI**: mantiene i dati V601 generati dall'Excel `fantacalcio_serie_a_2026_27_aggiornato_raduni_rumors_2026-07-11(1).xlsx`, ma corregge la colonna **Mercato** della tabella rosa.

## Correzione V602

La colonna **Mercato** ora usa tutte le note mercato collegate al giocatore tramite `marketNotesByPlayer`, non solo `player.marketStatus`. Questo risolve il caso in cui un giocatore aveva `marketStatus = In rosa`, ma aveva comunque una voce/rumor presente nelle note, ad esempio da Transfermarkt.

Regole UI:

- se non ci sono segnalazioni, resta `In rosa` in tono neutro;
- se c'e una segnalazione mercato, appare un badge;
- se la fonte e Transfermarkt, appare un badge con prefisso `TM`;
- vengono mostrati fino a 3 badge per giocatore, con contatore `+N` per eventuali note aggiuntive.

## File principali

- `static/fanta-engine/js/sections/sudatori-section-v602.js`
- `static/fanta-engine/css/sudatori-section-v602.css`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v602.mjs`

## Verifiche attese

```bash
node static/fanta-engine/tools/audit-sudatori-section-v602.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v602.js
```

## Nota futura

Per successivi aggiornamenti Excel, mantenere questa logica: la colonna **Mercato** deve mostrare qualunque rumor/segnalazione associata al giocatore, inclusi i record provenienti da Transfermarkt, anche quando lo stato base del giocatore e `In rosa`.
