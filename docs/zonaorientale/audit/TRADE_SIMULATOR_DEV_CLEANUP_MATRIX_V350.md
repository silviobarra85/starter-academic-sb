# Matrice audit V350 - Cleanup simulatore trade dev

| Controllo | Esito atteso |
|---|---|
| `assets/js/dev/trade-notification-simulator-v255.js` presente | OK |
| `assets/js/dev/trade-notification-simulator-v254.js` assente | OK |
| `app.js` importa solo V255 | OK |
| HTML pubblici non importano simulatori trade dev | OK |
| V255 espone `ZonaOrientaleTradeSimulatorV255` | OK |
| V255 mantiene alias `ZonaOrientaleTradeSimulatorV254` | OK |
| V349 local actions presente | OK |
| Marker `ZonaOrientaleTradeSimulatorDevCleanupV350` presente | OK |

Tool:

```bash
static/zonaorientale/tools/audit-trade-simulator-dev-cleanup-v350.mjs
```
