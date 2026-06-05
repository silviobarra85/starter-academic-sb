# Handoff nuovo assistente AI - V349

Versione corrente: V349.

## Sintesi

La V349 risolve il problema delle azioni `Accetta` / `Rifiuta` sulle trattative simulate localmente dal simulatore trade V255. Le righe create con `ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()` sono `localOnly` e non devono scrivere in Firebase. Prima della V349, i pulsanti reali della card provavano comunque `updateDoc`, causando `Missing or Insufficient permissions`.

## Cosa fa V349

- Aggiunge `isLocalTradeSimulationV349(item)`.
- Aggiunge `updateLocalTradeSimulationStatusV349(id, status)`.
- Wrappa `updateNegotiationStatusV119` in `updateNegotiationStatusV349`.
- Se la trattativa e simulata/local-only: aggiorna solo `state.raw.transferNegotiations` e `state.tradeNotificationSimulatorLocalRowsV255`.
- Se la trattativa e reale: delega al flusso storico Firebase.

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
7. Verificare che il badge si spenga e la card mostri l'esito locale.

## Differenza simulazione/reale

- Simulazione: niente Firebase; risposta locale.
- Reale: Firebase resta necessario per accettare/rifiutare e sincronizzare tra utenti.
- La notifica reale ricevuta si spegne quando il destinatario accetta/rifiuta.
- La notifica reale di esito per il mittente si spegne quando l'esito viene aperto/marcato come letto; V246 mantiene fallback locale se la scrittura di lettura e negata.

## File importanti

- `assets/app.js`
- `tools/audit-trade-simulator-local-actions-v349.mjs`
- `docs/zonaorientale/FUNZIONALITAV349.md`
- `docs/zonaorientale/refactor/TRADE_SIMULATOR_LOCAL_ACTIONS_V349.md`
- `docs/zonaorientale/audit/TRADE_SIMULATOR_LOCAL_ACTIONS_MATRIX_V349.md`
- `docs/zonaorientale/release/RELEASE_V349_TRADE_SIMULATOR_LOCAL_ACTIONS.md`

## Vincoli

Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.

Preservare tutte le funzionalita esistenti: Calciomercato, Listone, Rose, Dashboard Presidente, Fantamercato reale, Admin, Firebase/Auth/EmailJS, Netlify Functions, mobile navigation.
