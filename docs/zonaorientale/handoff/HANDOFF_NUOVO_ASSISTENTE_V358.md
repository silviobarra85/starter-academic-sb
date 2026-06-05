# Handoff nuovo assistente - V358

## Stato

V358 migliora la checklist QA Admin introdotta in V357. Non introduce rimozioni e non modifica flussi core.

## File principali

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-panel-v358.mjs`
- `docs/zonaorientale/test/MANUAL_QA_INTERFACCIA_V358.md`

## Cosa preservare

Non rimuovere o scollegare la logica V356/V357: V358 riusa lo stesso storage `zonaorientale.manualQa.v356` per mantenere lo storico dei test.

## Prossimo passo consigliato

Usare il pannello da Admin e correggere solo problemi reali emersi dal QA. Evitare nuove rimozioni finche il giro manuale non e completato.
