# Release V367 - Smoke test protetti

Data: 05/06/2026

## Obiettivo

Aggiungere una cintura di sicurezza automatica prima dei prossimi refactor, senza cambiare comportamento del sito.

## Modifiche incluse

- Aggiornamento footer/cache-buster a V367.
- Aggiornamento `DEPLOY_EXPECTED_VERSION_V181` a `367`.
- Nuovo audit `tools/audit-protected-regression-v367.mjs`.
- Nuovo marker runtime `window.ZonaOrientaleProtectedRegressionSuiteV367`.
- Integrazione del nuovo audit in `tools/check-zonaorientale.sh`.
- Audit storici V358-V362 resi compatibili con runtime successivi, per evitare falsi negativi.
- Documentazione V367 aggiornata.

## Cosa non cambia

- Nessuna UI modificata.
- Nessuna logica Firebase modificata.
- Nessuna scrittura Firebase aggiunta.
- Nessun file runtime rimosso.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna modifica a rose, listone, competizioni, player, comunicati, calciomercato o workflow reali.

## Controlli principali

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

Da console browser:

```js
ZonaOrientaleProtectedRegressionSuiteV367.runSmokeTest()
```

## Esito atteso

- Footer V367 visibile.
- Cache-buster allineati a `v=367`.
- Audit V367 superato.
- Marker V358-V367 presenti.
- Trattative simulate local-only ancora gestite senza Firebase writes.
- Trattative reali Firebase non alterate.
