# Handoff nuovo assistente AI - V350

Versione corrente: V350.

## Sintesi

La V350 completa la pulizia del simulatore trade dev legacy rimuovendo `assets/js/dev/trade-notification-simulator-v254.js`. Il runtime resta agganciato a `assets/js/dev/trade-notification-simulator-v255.js`, che mantiene sia `window.ZonaOrientaleTradeSimulatorV255` sia l'alias storico `window.ZonaOrientaleTradeSimulatorV254`.

## Cosa fa V350

- Rimuove il file fisico V254, gia non importato dal runtime.
- Preserva il modulo V255 e i comandi console.
- Preserva la correzione V349: `Accetta` / `Rifiuta` su righe simulate non scrivono su Firebase.
- Aggiunge `audit-trade-simulator-dev-cleanup-v350.mjs`.
- Aggiorna l'audit V348 per restare compatibile con il cleanup successivo.

## Test manuale consigliato

1. Accedere come presidente.
2. Aprire Console browser.
3. Eseguire:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

4. Verificare badge notifica e card in Dashboard Presidente.
5. Cliccare `Rifiuta` oppure `Accetta`.
6. Verificare che non compaia `Missing or Insufficient permissions`.
7. Eseguire:

```js
window.ZonaOrientaleTradeSimulatorDevCleanupV350.runSmokeTest()
```

Il risultato deve avere `ok: true`.

## Attenzione applicazione zip

Dopo il `cp -R`, serve anche:

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
```

perche lo zip non cancella file gia presenti nella repo.

## Vincoli

Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.

Preservare tutte le funzionalita esistenti: Calciomercato, Listone, Rose, Dashboard Presidente, Fantamercato reale, Admin, Firebase/Auth/EmailJS, Netlify Functions, mobile navigation e notifiche trade reali.

## Prossimo passo consigliato

V351: audit mirato di `assets/js/refactor/admin-publication-workflow-v213.js`, senza rimozione automatica finche non si verifica l'area Admin pubblicazione/comunicati.
