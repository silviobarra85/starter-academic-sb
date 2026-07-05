# V573 - Taratura mobile colonne tabelle giocatori

La V573 aggiorna la visualizzazione mobile delle tre tabelle con giocatori:

- Area Squadra / Dashboard Presidente
- Rose
- Listone

## Regole mobile

- La colonna del giocatore viene raddoppiata rispetto alla V572:
  - `min-width: clamp(17rem, 92vw, 27rem)`
  - `max-width: clamp(20rem, 108vw, 30rem)`
- La colonna Stato viene compattata a `3.25rem`.
- Le colonne Costo e Qt.A vengono uniformate a `3.75rem`.
- Header, nomi colonne e celle sono allineati a sinistra.
- Le righe colorate per ruolo restano attive:
  - P giallo
  - D verde
  - C blu
  - A rosso
- Prima colonna e intestazione restano sticky e opache.
- Il nome giocatore non viene tagliato e puo andare a capo.
- Il link al profilo Fantacalcio/Fantagazzetta resta invariato.

## Note
Gli stili restano separati per scope CSS, cosi Area Squadra, Rose e Listone possono essere ritoccati in futuro senza influenzarsi a vicenda.
