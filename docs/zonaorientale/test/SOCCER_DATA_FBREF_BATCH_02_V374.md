# Test V374 - Soccer Data FBref batch-02

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-v371.mjs --quiet
node static/zonaorientale/tools/audit-soccer-data-mapping-v372.mjs --quiet
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v374.mjs --quiet
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale

1. Verificare footer V374.
2. Aprire Soccer Data.
3. Filtrare su Mappati.
4. Verificare che i mappati siano 100.
5. Verificare alcuni link FBref del batch-02.
6. Filtrare su Da associare e verificare che i restanti giocatori restino visibili.
7. Controllare Admin, Area squadra, Trattative, Listone, Competizioni e Scheda giocatore.

## Console browser

```js
ZonaOrientaleSoccerDataFbrefBatchV374.runSmokeTest()
```
