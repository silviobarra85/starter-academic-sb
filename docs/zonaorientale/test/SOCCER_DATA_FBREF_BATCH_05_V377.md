# Test Soccer Data FBref batch-05 V377

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v377.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale

1. Verificare footer `V377`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che risultino 250 mapping confermati.
5. Aprire alcuni link del batch-05: Füllkrug, Gabbia, Giménez, Maldini, Skorupski, Zapata, Neres, Dovbyk, Fabbian, Olivera.
6. Filtrare su `Da associare` e verificare che gli altri giocatori restino presenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.

## Console browser

```js
ZonaOrientaleSoccerDataFbrefBatchV377.runSmokeTest()
```
