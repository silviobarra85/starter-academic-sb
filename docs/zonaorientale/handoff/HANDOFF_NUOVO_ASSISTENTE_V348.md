# Handoff nuovo assistente AI - V348

Versione corrente: V348.

## Sintesi

La V348 esegue un audit mirato di `assets/js/dev/trade-notification-simulator-v254.js`. Il runtime resta collegato al modulo canonico `assets/js/dev/trade-notification-simulator-v255.js?v=348`.

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorDevAuditV348
```

## Tool

```bash
static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## File da NON cancellare automaticamente

- `assets/js/dev/trade-notification-simulator-v254.js`: candidato review, non rimosso in V348.
- `assets/js/refactor/admin-publication-workflow-v213.js`.
- `assets/css/mobile-hotfix-v166.css`.
- `assets/css/mobile-hotfix-v167.css`.
- `assets/css/refactor/theme-light-suspended.css`.
- `assets/js/domain/competitions.js`.

## Funzionalita da preservare

- Fantamercato interno e notifiche trade.
- Simulatore trade dev V255 e alias console V254.
- Calciomercato completo: feed, archivio, card, filtri, Solo Admin, timeline giocatore.
- Listone, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, Netlify Functions e mobile navigation.

## Prossimo passo consigliato

V349: rimozione controllata del solo `assets/js/dev/trade-notification-simulator-v254.js`, ma solo se i test manuali su `ZonaOrientaleTradeSimulatorV255` sono confermati.

Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
