# V199 - Fix statistiche da honor snapshot

## Obiettivo
Correggere la pagina Statistiche/Hall of Fame quando il sito lavora in modalita pubblica leggera.

## Problema
La V193 calcolava titoli, club vincitori, podi e FIFA Ranking usando `state.raw.honorRoll` e `state.raw.fifaRankings`. Dopo le ottimizzazioni JSON/snapshot, pero, in modalita pubblica quei dati sono serviti da `assets/snapshots/honor.json` dentro `state.publicHonorSnapshot`, mentre gli array granulari restano vuoti.

Risultato: la pagina mostrava correttamente le stagioni, ma titoli/ranking e sezioni storiche risultavano a 0 o vuote.

## Soluzione
La pagina Statistiche ora usa come sorgente primaria `state.publicHonorSnapshot`:

- `honorRows` per titoli, podi e timeline;
- `fifaRanking` per Top FIFA Ranking;
- `palmares` come fallback aggregato se mancano le righe dettagliate.

Quando l admin ha caricato i dati completi, resta disponibile anche il calcolo dai dati granulari dove possibile. Nessuna nuova lettura Firebase.

## Mobile
Nessuna nuova tabella. Le card V193 restano responsive.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`

## Test

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```
