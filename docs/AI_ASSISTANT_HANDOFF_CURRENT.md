# AI Assistant Handoff corrente

Versione corrente: V578 - Colonna giocatore mobile dimezzata
Data: 06/07/2026

## Stato

Baseline operativa con Calciomercato disattivato, Svincola Giocatori attivo su ZonaOrientale e tabelle giocatori mobile gestite dal layer V578.

## Correzione V578

- Mantiene gli override V577 che avevano finalmente applicato lo stesso stile mobile ad Area Squadra, Rose e Listone.
- Dimezza ulteriormente la colonna Giocatore da mobile.
- Listone passa da `clamp(17rem, 92vw, 27rem)` a `clamp(8.5rem, 46vw, 13.5rem)`.
- Area Squadra e Rose passano da `clamp(10.25rem, 54vw, 14rem)` a `clamp(5.25rem, 28vw, 7rem)`.
- I nomi giocatore restano non troncati e possono andare a capo.
- Prima colonna sticky/opaca, header sticky/opaco e colori per ruolo restano invariati.

## Nota critica

Non reintrodurre il resize tabelle V570/V571. Per modifiche future usare `player-tables-mobile-v578.css` e `player-tables-mobile-v578.js`, mantenendo separati i target `teamarea`, `rose` e `listone`.
