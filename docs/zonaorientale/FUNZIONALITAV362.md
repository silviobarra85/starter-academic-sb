# FUNZIONALITAV362 - Simulazione notifiche trade verso presidente da Admin

Versione: V362
Data: 05/06/2026

## Obiettivo

La Checklist QA e' visibile solo agli admin, ma una notifica trade ricevuta deve essere verificata dal punto di vista del presidente destinatario. La V362 aggiunge quindi un menu nella Checklist QA Admin per scegliere una squadra/presidente e creare una proposta ricevuta locale indirizzata a quel destinatario.

## Nuove funzioni

Nella Checklist QA Admin, area Fantamercato:

- menu `Simula ricezione per presidente/squadra`;
- elenco delle squadre della stagione corrente con presidenti associati;
- pulsante `Simula per presidente`;
- salvataggio locale delle simulazioni target in `localStorage`;
- reinserimento automatico delle simulazioni in `state.raw.transferNegotiations`;
- conteggio delle simulazioni presidente salvate;
- pulizia integrata con `Pulisci simulazioni`.

## Flusso di test consigliato

1. Accedere come admin.
2. Aprire la Checklist QA Admin.
3. Filtrare `Fantamercato`.
4. Selezionare una squadra/presidente nel menu.
5. Premere `Simula per presidente`.
6. Accedere nello stesso browser come quel presidente.
7. Verificare badge notifiche e card nella Dashboard Presidente/Fantamercato.
8. Cliccare `Accetta` o `Rifiuta`: l'azione deve restare locale e non deve produrre errori Firebase.
9. Tornare admin e usare `Pulisci simulazioni`.

## API runtime

```js
window.ZonaOrientaleTradeSimulatorTargetPanelV362
```

Metodi principali:

```js
getTeamOptions()
getStatus()
setSelectedTarget(seasonTeamId)
simulateIncomingForTarget(seasonTeamId)
clearTargetSimulations()
mergeStoredRows()
runSmokeTest()
```

## Funzionalita' preservate

- Trattative reali Firebase invariate.
- Simulatore V255 preservato.
- Azioni locali V349 preservate.
- Pannello simulatore V361 preservato.
- Badge reali invariati.
- Dashboard Presidente invariata.
- Calciomercato, Listone, Rose, Competizioni, Admin e mobile navigation invariati.

## Note di sicurezza

La simulazione V362 e' local-only. Non usa `addDoc`, non scrive in Firebase e viene salvata solo nel browser con chiave:

```text
zonaorientale.tradeSimulatorTargetPanel.v362.rows
```
