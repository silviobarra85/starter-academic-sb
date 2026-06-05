# Handoff nuovo assistente - V361

## Stato

Versione corrente: V361.

La V361 stabilizza il test delle notifiche Fantamercato aggiungendo un pannello operativo nella Checklist QA Admin. Non cambia il flusso reale delle trattative e non scrive su Firebase.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-trade-simulator-panel-v361.mjs`
- `docs/zonaorientale/FUNZIONALITAV361.md`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorPanelV361
```

## Vincoli da preservare

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non toccare trattative reali Firebase per le simulazioni.
- Le simulazioni devono restare local-only.
- I pulsanti Accetta/Rifiuta reali devono continuare a passare dal flusso Firebase.

## Prossimo passo consigliato

V362: handoff finale/pre-push o piccoli fix emersi dalla checklist QA Admin.
