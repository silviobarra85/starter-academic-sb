# AI Assistant Handoff - CURRENT

## Stato

- Versione corrente overlay: **V612**.
- App: **ioSudo PWA** collegata alla sezione **Per i SUDATORI**.
- Dati letti dall'app: `static/fanta-engine/data/sudatori/current/manifest.json` e `sudatori-data.json`.
- App shell: `static/iosudo/index.html`.
- JS app: `static/fanta-engine/js/apps/iosudo-app-v612.js`.
- CSS app: `static/fanta-engine/css/iosudo-app-v612.css`.
- Service worker: `static/iosudo/sw.js`.

## Modifiche V612

- Card squadre di ioSudo colorate a righe secondo i colori sociali richiesti.
- Testi e badge leggibili con colore dedicato per squadra.
- Mantenuti dettaglio giocatore cliccabile, colori ruolo, ricerca nascosta a squadra aperta e menu sticky.
- Nessuna duplicazione dati: ioSudo legge ancora i JSON correnti di Sudatori.

## Verifica

```bash
node static/fanta-engine/tools/audit-iosudo-v612.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v612.js
node --check static/iosudo/sw.js
```
