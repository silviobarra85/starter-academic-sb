# Handoff nuovo assistente AI - V347

Versione corrente: V347.

## Sintesi

La V347 rimuove il duplicato top-level `assets/js/trade-notification-simulator-v255.js`. Il runtime continua a importare la copia canonica `assets/js/dev/trade-notification-simulator-v255.js?v=347`.

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorCleanupV347
```

## Tool

```bash
static/zonaorientale/tools/audit-trade-simulator-v347.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Attenzione applicazione zip

Lo zip non puo cancellare file gia presenti nella repo dell'utente. Dopo il `cp -R`, serve:

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/trade-notification-simulator-v255.js
```

## Funzionalita da preservare

- Simulatore trade canonico in `assets/js/dev/trade-notification-simulator-v255.js`.
- Fantamercato interno e notifiche trade.
- Calciomercato completo: feed, archivio, card, filtri, Solo Admin, timeline giocatore.
- Listone, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, Netlify Functions e mobile navigation.

## Candidati ancora in review

- `assets/js/dev/trade-notification-simulator-v254.js`.
- `assets/js/refactor/admin-publication-workflow-v213.js`.
- `assets/css/mobile-hotfix-v166.css`.
- `assets/css/mobile-hotfix-v167.css`.
- `assets/css/refactor/theme-light-suspended.css`.
- `assets/js/domain/competitions.js`.

## Prossimo passo consigliato

V348: audit mirato di `assets/js/dev/trade-notification-simulator-v254.js`, senza rimozione automatica finche non si verifica il simulatore V255 e i flussi Fantamercato/notifiche trade.

Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
