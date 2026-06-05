# FUNZIONALITAV349 - ZonaOrientale

Versione: V349  
Data: 05/06/2026  
Tipo: fix/refactor protetto su simulatore notifiche Fantamercato.

## Obiettivo V349

La V349 corregge il comportamento delle trattative simulate create da console con:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Prima della V349, la card simulata compariva correttamente e accendeva la notifica, ma i pulsanti reali `Accetta` / `Rifiuta` chiamavano il flusso Firebase storico e potevano generare:

```text
Missing or Insufficient permissions
```

La V349 intercetta solo le righe simulate/local-only e aggiorna stato, card e badge localmente, senza scritture Firebase.

## Funzionalita nuove o corrette

- Riconoscimento trattative simulate tramite `localOnly === true` o `source === dev-simulator-v255`.
- `Rifiuta` su una proposta simulata ricevuta aggiorna la card a `REJECTED` localmente.
- `Accetta` su una proposta simulata ricevuta aggiorna la card a `ACCEPTED` localmente.
- Il badge notifica trattative viene ricalcolato dopo la risposta simulata.
- `Annulla` su una proposta simulata inviata rimuove la riga locale senza Firebase.
- Le trattative reali continuano a usare il flusso storico Firebase.

## Regola importante: simulazione vs reale

### Simulazione locale

Per test rapidi da console:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Poi si puo cliccare direttamente su `Accetta` o `Rifiuta` nella card. Da V349 non deve comparire errore permessi.

### Trattativa reale

Per trattative reali salvate in `transferNegotiations`:

- una notifica ricevuta si spegne quando il presidente destinatario accetta/rifiuta la trattativa;
- una notifica di esito per il mittente si spegne quando l'esito viene aperto/marcato come letto;
- se Firebase nega il salvataggio della lettura, resta il fallback locale V246.

## Funzionalita preservate

- Fantamercato interno reale.
- Notifiche trattative reali.
- Simulatore V255 e alias V254.
- Firebase/Auth/EmailJS.
- Calciomercato, feed, archivio, tag giocatore, timeline modal.
- Listone, Rose, Dashboard Presidente.
- Admin e Diagnostica dati.
- Netlify Functions.
- Navigazione mobile.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-trade-simulator-local-actions-v349.mjs`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorLocalActionsV349
```

Smoke test browser:

```js
window.ZonaOrientaleTradeSimulatorLocalActionsV349.runSmokeTest()
```
