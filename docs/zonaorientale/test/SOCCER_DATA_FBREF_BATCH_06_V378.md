# Test Soccer Data FBref batch-06 V378

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v378.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale

1. Verificare footer `V378`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che risultino 300 mapping confermati.
5. Aprire alcuni link del batch-06: Cheddira, Meret, Solomon, Gila, Lukaku, Acerbi, Perin, Dallinga, Camarda, Kossounou.
6. Filtrare su `Da associare` e verificare che gli altri giocatori restino presenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.

## Console browser

```js
ZonaOrientaleSoccerDataFbrefBatchV378.runSmokeTest()
```
