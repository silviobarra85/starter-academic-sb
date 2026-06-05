# Test automatici V367

## Comandi

Dalla root della repo:

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test browser

Aprire il sito localmente e lanciare in console:

```js
ZonaOrientaleProtectedRegressionSuiteV367.runSmokeTest()
```

Il campo `ok` deve essere `true`.

## Test manuale minimo

1. Home: footer V367 visibile.
2. Menu desktop/mobile: navigazione base funzionante.
3. Admin: checklist QA apribile solo da profilo autorizzato.
4. Presidente: area protetta non visibile a utente non loggato.
5. Trade simulator: simulazione Admin verso presidente ancora local-only.
6. Trade action: Accetta/Rifiuta non deve tornare `IN ATTESA`.
7. Competizione: apertura dettaglio competizione.
8. Player: apertura scheda giocatore.
9. Calciomercato: archivio/diagnostica non devono sparire.
