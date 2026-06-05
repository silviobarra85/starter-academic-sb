# Refactor/Audit V348 - Simulatore trade dev

La V348 non rimuove codice. Serve a consolidare lo stato dopo la rimozione V347 del duplicato top-level.

## Decisione

- Modulo attivo: `assets/js/dev/trade-notification-simulator-v255.js`.
- Modulo candidato review: `assets/js/dev/trade-notification-simulator-v254.js`.
- Nessuna modifica a logiche Fantamercato o Firebase.
- Nessuna modifica al rendering o alle sezioni utente/admin.

## Perche non rimuovere subito V254

Il file V254 non e' importato, ma riguarda un'area delicata: simulazione notifiche trade e test Fantamercato. La V255 conserva alias V254, ma la rimozione fisica deve essere fatta solo dopo test browser manuale del simulatore.

## Tool

```bash
static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
```

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorDevAuditV348
```

## Prossimo passo consigliato

V349: rimozione controllata di `assets/js/dev/trade-notification-simulator-v254.js`, solo se i test manuali V255 sono confermati.
