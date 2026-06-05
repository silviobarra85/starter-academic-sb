# FUNZIONALITAV350 - ZonaOrientale

Versione: V350  
Data: 05/06/2026  
Tipo: cleanup/refactor protetto su simulatore notifiche Fantamercato.

## Obiettivo V350

La V350 rimuove in modo controllato il vecchio modulo:

```text
assets/js/dev/trade-notification-simulator-v254.js
```

Il runtime era gia collegato al modulo canonico:

```text
assets/js/dev/trade-notification-simulator-v255.js
```

La V349 ha inoltre corretto le azioni locali `Accetta` / `Rifiuta` sulle simulazioni, quindi V254 non e piu necessario come file fisico.

## Funzionalita preservate

- Simulatore console `ZonaOrientaleTradeSimulatorV255`.
- Alias storico console `ZonaOrientaleTradeSimulatorV254`, mantenuto dal modulo V255.
- Simulazioni locali con `simulateIncomingProposal()`.
- Azioni locali V349 su `Accetta` / `Rifiuta` senza scrittura Firebase.
- Notifiche trattative reali.
- Flusso Firebase reale del Fantamercato interno.
- Badge notifiche presidente.
- Calciomercato, tag giocatore e timeline modal.
- Listone, Rose, Dashboard Presidente.
- Admin e Diagnostica dati.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- Navigazione mobile.

## File rimosso

```text
static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
```

Nota operativa: lo zip non puo cancellare file gia presenti nella repo dell'utente. Dopo il `cp -R` serve `git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js`.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs`
- `static/zonaorientale/tools/audit-trade-simulator-dev-cleanup-v350.mjs`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorDevCleanupV350
```

Smoke test browser:

```js
window.ZonaOrientaleTradeSimulatorDevCleanupV350.runSmokeTest()
```
