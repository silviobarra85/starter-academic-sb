# Handoff nuovo assistente - V367

## Contesto

La V367 introduce smoke test automatici minimi anti-regressione. Non e' una release funzionale.

## Vincolo principale

Nessuna funzionalita' esistente deve essere cancellata o scollegata. Ogni refactor successivo deve passare dai controlli V367 o spiegare chiaramente perche' un controllo non e' applicabile.

## File modificati in V367

- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/market/transfer-market.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-protected-regression-v367.mjs`
- audit tool storici V358-V362
- documentazione V367

## Cose da non fare senza richiesta esplicita

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md`.
- Non cancellare file legacy senza audit dedicato.
- Non cambiare schema Firebase.
- Non trasformare simulazioni local-only in scritture Firebase.
- Non riscrivere `app.js` in blocco.

## Verifica minima

```bash
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

Browser:

```js
ZonaOrientaleProtectedRegressionSuiteV367.runSmokeTest()
```

## Prossima release suggerita

V368 Dashboard pubblicazione Admin. Deve usare i controlli V367 come base e restare additiva.
