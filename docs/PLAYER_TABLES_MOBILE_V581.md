# V581 - Tabelle giocatori mobile single-source

V581 sostituisce il tentativo V580 di clonare lo stile computato del Listone con uno stile unico, esplicito e applicato a tutte le tre tabelle giocatori:

- Area Squadra / Dashboard Presidente;
- Rose;
- Listone.

## Perche era necessario
Con V580 le tre tabelle potevano risultare diverse perche il Listone restava sotto gli stili storici, mentre Area Squadra e Rose ricevevano stili clonati/fallback. Inoltre alcuni CSS legacy con `!important` potevano ancora vincere su font e colori.

## Implementazione
- Nuovo CSS: `static/fanta-engine/css/player-tables-mobile-v581.css`.
- Nuovo runtime: `static/fanta-engine/js/ui/player-tables-mobile-v581.js`.
- Il runtime marca tutte le tabelle con `data-player-table-v581` e applica lo stesso stile mobile inline `important`.
- V580 non viene piu caricato dagli HTML.

## Stile mobile applicato
- Font unico: `0.68rem`.
- Celle allineate a sinistra.
- Header sticky e opaco.
- Prima colonna sticky e opaca.
- Colonna giocatore compatta: `clamp(5.25rem, 28vw, 7rem)`.
- Colonna Stato: `3.75rem`.
- Colori ruolo coerenti per tutte le tabelle:
  - P: giallo/arancione;
  - D: verde;
  - C: azzurro/blu;
  - A: rosso.

## Note
Lo stile e mobile-only. Desktop non viene modificato.
