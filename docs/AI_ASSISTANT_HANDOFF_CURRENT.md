# AI Assistant Handoff - CURRENT

## Stato
- Versione corrente overlay: **V609**.
- Nuova app: **ioSudo PWA**.
- Dati letti dall'app: `static/fanta-engine/data/sudatori/current/manifest.json` e `sudatori-data.json`.
- Dati Sudatori correnti invariati rispetto a V608.
- App shell: `static/iosudo/index.html`.
- JS app: `static/fanta-engine/js/apps/iosudo-app-v609.js`.
- CSS app: `static/fanta-engine/css/iosudo-app-v609.css`.
- Service worker: `static/iosudo/sw.js`.

## Modifiche chiave
- Aggiunta mini app installabile **ioSudo** per consultare solo Per i SUDATORI da mobile.
- L'app non duplica i dati: usa il manifest e il JSON corrente della sezione Sudatori.
- Aggiunti link `ioSudo` nelle home di `zonaorientale` e `fantapetillomantramanager`.
- Aggiunte pagine redirect `/zonaorientale/iosudo/` e `/fantapetillomantramanager/iosudo/` verso `/iosudo/`.
- Aggiunto service worker con app shell cache-first e dati Sudatori network-first/no-store.
- Mantenuti i dati V608: riepilogo mercato, card trattative aggregate, infortunati e probabili XI.

## Verifica
```bash
node static/fanta-engine/tools/audit-iosudo-v609.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v609.js
node --check static/iosudo/sw.js
```
