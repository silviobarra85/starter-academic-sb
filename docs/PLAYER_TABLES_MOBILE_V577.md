# V577 - Tabelle giocatori mobile override Area/Rose

## Tabelle coinvolte

- Area Squadra / Dashboard Presidente / pagina squadra: `data-player-table-v577="teamarea"`.
- Rose: `data-player-table-v577="rose"`.
- Listone: `data-player-table-v577="listone"`.

## Larghezze mobile

- Listone mantiene la colonna Giocatore ampia: `clamp(17rem, 92vw, 27rem)`.
- Rose e Area Squadra usano colonna Giocatore compatta: `clamp(10.25rem, 54vw, 14rem)`.

## Perche serve JS oltre al CSS

Le tabelle Area Squadra/Rose ereditano classi storiche condivise con il Listone. Alcuni CSS legacy hanno `!important` e target specifici su `table.team-profile-roster-table` e `#rosterClubCards`. V577 marca le tabelle dopo il render e applica anche stili inline mobile-only con priorita `important`.

## Verifica manuale

1. Aprire da smartphone ZonaOrientale.
2. Login presidente.
3. Area Squadra -> Apri pagina squadra.
4. Verificare colori ruolo e prima colonna opaca/sticky.
5. Aprire Rose, espandere una rosa e verificare colonna Giocatore piu piccola.
6. Verificare che Listone sia rimasto invariato.
