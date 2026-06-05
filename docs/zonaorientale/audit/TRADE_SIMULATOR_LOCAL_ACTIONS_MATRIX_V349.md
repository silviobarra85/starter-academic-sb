# V349 - Matrice audit azioni locali simulatore trade

| Area | Stato | Note |
|---|---:|---|
| Simulatore V255 canonico | OK | `assets/js/dev/trade-notification-simulator-v255.js` resta attivo. |
| Alias console V254 | OK | Preservato nel modulo V255. |
| Proposte simulate localOnly | OK | Riconosciute da `isLocalTradeSimulationV349`. |
| Accetta/Rifiuta simulati | OK | Aggiornano stato locale, nessun Firebase. |
| Annulla simulato | OK | Rimuove riga locale. |
| Trattative reali | OK | Continuano a usare `updateNegotiationStatusBeforeV349`. |
| Badge notifiche | OK | Ricalcolati dopo azione locale. |
| Rischio regressione | Basso | Wrapper condizionato solo su `localOnly/source` simulatore. |

## Tool

```bash
static/zonaorientale/tools/audit-trade-simulator-local-actions-v349.mjs
```

## Test manuale

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Poi cliccare `Rifiuta` o `Accetta` nella card ricevuta.
