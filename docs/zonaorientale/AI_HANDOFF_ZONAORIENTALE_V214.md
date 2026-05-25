# AI Handoff ZonaOrientale - V214

## Stato
V214 e un hotfix di stabilizzazione dopo V213.

## Motivazione
Il refactor V213 del workflow pubblicazione admin poteva impedire la visualizzazione dei dati. V214 rimuove il nuovo modulo V213 dal bootstrap e ripristina la logica inline stabile presente fino a V212/V203.

## File chiave
- static/zonaorientale/index.html
- static/zonaorientale/assets/app.js
- static/zonaorientale/assets/js/refactor/president-dashboard-rosters-v212.js

## Refactor attivi da mantenere
- assets/js/refactor/live-data-archive-v209.js
- assets/js/refactor/admin-communication-generator-v210.js
- assets/js/refactor/historical-stats-compare-v211.js
- assets/js/refactor/president-dashboard-rosters-v212.js

## Attenzione
Non reintrodurre il modulo `admin-publication-workflow-v213.js` senza testare il bootstrap in browser. Se si riprende quel refactor, farlo con installazione lazy e try/catch, senza bloccare `startZonaOrientaleAppV173()`.

## Test consigliati
- Dashboard pubblica
- Albo
- Statistiche
- Confronta
- Archivio con cambio stagione
- Dashboard Presidente
- Admin: Stato Firebase/JSON, Procedura guidata, Checklist online
