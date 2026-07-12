# AI Assistant Handoff - V610

## Obiettivo
Correggere e rifinire la prima versione di **ioSudo**.

## Richieste recepite
1. Aggiungere un logo coerente con il nome: un personaggio che suda pensando alla formazione del fantacalcio.
2. Ridurre il banner superiore a una barra compatta con `ioSudo - <nome lega> - Vai al sito`.
3. Lasciare subito sotto la card di ricerca e poi l'elenco squadre/risultati.
4. Nella scheda squadra, tab **Rosa**, ordinare i giocatori da **P** ad **A**, non al contrario.

## File principali
- `static/iosudo/index.html`
- `static/iosudo/assets/icon.svg`
- `static/iosudo/assets/icon-192.png`
- `static/iosudo/assets/icon-512.png`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v610.js`
- `static/fanta-engine/css/iosudo-app-v610.css`
- `static/fanta-engine/tools/audit-iosudo-v610.mjs`

## Note tecniche
- `setupLeagueChrome()` risolve il nome lega dal parametro `?league=`.
- `roleOrder()` impone l'ordinamento rosa P -> D -> C -> A.
- Il service worker passa alla cache `iosudo-shell-v610` e carica la app shell V610.
- I dati Sudatori restano letti da `static/fanta-engine/data/sudatori/current/`.

## Verifica
```bash
node static/fanta-engine/tools/audit-iosudo-v610.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v610.js
node --check static/iosudo/sw.js
```
