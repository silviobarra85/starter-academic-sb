# Release V379 - Soccer Data FBref batch-07

## Obiettivo

Aggiungere il settimo batch di associazioni reali ZonaOrientale -> FBref, mantenendo Soccer Data additiva, read-only e limitata ai soli giocatori presenti nel listone.

## Modifiche

- Creato `assets/soccer-data/fbref-player-map.v379.json`.
- Creato `assets/soccer-data/fbref-player-map.v379.csv`.
- Creato `assets/soccer-data/fbref-review-batch.v379.csv`.
- Aggiornato `assets/soccer-data/manifest.json` a V379.
- Aggiornato il loader Soccer Data al mapping V379.
- Aggiunto marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV379`.
- Aggiunto audit `tools/audit-soccer-data-fbref-batch-v379.mjs`.
- Aggiornato `check-zonaorientale.sh` includendo l'audit V379.
- Reso l'audit V378 compatibile con versioni successive.
- Aggiornati footer/cache-buster a V379.

## Numeri

- Giocatori `IN_LISTONE`: 532.
- Asteriscati esclusi: 131.
- Mapping confermati dopo V379: 350.
- Nuovi mapping batch-07: 50.
- Mapping ancora da completare: 182.

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
node tools/audit-soccer-data-fbref-batch-v379.mjs --quiet
bash tools/check-zonaorientale.sh
```
