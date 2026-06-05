# Refactor/QA V362 - Simulazione target presidente

## Perche'

La Checklist QA e' solo Admin, ma il comportamento delle notifiche trade deve essere visto dal presidente destinatario. La V362 aggiunge uno strato local-only che consente all'admin di preparare una proposta ricevuta per una squadra specifica.

## Implementazione

`ZonaOrientaleTradeSimulatorTargetPanelV362`:

- legge le squadre della stagione corrente;
- mostra label `Squadra - Presidenti`;
- chiama il simulatore V255 con `toSeasonTeamId` selezionato;
- marca la riga con `targetedByAdminV362`;
- salva la simulazione in `localStorage`;
- reinserisce le righe salvate in memoria con `mergeStoredRows()`.

## Perimetro

Nessun cambio a Firebase, regole, funzioni Netlify o trattative reali.
