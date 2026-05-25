# REFACTOR V211 - Estrazione Statistiche e Confronta

## Obiettivo

Pulire `assets/app.js` estraendo in un modulo dedicato le pagine pubbliche introdotte nelle versioni V193/V195 e corrette in V199/V200:

- Statistiche storiche / Hall of Fame
- Confronta squadre
- lettura titoli/podi/FIFA da `assets/snapshots/honor.json`
- layout mobile-first delle due pagine

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/refactor/historical-stats-compare-v211.js
docs/zonaorientale/REFACTOR_V211.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V211.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
```

## Cosa e' stato estratto

La logica prima presente in `app.js` e' stata consolidata in:

```text
assets/js/refactor/historical-stats-compare-v211.js
```

Il modulo contiene:

- costanti competizioni storiche
- normalizzazione lettura `honor.json`
- build Hall of Fame
- render Statistiche
- build profili club per Confronta
- recupero titoli/podi/FIFA da honor snapshot
- scontri diretti dai match gia' caricati
- CSS responsive delle due pagine
- hook admin help

## Compatibilita'

In `app.js` restano alias compatibili con i nomi storici usati da altre parti del sito:

```js
HISTORICAL_COMPETITIONS_V193
getSeasonSortValueV193
getSeasonLabelV193
getSeasonTeamRecordV193
buildHistoricalStatsV193
renderHistoricalStatsV193
getCompareProfilesV195
renderTeamCompareV195
```

Questi alias servono ancora a:

- Archivio stagioni V196/V204
- Generatore comunicati V210
- debug console esistenti

## Comportamento invariato

V211 non aggiunge nuove letture Firebase.

Le pagine Statistiche e Confronta continuano a usare:

```text
assets/snapshots/honor.json
state.publicHonorSnapshot
state.publicSeasonSnapshots
state.raw gia' disponibile
```

Firebase viene usato solo dai fallback gia' esistenti, non dal nuovo modulo.

## Versione

Footer aggiornato a:

```text
V211 refactor statistiche e confronta
```

Cache-buster aggiornati a:

```text
v=211
```

Checklist online finale aggiornata per aspettarsi la versione `211`.

## Test eseguiti

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/refactor/historical-stats-compare-v211.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
python3 validazione JSON assets/**/*.json
```

Verificati via server locale:

```text
/zonaorientale/ -> 200
/zonaorientale/assets/app.js?v=211 -> 200
/zonaorientale/assets/js/refactor/historical-stats-compare-v211.js -> 200
/zonaorientale/assets/js/refactor/live-data-archive-v209.js -> 200
/zonaorientale/assets/js/refactor/admin-communication-generator-v210.js -> 200
/zonaorientale/assets/snapshots/honor.json -> 200
/zonaorientale/assets/snapshots/seasons/manifest.json -> 200
```

## Verifiche funzionali consigliate

- `/zonaorientale/#stats`
- `/zonaorientale/#compare`
- Statistiche senza premere `Carica dati amministrazione`
- Confronta senza premere `Carica dati amministrazione`
- Titoli, podi e FIFA Ranking valorizzati da `honor.json`
- Archivio stagioni ancora funzionante
- Generatore comunicati ancora funzionante
- Mobile: nessuno sforamento laterale in Statistiche e Confronta
