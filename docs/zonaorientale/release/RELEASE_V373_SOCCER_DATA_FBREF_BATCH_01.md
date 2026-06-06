# RELEASE V373 - Soccer Data FBref batch-01

Data: 2026-06-05
Branch target: `refactor/260528-zonaorientale-next`

## Obiettivo

Aggiungere il primo batch di associazioni reali tra giocatori ZonaOrientale a listone e profili FBref, senza introdurre scraping live, senza scritture Firebase e senza modificare le funzionalita esistenti.

## Scope protetto

- Solo giocatori con `statusCode: IN_LISTONE`.
- Asteriscati esclusi.
- Mapping statico/offline.
- Nessuna nuova collection Firebase.
- Nessuna modifica a trattative, rose, competizioni, Admin, Area squadra, Dashboard Presidente o Centro notifiche.
- `docs/zonaorientale/FUNZIONALITA'.md` non modificato.

## Risultato

- 532 giocatori totali nel mapping Soccer Data.
- 50 associazioni FBref confermate nel `batch-01`.
- 482 associazioni ancora da verificare nei batch successivi.

## File principali

- `static/zonaorientale/assets/soccer-data/fbref-player-map.v373.json`
- `static/zonaorientale/assets/soccer-data/fbref-player-map.v373.csv`
- `static/zonaorientale/assets/soccer-data/fbref-review-batch.v373.csv`
- `static/zonaorientale/assets/soccer-data/manifest.json`
- `static/zonaorientale/tools/audit-soccer-data-fbref-batch-v373.mjs`
- `static/zonaorientale/assets/app.js`

## Note sui casi controllati

- `Martinez L.` e stato associato a Lautaro Martínez.
- `Paz N.` e stato associato al profilo Nicolás Paz di Como/Real Madrid, non agli omonimi argentini.
- `Konè I.` e stato associato a Ismaël Koné collegato a Sassuolo, non all'omonimo NB I.
- `Esposito F.P.` e stato associato al profilo FBref `Francesco Esposito`, usato da FBref per Francesco Pio Esposito.

## Verifiche

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v373.mjs --quiet
bash tools/check-zonaorientale.sh
```
