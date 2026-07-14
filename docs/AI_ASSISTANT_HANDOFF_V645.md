# AI Assistant Handoff V645

## Contesto

L'utente ha segnalato un leggero rallentamento nella vista `GIOCATORI` di ioSudo e ha richiesto di mostrare, nella sezione `XI` di ogni squadra, la fantasy squadra del giocatore quando disponibile.

## Intervento

File principali:

- `static/fanta-engine/js/apps/iosudo-app-v645.js`
- `static/fanta-engine/css/iosudo-app-v645.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v645.mjs`

Cambiamenti:

- introdotta cache `playerRowsCache` per la vista globale `GIOCATORI`;
- introdotto indice testuale `_iosudoPlayerSearchText` per filtrare senza ricalcolare listone/rose/mercato a ogni input;
- introdotto debounce `scheduleRenderResults` sull'input di ricerca;
- aggiunto badge testuale `.iosudo-pitch-fantasy` nelle caselle del probabile XI;
- aggiornati riferimenti e service worker a V645.

## Vincoli rispettati

- Nessun dato Sudatori/listone/rose modificato.
- Nessuna informazione esistente dell'app rimossa.
- Overlay pensato per essere applicato sopra V644.

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v645.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v645.js
node --check static/iosudo/sw.js
```
