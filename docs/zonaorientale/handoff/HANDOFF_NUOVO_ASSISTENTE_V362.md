# Handoff nuovo assistente - V362

## Stato

Versione corrente: V362.

La V362 rende testabile da interfaccia Admin anche il caso "notifica ricevuta da un presidente". La Checklist QA Admin ora permette di selezionare una squadra/presidente destinatario e creare una proposta locale indirizzata a quel profilo.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-trade-simulator-target-v362.mjs`
- `docs/zonaorientale/FUNZIONALITAV362.md`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorTargetPanelV362
window.ZonaOrientaleManualQaPanelV358 // badge/runtime aggiornato a V362
```

## Vincoli da preservare

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Le simulazioni V362 devono restare local-only.
- Non usare Firebase per creare notifiche simulate da Checklist.
- Le trattative reali devono continuare a passare dal flusso Firebase esistente.
- Conservare il simulatore V255 e le azioni locali V349.

## Come testare

1. Admin > Checklist QA > Fantamercato.
2. Selezionare squadra/presidente.
3. Premere `Simula per presidente`.
4. Accedere come quel presidente nello stesso browser.
5. Verificare badge/card e Accetta/Rifiuta locali.

## Prossimo passo consigliato

V363: piccoli miglioramenti UX emersi dalla prova reale della Checklist, oppure handoff pre-push/master se il QA e' soddisfacente.
