# Release V380 - Soccer Data FBref batch-08

## Obiettivo

Aggiungere l'ottavo batch di associazioni reali ZonaOrientale -> FBref, mantenendo Soccer Data additiva, read-only e limitata ai soli giocatori presenti nel listone.

## Modifiche

- Creato `assets/soccer-data/fbref-player-map.v380.json`.
- Creato `assets/soccer-data/fbref-player-map.v380.csv`.
- Creato `assets/soccer-data/fbref-review-batch.v380.csv`.
- Aggiornato `assets/soccer-data/manifest.json` a V380.
- Aggiornato il loader Soccer Data al mapping V380.
- Aggiunto marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV380`.
- Aggiunto audit `tools/audit-soccer-data-fbref-batch-v380.mjs`.
- Aggiornato `check-zonaorientale.sh` includendo l'audit V380.
- Reso l'audit V379 compatibile con versioni successive.
- Aggiornati footer/cache-buster a V380.

## Numeri

- Giocatori `IN_LISTONE`: 532.
- Asteriscati esclusi: 131.
- Mapping confermati dopo V380: 400.
- Nuovi mapping batch-08: 50.
- Mapping ancora da completare: 132.

## Vincoli rispettati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v380.mjs --quiet
bash tools/check-zonaorientale.sh
```
