# V575 - Tabelle giocatori mobile con classi runtime dedicate

## Obiettivo
Rendere effettiva l'uniformazione mobile delle tabelle giocatori: Area Squadra, Rose e Listone.

## Perche V574 non bastava
Le tabelle Area Squadra/Rose vengono renderizzate dinamicamente da template diversi e alcune regole legacy hanno specificita superiore. V574 usava selettori CSS generici; in diversi punti non bastava per forzare colori, sticky column e stile Listone.

## Modifiche
- Nuovo CSS: `static/fanta-engine/css/player-tables-mobile-v575.css`.
- Nuovo runtime leggero: `static/fanta-engine/js/ui/player-tables-mobile-v575.js`.
- Il runtime assegna classi dedicate alle tabelle e alle colonne.
- Role detection da `data-player-role`, colonna ruolo o testo cella.
- Stili separati per:
  - Area Squadra / Dashboard Presidente;
  - Rose;
  - Listone.
- Riga colorata per ruolo P/D/C/A.
- Prima colonna sticky e opaca.
- Header sticky e opaco.
- Nome giocatore non troncato.
- Link giocatore invariato.

## Audit
`node static/fanta-engine/tools/audit-player-tables-mobile-v575.mjs`
