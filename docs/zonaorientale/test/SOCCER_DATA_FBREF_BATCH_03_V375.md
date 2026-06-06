# Test V375 - Soccer Data FBref batch-03

## Test manuale consigliato

1. Verificare footer `V375`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati` e verificare 150 giocatori.
4. Aprire link FBref rappresentativi del batch-03: Dumfries, Dybala, Di Lorenzo, Zaccagni, Cambiaso, Provedel, Mkhitaryan, Montipo.
5. Filtrare su `Da associare` e verificare che gli altri giocatori restino visibili.
6. Controllare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v375.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
