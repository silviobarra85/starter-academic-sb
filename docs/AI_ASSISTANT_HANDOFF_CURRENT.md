# AI Assistant Handoff - CURRENT

## Stato
- Versione corrente overlay: **V610**.
- App: **ioSudo PWA** collegata alla sezione **Per i SUDATORI**.
- Dati letti dall'app: `static/fanta-engine/data/sudatori/current/manifest.json` e `sudatori-data.json`.
- Dati Sudatori correnti invariati rispetto a V608/V609.
- App shell: `static/iosudo/index.html`.
- JS app: `static/fanta-engine/js/apps/iosudo-app-v610.js`.
- CSS app: `static/fanta-engine/css/iosudo-app-v610.css`.
- Service worker: `static/iosudo/sw.js`.

## Modifiche V610
- Nuovo logo ioSudo: personaggio che suda pensando alla formazione del fantacalcio.
- Header superiore reso molto piu compatto: una riga con `ioSudo - nome lega - Vai al sito`.
- Il nome lega viene risolto dal parametro `?league=` usato dai redirect di lega.
- La card di ricerca resta subito sotto la barra compatta.
- Nella tab **Rosa** della scheda squadra, i giocatori sono ordinati da **P** ad **A**: P, D, C/M/W/T, A.
- Mantenuta la lettura condivisa dei dati Sudatori: niente dati duplicati.

## Verifica
```bash
node static/fanta-engine/tools/audit-iosudo-v610.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v610.js
node --check static/iosudo/sw.js
```
