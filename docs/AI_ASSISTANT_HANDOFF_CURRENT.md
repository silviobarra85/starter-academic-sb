# AI Assistant Handoff - CURRENT

## Stato

- Versione corrente overlay: **V611**.
- App: **ioSudo PWA** collegata alla sezione **Per i SUDATORI**.
- Dati letti dall'app: `static/fanta-engine/data/sudatori/current/manifest.json` e `sudatori-data.json`.
- App shell: `static/iosudo/index.html`.
- JS app: `static/fanta-engine/js/apps/iosudo-app-v611.js`.
- CSS app: `static/fanta-engine/css/iosudo-app-v611.css`.
- Service worker: `static/iosudo/sw.js`.

## Modifiche V611

- Badge/card giocatore cliccabili con apertura del dettaglio giocatore.
- Card giocatore colorate per ruolo: P giallo, D verde, C blu, A rosso.
- Quando una squadra e aperta, la card ricerca viene nascosta.
- Il menu squadra resta sticky sopra le sezioni.
- Mantenuta la lettura condivisa dei dati Sudatori: niente dati duplicati.

## Verifica

```bash
node static/fanta-engine/tools/audit-iosudo-v611.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v611.js
node --check static/iosudo/sw.js
```
