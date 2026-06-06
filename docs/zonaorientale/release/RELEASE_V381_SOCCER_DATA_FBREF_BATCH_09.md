# RELEASE V381 - Soccer Data FBref batch-09

Data: 2026-06-05
Branch previsto: `refactor/260528-zonaorientale-next`

## Obiettivo

Completare il nono batch di associazioni ZonaOrientale -> FBref mantenendo la sezione Soccer Data read-only e limitata ai soli giocatori `IN_LISTONE`.

## Esito

- Giocatori a listone attivo: 532.
- Asteriscati/non `IN_LISTONE` esclusi: 131.
- Mapping confermati prima della release: 400.
- Nuovi mapping confermati V381: 50.
- Mapping confermati totali: 450.
- Mapping rimanenti: 82.

## Vincoli preservati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Soccer Data mostra solo giocatori `IN_LISTONE`.

## File principali

- `assets/soccer-data/fbref-player-map.v381.json`
- `assets/soccer-data/fbref-player-map.v381.csv`
- `assets/soccer-data/fbref-review-batch.v381.csv`
- `assets/soccer-data/manifest.json`
- `tools/audit-soccer-data-fbref-batch-v381.mjs`
- `tools/check-zonaorientale.sh`
- `assets/app.js`

## Note mapping

Il batch include casi con iniziali/omonimi/nomi FBref diversi dal listone: Mendy P., Amorim, Patric, Bayo V., Dominguez B., Bozhinov, Vural, Faye, Pessina Mas. e altri. Le motivazioni sono tracciate nel campo `notes` del mapping.
