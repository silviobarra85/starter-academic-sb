# REFACTOR V200 - Fix Confronta da honor snapshot

## Obiettivo

Correggere la pagina pubblica `Confronta squadre`, che in caricamento pubblico leggero non valorizzava correttamente titoli, podi e FIFA Ranking.

## Problema

La V195 calcolava molte metriche da:

- `state.raw.honorRoll`
- `state.raw.fifaRankings`

Dopo le ottimizzazioni di lettura, però, in modalità pubblica questi dati arrivano soprattutto da:

- `assets/snapshots/honor.json`
- `state.publicHonorSnapshot.honorRows`
- `state.publicHonorSnapshot.palmares`
- `state.publicHonorSnapshot.fifaRanking`

Quindi la pagina Confronta poteva mostrare squadre e stagioni, ma lasciare a zero o vuoti:

- titoli
- podi Campionato
- FIFA Ranking
- ultimi titoli
- breakdown per competizione

## Modifica

Aggiunto override V200 di `getCompareProfileMapV195()` che arricchisce i profili squadra con dati da `state.publicHonorSnapshot`, senza aggiungere nuove letture Firebase.

Le sorgenti usate ora sono:

1. dati granulari già disponibili, se admin completo caricato;
2. `publicHonorSnapshot.honorRows` per titoli e podi;
3. `publicHonorSnapshot.palmares` come fallback aggregato;
4. `publicHonorSnapshot.fifaRanking` per punteggio/posizione FIFA.

## Letture Firebase

Nessuna nuova lettura Firebase.

La pagina usa solo dati già caricati da JSON/static snapshot o dai fallback già esistenti.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V200.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V200.md`

## Versione

Footer aggiornato a:

`V200 fix confronta da honor snapshot`

Cache-buster aggiornati a `v=200`.
