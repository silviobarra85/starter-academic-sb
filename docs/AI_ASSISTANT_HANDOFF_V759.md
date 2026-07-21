# AI Assistant Handoff V759

## Obiettivo raggiunto

ZonaOrientale usa un bootstrap static-first strutturale. I dati pubblici vengono caricati e renderizzati dagli snapshot locali prima di importare Firebase/Auth. La V758 emergenziale con timeout e override runtime è stata rimossa.

## Architettura di avvio

1. `static/zonaorientale/assets/app.js` avvia `createStaticFirstBootstrapV759`.
2. `loadDataForCurrentAuthV100()` in modalità pubblica usa config e snapshot statici V171-V173.
3. il coordinatore verifica `state.usedPublicSnapshots` e dati utilizzabili.
4. dopo il primo render viene chiamato `setupAuthV759()`.
5. `ensureFirebaseRuntimeV759()` importa dinamicamente `./firebase.js`.
6. un errore Firebase viene registrato ma non invalida il sito pubblico.

## File chiave

- `static/fanta-engine/js/core/static-first-bootstrap-v759.js`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/data/repository-v222.js`
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/zonaorientale/assets/public/config.json`
- `static/zonaorientale/assets/snapshots/seasons/manifest.json`
- `static/zonaorientale/assets/snapshots/seasons/2026-2027.json`
- `static/zonaorientale/assets/snapshots/honor.json`

## Guardrail

- Non reintrodurre import statici di `firebase.js` o `firestore-service.js` nel grafo di `app.js`.
- Non legare il render pubblico a `onAuthStateChanged`.
- Non aggiungere timeout/watchdog per forzare i dati: correggere la sequenza o il contratto dei file.
- I JSON in `current/`, `assets/public/` e `assets/snapshots/` devono essere rivalidati dal CDN.
- Tutti gli import di `league-config-v443.js` in ZonaOrientale devono usare la stessa URL/versione.

## FantaEngine

FantaEngine è il livello condiviso e non deve conoscere path o logica specifica della lega. Il coordinatore V759 riceve callback. Restano da separare runtime corrente e archivio storico delle numerose versioni.

## ioSudo

Il manifest corrente punta a `sudatori-runtime.json` (3.684.800 byte). `sudatori-data.json` (12.432.411 byte) resta archivio tecnico. Non rimuovere l'archivio finché tool e audit storici non sono migrati.

Chiavi runtime necessarie:

`meta`, `teams`, `playersByTeam`, `formationsByTeam`, `marketSummaryByTeam`, `injuriesByTeam`, `friendliesByTeam`, `friendlyPlayerStatsByMatch`.

## Verifica obbligatoria

```bash
node static/zonaorientale/tools/audit-static-first-v759.mjs
node static/fanta-engine/tools/audit-iosudo-v751.mjs
node static/zonaorientale/tools/audit-league-config-v443.mjs
node static/zonaorientale/tools/audit-static-data-paths-config-v446.mjs
node --check static/zonaorientale/assets/app.js
```

## Debito tecnico prioritario

- snapshot pubblici generati il 16/07/2026: automatizzare pubblicazione atomica;
- aggiungere test Playwright con Firebase bloccato;
- estrarre bootstrap/auth/data loading dal monolite `app.js`;
- retention delle copie versionate in FantaEngine;
- consolidare i 24 CSS e 15 script della home;
- rimuovere dal percorso `static/` documentazione/storico non destinati al pubblico.

Per dettagli: `docs/SITE_AUDIT_V759.md`.
