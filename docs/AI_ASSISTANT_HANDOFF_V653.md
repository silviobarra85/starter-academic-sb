# AI Assistant Handoff V653

## Stato

ioSudo V653 corregge la vista globale **GIOCATORI**: devono comparire anche i giocatori presenti solo in rumor/trattative/ufficialità, purché la riga mercato sia collegata a una squadra Serie A.

## Dettaglio tecnico

File principali:

- `static/fanta-engine/js/apps/iosudo-app-v653.js`
- `static/fanta-engine/css/iosudo-app-v653.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v653.mjs`

La funzione chiave è `addMarketOnlyPlayersToFastRows`, richiamata da `collectFastPlayerRows`. Crea giocatori virtuali dalle righe mercato non agganciate a `state.allPlayers` o listone.

Caso da verificare manualmente: cercare `Garnacho` nella sezione GIOCATORI. Deve comparire come RUMOR con traiettoria `Chelsea -> Roma` se i dati V649/V23 sono ancora quelli correnti.
