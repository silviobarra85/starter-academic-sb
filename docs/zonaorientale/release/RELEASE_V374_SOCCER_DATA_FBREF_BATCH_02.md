# RELEASE V374 - Soccer Data FBref batch-02

Data: 2026-06-05

## Obiettivo

Aggiungere il secondo batch verificato di associazioni ZonaOrientale -> FBref per la sezione Soccer Data, mantenendo la sezione read-only e limitata ai soli giocatori presenti nel listone attivo.

## Numeri

- Giocatori IN_LISTONE inclusi: 532
- Asteriscati/non-IN_LISTONE esclusi: 131
- Mapping confermati prima della release: 50
- Mapping confermati aggiunti in V374: 50
- Mapping confermati totali: 100
- Mapping ancora da completare: 432

## File dati

- `assets/soccer-data/fbref-player-map.v374.json`
- `assets/soccer-data/fbref-player-map.v374.csv`
- `assets/soccer-data/fbref-review-batch.v374.csv`
- `assets/soccer-data/manifest.json`

## Garanzie

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Sono preservate le release V368, V369, V370, V371, V372 e V373.

## Note operative

Il batch e stato compilato in modo prudente: i match confermati hanno `fbrefId`, `fbrefName`, `fbrefUrl`, `matchStatus: confirmed`, `source: FBref` e `mappedInRelease: V374`.
