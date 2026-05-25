# AI HANDOFF ZonaOrientale - V213

## Stato

La versione corrente e V213.

V213 e un overlay di refactor, non introduce nuove funzionalita utente.

## Modifica principale

La logica admin di pubblicazione dati e stata estratta da `assets/app.js` in:

```text
static/zonaorientale/assets/js/refactor/admin-publication-workflow-v213.js
```

Il modulo contiene le implementazioni storiche:

- V190 Stato Firebase / JSON
- V191 Procedura guidata Pubblica aggiornamenti
- V203 sync tra preflight asset pubblici e semafori pubblicazione

## File principali coinvolti

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/refactor/admin-publication-workflow-v213.js
```

## Moduli refactor attuali

```text
assets/js/refactor/live-data-archive-v209.js
assets/js/refactor/admin-communication-generator-v210.js
assets/js/refactor/historical-stats-compare-v211.js
assets/js/refactor/president-dashboard-rosters-v212.js
assets/js/refactor/admin-publication-workflow-v213.js
```

## Pattern tecnico

`app.js` importa il modulo e lo installa con:

```js
installAdminPublicationWorkflowRefactorV213({ ...deps })
```

Gli override vengono fatti tramite getter/setter passati dal file principale, per evitare riassegnazioni non sicure di import o `const`.

In particolare il modulo puo aggiornare:

- `renderAdminArea`
- `renderAdminLightGateV178`
- `renderAdminHelpPanelV185`
- `runPublicAssetsPreflightV179`

## Funzioni esposte

Il modulo continua a popolare:

```js
window.ZonaOrientalePublicationStatus
window.ZonaOrientalePublishWizard
```

Quindi da console restano disponibili:

```js
ZonaOrientalePublicationStatus.check()
ZonaOrientalePublicationStatus.last()
ZonaOrientalePublicationStatus.rows()
ZonaOrientalePublicationStatus.syncFromPreflight()
ZonaOrientalePublicationStatus.reset()

ZonaOrientalePublishWizard.build()
ZonaOrientalePublishWizard.last()
ZonaOrientalePublishWizard.commands()
ZonaOrientalePublishWizard.copy()
```

## Cosa verificare dopo modifiche future

- Admin -> Stato Firebase / JSON
- Admin -> Controlla solo asset pubblici
- Admin -> Procedura guidata Pubblica aggiornamenti
- Admin -> Checklist online finale
- Mobile Admin senza sforamenti laterali

## Comandi test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/refactor/admin-publication-workflow-v213.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
```

## Avvertenza

Non rimuovere gli alias in `app.js` finche non e certo che nessun blocco storico o debug console li usi ancora.
