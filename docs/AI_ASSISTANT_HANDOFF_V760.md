# AI Assistant Handoff V760

## Problema osservato

Il footer V759 era visibile, ma i dati non venivano renderizzati. Il footer e HTML statico e puo essere aggiornato anche quando il grafo JavaScript o i JSON della stessa release non sono stati pubblicati correttamente.

## Diagnosi

La V759 completa funziona localmente con Firebase bloccato. Il caso di produzione e quindi verosimilmente un deploy misto/incompleto o un file statico essenziale assente.

Fragilita V759 corrette:

- import statico di un nuovo modulo FantaEngine capace di bloccare tutto il grafo;
- fallback Firebase ancora possibile quando config/snapshot statici mancavano;
- caricamento di tutti gli asset complementari prima del primo render;
- assenza di errore visibile quando il modulo applicativo non si importava;
- audit non eseguito sul contenuto finale `public/`.

## Contratto V760

1. Il bootstrap pubblico usa solo config e snapshot statici.
2. Non usare Firebase come fallback del primo avvio.
3. Renderizzare prima gli asset essenziali.
4. Caricare listoni, rose archiviate e calendari in background.
5. Avviare Auth/Firebase soltanto dopo il render pubblico.
6. Un errore Firebase non deve cancellare i dati pubblici.
7. Il deploy deve fallire se sorgenti e artefatti pubblicati non sono coerenti.

## File principali

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/public/config.json`
- `static/zonaorientale/assets/snapshots/seasons/manifest.json`
- `static/zonaorientale/assets/snapshots/honor.json`
- `static/fanta-engine/js/core/static-first-bootstrap-v760.js`
- `static/zonaorientale/tools/audit-static-first-v760.mjs`
- `static/zonaorientale/tools/check-live-v760.mjs`
- `netlify/build-hugo-0.80.sh`
- `netlify.toml`

## Diagnostica browser

- `window.ZonaOrientaleModuleEntryV760`
- `window.ZonaOrientaleBootstrapV760`
- `window.ZonaOrientaleFirebaseRuntimeV760`
- evento `fanta:public-core-ready-v760`
- evento `fanta:static-assets-ready-v760`

## Verifiche obbligatorie

```bash
node --check static/zonaorientale/assets/app.js
node --check static/fanta-engine/js/core/static-first-bootstrap-v760.js
node static/zonaorientale/tools/audit-static-first-v760.mjs .
node static/zonaorientale/tools/check-live-v760.mjs https://silviobarra.com
```

Il check live va eseguito dopo ogni deploy. Non considerare riuscita una release solo perche il footer mostra la nuova versione.

## FantaEngine e ioSudo

FantaEngine definisce contratti e asset comuni, ma il primo render di una lega deve poter utilizzare i propri snapshot locali anche in modalita degradata. ioSudo e un consumer autonomo dei dataset FantaEngine e non va accoppiato al bootstrap ZonaOrientale.

## Prossime priorita

1. E2E Playwright nel CI di Netlify con Firebase bloccato.
2. Pubblicazione atomica automatica di config, manifest e snapshot.
3. Estrazione bootstrap/auth/data loader dal monolite `app.js`.
4. Manifest runtime stabile e retention delle copie storiche FantaEngine.
