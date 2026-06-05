# V349 - Azioni locali simulatore trade

## Problema

`ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()` crea una trattativa locale in memoria. La UI, pero, mostrava gli stessi pulsanti delle trattative reali. Cliccando `Rifiuta` o `Accetta`, il flusso storico chiamava Firebase e poteva fallire con permessi insufficienti.

## Soluzione

La V349 aggiunge un wrapper a `updateNegotiationStatusV119`:

- se la riga e simulata/local-only, aggiorna solo lo stato locale;
- se la riga e reale, delega al flusso Firebase precedente.

## Criteri local-only

Una riga e considerata simulata se:

```js
item.localOnly === true
```

oppure se `source` e:

```text
dev-simulator-v255
console-simulator-v255-local
```

## Funzioni aggiunte

```js
isLocalTradeSimulationV349(item)
updateLocalTradeSimulationStatusV349(id, status)
updateNegotiationStatusV349(id, status)
```

## Impatto

Impatto reale: nessuno sulle trattative Firebase.  
Impatto simulazione: i pulsanti UI sono ora usabili anche per le proposte simulate.

## Funzionalita preservate

- Accetta/Rifiuta reali su Firebase.
- Annulla reale su Firebase.
- Badge notifiche trattative.
- Fallback lettura esito V246.
- Simulatore V255 e alias V254.
