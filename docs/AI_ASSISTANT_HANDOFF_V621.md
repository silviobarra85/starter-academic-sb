# AI Assistant Handoff - V621

## Stato

Overlay V621 per ioSudo.

## Modifiche principali

- Non incorpora le modifiche V620 come overlay separato: la base funzionale resta V619.
- ioSudo ora mostra la sezione **Giocatori** anche senza query di ricerca.
- `state.allPlayers` viene costruito da:
  - giocatori reali in `playersByTeam`;
  - proxy generati da `marketSummaryByTeam.*.officialIncoming`;
  - proxy generati da `marketSummaryByTeam.*.talksIncoming`.
- I proxy vengono creati solo se il giocatore non risulta gia' nella rosa reale della squadra di destinazione.
- Vengono esclusi i casi strategici/non giocatore come `Rosa da sfoltire`.
- Ogni card giocatore usa `data-player-id` e apre `renderPlayerDetail`.

## File modificati

- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v621.js`
- `static/fanta-engine/css/iosudo-app-v621.css`
- `static/fanta-engine/tools/audit-iosudo-v621.mjs`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/assets/league-config.json`
- docs V621

## Test

```bash
node static/fanta-engine/tools/audit-iosudo-v621.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v621.js
node --check static/iosudo/sw.js
```
