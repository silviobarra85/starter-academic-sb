# Release V375 - Soccer Data FBref batch-03

Versione: V375
Data: 2026-06-05
Branch previsto: refactor/260528-zonaorientale-next

## Obiettivo

Terzo batch controllato di associazioni ZonaOrientale -> FBref per la sezione Soccer Data.

## Scope protetto

- Solo giocatori con `statusCode: IN_LISTONE`.
- Asteriscati esclusi.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna modifica funzionale a rose, listone, trattative, admin, competizioni, schede player e calciomercato.

## Risultato

- 532 giocatori attivi nel mapping.
- 150 associazioni FBref confermate.
- 382 associazioni residue.
- Batch completati: batch-01, batch-02, batch-03.

## File principali

- `assets/soccer-data/fbref-player-map.v375.json`
- `assets/soccer-data/fbref-player-map.v375.csv`
- `assets/soccer-data/fbref-review-batch.v375.csv`
- `assets/soccer-data/manifest.json`
- `tools/audit-soccer-data-fbref-batch-v375.mjs`

## Verifiche

- `node --check assets/app.js`
- `node --check assets/js/market/transfer-market.js`
- `node tools/audit-soccer-data-v371.mjs --quiet`
- `node tools/audit-soccer-data-mapping-v372.mjs --quiet`
- `node tools/audit-soccer-data-fbref-batch-v375.mjs --quiet`
- `bash tools/check-zonaorientale.sh`
