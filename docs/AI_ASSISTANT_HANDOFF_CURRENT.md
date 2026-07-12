# AI Assistant Handoff - CURRENT

## Stato corrente
- Versione corrente overlay: **V613**.
- Area interessata: **ioSudo**, mini app PWA collegata ai dati della sezione **Per i SUDATORI**.
- Dati condivisi: `static/fanta-engine/data/sudatori/current/manifest.json` e `sudatori-data.json`.
- JS app: `static/fanta-engine/js/apps/iosudo-app-v613.js`.
- CSS app: `static/fanta-engine/css/iosudo-app-v613.css`.

## Modifiche V613
- Le fonti multiple nelle card mercato dei giocatori vengono mostrate come chip separati.
- Ogni fonte e cliccabile singolarmente.
- Aggiunti fallback URL per TMW, Sky, Transfermarkt e SOS Fanta quando nel dataset arriva una fonte testuale senza link diretto.
- Mantenute le feature V612: card squadra colorate, dettaglio giocatore, colori ruolo, menu squadra sticky e ricerca nascosta in apertura squadra.

## Verifiche
```bash
node static/fanta-engine/tools/audit-iosudo-v613.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v613.js
node --check static/iosudo/sw.js
```
