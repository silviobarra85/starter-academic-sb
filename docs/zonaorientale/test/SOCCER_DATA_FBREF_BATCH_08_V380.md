# Test V380 - Soccer Data FBref batch-08

## Automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v380.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Manuali

1. Verificare footer `V380`.
2. Aprire `Soccer Data`.
3. Filtrare `Mappati`: attesi 400 giocatori.
4. Aprire alcuni link FBref batch-08.
5. Verificare che `Da associare` mostri ancora i non completati.
6. Controllare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.
