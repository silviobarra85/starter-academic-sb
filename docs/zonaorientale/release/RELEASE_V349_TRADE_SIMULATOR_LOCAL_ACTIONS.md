# Release V349 - Azioni locali simulatore trade

Data: 05/06/2026

## Tipo

Fix/refactor protetto.

## Modifica principale

Le proposte simulate con `ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()` ora possono essere accettate/rifiutate direttamente dalla UI senza generare errori Firebase.

## Perche

Le righe simulate sono local-only. Non devono chiamare `updateDoc`/`deleteDoc` su Firebase.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-trade-simulator-local-actions-v349.mjs
static/zonaorientale/tools/audit-trade-simulator-local-actions-v349.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Note

Le trattative reali non cambiano comportamento.
