# Test Soccer Data mapping assistito V372

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node static/zonaorientale/tools/audit-soccer-data-mapping-v372.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuali

1. Aprire il sito e verificare footer V372.
2. Aprire `Soccer Data`.
3. Verificare che i giocatori mostrati siano 532.
4. Usare filtro `Da associare`.
5. Aprire un link `Cerca FBref`.
6. Usare `Copia riga` su un giocatore.
7. Usare `Copia CSV da rivedere`.
8. Verificare che Listone, Area squadra, Admin, competizioni e scheda giocatore siano ancora navigabili.

## Console browser

```js
ZonaOrientaleSoccerDataMappingAssistantV372.runSmokeTest()
```
