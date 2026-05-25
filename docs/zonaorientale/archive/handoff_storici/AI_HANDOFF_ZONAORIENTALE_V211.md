# AI Handoff ZonaOrientale - V211

## Stato progetto

Versione corrente: **V211 refactor statistiche e confronta**.

La webapp e' statica HTML/CSS/JS puro in:

```text
static/zonaorientale/
```

Il file principale resta:

```text
static/zonaorientale/assets/app.js
```

ma il refactor sta procedendo per estrazione progressiva di moduli.

## Moduli refactor attivi

```text
assets/js/refactor/live-data-archive-v209.js
assets/js/refactor/admin-communication-generator-v210.js
assets/js/refactor/historical-stats-compare-v211.js
```

### live-data-archive-v209.js

Gestisce:

- comunicati live Firebase in background
- mercato/trattative live e lazy
- rendering Archivio da snapshot statici

### admin-communication-generator-v210.js

Gestisce:

- Generatore comunicati automatici
- template comunicati
- copia testo
- inserimento bozza nel form Comunicati

### historical-stats-compare-v211.js

Gestisce:

- Statistiche storiche / Hall of Fame
- Confronta squadre
- titoli/podi/FIFA da `state.publicHonorSnapshot`
- fallback ai dati granulari gia' caricati
- CSS mobile-first delle due pagine

## Scelte dati importanti

- Dati storici/pesanti: leggere prima JSON/static snapshot.
- Fallback: snapshot Firebase pubblici.
- Dati live: comunicati, lista trasferibili e trattative da Firebase.
- Admin completo: collection granulari Firebase solo dopo `Carica dati amministrazione`.

## Attenzione

Non riportare dentro `app.js` logica gia' estratta nei moduli.

Se devi modificare Statistiche o Confronta, lavora soprattutto su:

```text
assets/js/refactor/historical-stats-compare-v211.js
```

Se devi modificare Archivio o dati live, lavora soprattutto su:

```text
assets/js/refactor/live-data-archive-v209.js
```

Se devi modificare il Generatore comunicati, lavora soprattutto su:

```text
assets/js/refactor/admin-communication-generator-v210.js
```

## Compatibilita' mantenuta in app.js

`app.js` espone ancora alias storici usati da altre funzioni:

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

Non eliminarli finche' Archivio, Comunicati e altre patch non sono state aggiornate.

## Regole operative utente

L'utente vuole sempre:

- overlay zip con percorsi `static/zonaorientale/...`
- Version footer aggiornata ad ogni overlay
- cache-buster aggiornati
- handoff AI ad ogni overlay
- comandi Git aggiornati
- comandi locali:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

## Test minimi

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```

## Verifiche funzionali V211

- Dashboard pubblica carica
- Albo carica
- Statistiche mostra titoli/podi/FIFA da `honor.json`
- Confronta mostra titoli/podi/FIFA da `honor.json`
- Archivio cambia stagione e mostra dati
- Login presidente: Dashboard Presidente e Mercato lazy/live
- Login admin: Generatore comunicati e Checklist online finale
- Mobile: Statistiche e Confronta senza sforamenti

## Prossimo refactor suggerito

Estrarre una delle seguenti aree:

1. Dashboard Presidente V192 + patch rose V201/V202.
2. Stato pubblicazione / Procedura guidata V189-V191.
3. Admin snapshot/preflight/checklist V177-V185.

Consiglio: procedere con **Dashboard Presidente** perché e' una sezione utente visibile e ora dipende ancora da molte patch dentro `app.js`.
