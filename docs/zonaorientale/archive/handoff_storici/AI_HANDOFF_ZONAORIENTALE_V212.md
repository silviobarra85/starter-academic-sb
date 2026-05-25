# AI Handoff ZonaOrientale - V212

## Stato progetto

Versione corrente: **V212 refactor dashboard presidente**.

Il sito e una webapp statica HTML/CSS/JS puro sotto:

```text
static/zonaorientale/
```

Non c'e build system. Le modifiche devono essere consegnate come overlay zip con struttura completa `static/zonaorientale/...` e `docs/zonaorientale/...`.

## Regole operative utente

Ad ogni overlay:

- aggiornare Version nel footer di `index.html`
- aggiornare cache-buster `v=XXX`
- aggiornare `DEPLOY_EXPECTED_VERSION_V181` in `app.js`
- includere `REFACTOR_VXXX.md`
- includere `AI_HANDOFF_ZONAORIENTALE_VXXX.md`
- aggiornare `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- fornire comandi Git
- fornire comandi locali:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

## Moduli refactor attuali

Sono presenti moduli estratti da `app.js`:

```text
assets/js/refactor/live-data-archive-v209.js
assets/js/refactor/admin-communication-generator-v210.js
assets/js/refactor/historical-stats-compare-v211.js
assets/js/refactor/president-dashboard-rosters-v212.js
```

## V212: cosa e stato fatto

La V212 estrae da `app.js` la logica V192/V201 relativa a:

- Dashboard Presidente
- conteggio rosa presidente da raw/snapshot/static rosters
- override robusto di `getRosterForSeasonTeam`
- hub mobile presidente
- hook renderUserArea/renderAll
- inserimento della voce Dashboard Presidente nella guida Admin

Il nuovo modulo e:

```text
assets/js/refactor/president-dashboard-rosters-v212.js
```

In `app.js` rimangono alias compatibili, perche V202 e V204 li usano ancora:

```js
const getTeamNameKeysV201 = presidentDashboardRostersV212.getTeamNameKeys;
const getTeamKeysFromRecordV201 = presidentDashboardRostersV212.getTeamKeysFromRecord;
const findSeasonTeamForRosterV201 = presidentDashboardRostersV212.findSeasonTeamForRoster;
const getRosterPlayersForSeasonTeamV201 = presidentDashboardRostersV212.getRosterPlayersForSeasonTeam;
```

## Attenzione tecnica

Non riassegnare variabili importate o `const` destructured. In passato questo ha causato l'errore:

```text
Assignment to constant variable
```

Per gli override usare setter passati al modulo, come fatto in V212.

## Flusso dati

Dati storici/pesanti:

1. JSON statici GitHub
2. snapshot Firebase come fallback
3. collection Firebase granulari solo admin su richiesta

Dati live:

- comunicati/news da Firebase in background
- trasferibili/trattative da Firebase quando presidente apre dashboard/mercato

## Verifiche minime dopo ogni overlay

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
```

Poi test browser:

- Dashboard pubblica
- Albo
- Statistiche
- Confronta
- Archivio cambio stagione
- login presidente -> Dashboard Presidente
- Mercato lazy/live
- login admin -> Checklist online finale
