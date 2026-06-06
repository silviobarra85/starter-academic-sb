# Test manuale Soccer Data FBref batch-01 V373

1. Verificare footer `V373`.
2. Aprire `Soccer Data`.
3. Impostare filtro mapping su `Mappati`.
4. Verificare che compaiano 50 giocatori.
5. Aprire alcuni link FBref del batch-01, per esempio Dimarco, Lautaro, Paz N., Konè I., Esposito F.P.
6. Impostare filtro mapping su `Da associare` e verificare che gli altri giocatori restino presenti.
7. Verificare che Area squadra, Admin, Listone, Rose, Competizioni, Player page e Calciomercato siano ancora funzionanti.
8. In console browser eseguire:

```js
ZonaOrientaleSoccerDataFbrefBatchV373.runSmokeTest()
```
