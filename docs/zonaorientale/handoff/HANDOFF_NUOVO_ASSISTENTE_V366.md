# Handoff nuovo assistente - V366

## Stato corrente

Versione runtime: V366.

La V366 e' un hardening mirato del dominio trattative/notifiche. Non e' una riscrittura e non rimuove file o funzionalita'.

## Modifica principale

Aggiunto il marker runtime:

```js
window.ZonaOrientaleTradeDomainHardeningV366
```

Questo marker espone:

- `normalizeStatus(status)`
- `classifyRow(id)`
- `runSmokeTest()`

## Cosa protegge

- Trattative reali Firebase.
- Simulazioni local-only V255/V349.
- Simulazioni Admin verso presidente V362.
- Fix persistenza esito simulazioni V364.
- Badge notifiche V238/V239/V246.
- Area Presidente.
- Admin QA.

## File modificati importanti

- `assets/app.js`
- `assets/js/market/transfer-market.js`

## Regole da mantenere

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Non confondere trattative Firebase reali e simulazioni local-only.
- Non introdurre scritture Firebase sulle simulazioni.
- Ogni release deve aggiornare footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
- Ogni zip consegnato deve includere entrambe le cartelle `zonaorientale` e `docs`.

## Test rapido

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
```

Da console browser:

```js
ZonaOrientaleTradeDomainHardeningV366.runSmokeTest()
```

## Prossimo passo consigliato

V367: smoke test automatici minimi su pagine/sezioni principali, senza modificare UI e senza toccare Firebase schema.
