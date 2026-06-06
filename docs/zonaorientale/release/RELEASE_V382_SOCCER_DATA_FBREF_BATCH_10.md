# RELEASE V382 - Soccer Data FBref batch-10

Data: 2026-06-05
Branch previsto: `refactor/260528-zonaorientale-next`

## Obiettivo

Completare il decimo batch di associazioni ZonaOrientale -> FBref mantenendo Soccer Data read-only e limitata ai soli giocatori `IN_LISTONE`.

## Esito

- Giocatori a listone attivo: 532.
- Asteriscati/non `IN_LISTONE` esclusi: 131.
- Mapping confermati prima della release: 450.
- Nuovi mapping confermati V382: 50.
- Mapping confermati totali: 500.
- Mapping rimanenti: 32.

## Vincoli preservati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Soccer Data mostra solo giocatori `IN_LISTONE`.

## File principali

- `assets/soccer-data/fbref-player-map.v382.json`
- `assets/soccer-data/fbref-player-map.v382.csv`
- `assets/soccer-data/fbref-review-batch.v382.csv`
- `assets/soccer-data/manifest.json`
- `tools/audit-soccer-data-fbref-batch-v382.mjs`
- `tools/check-zonaorientale.sh`
- `assets/app.js`

## Note mapping

Il batch include casi con accenti, iniziali e nomi non coincidenti fra listone e FBref: Sala A., Fofana Sa., Jean, Perez M., Mikolajewski, Albarracin, Nicolas, Christensen O., Onana J. e altri. Le motivazioni sono tracciate in `notes`.
