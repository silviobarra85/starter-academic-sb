# Handoff nuovo assistente - V363

## Stato

La V363 corregge la UX della Checklist QA Admin con simulazione notifiche trade verso presidente.

## Problema segnalato

- Il box simulazione V362 sforava nelle schede affiancate.
- La `i` informativa e il menu destinatario si richiudevano/resettavano dopo pochi secondi.
- L'utente chiedeva come testare davvero la simulazione, dato che la checklist e' solo Admin mentre la notifica e' visibile al presidente.

## Soluzione V363

- Card simulatori trade impostate a riga piena: classe `is-trade-simulator-v363`.
- CSS responsivo su `manual-qa-trade-v361__target-row` e select con `min-width:0`, `max-width:100%`.
- Auto-render protetto con `shouldDeferAutoRenderV363()` e `autoRenderV363()`.
- Interval portato a 7000ms e non distruttivo.
- Il change del select aggiorna localStorage e toast senza ridisegnare subito il pannello.
- Marker runtime: `window.ZonaOrientaleManualQaPanelStabilityV363`.

## Istruzione chiave per test manuale

Per verificare la simulazione presidente:

1. Crea simulazione da Admin.
2. Accedi come presidente destinatario nello stesso browser.
3. Controlla badge/card.
4. Accetta/Rifiuta: azioni locali, nessuna scrittura Firebase.

## Non toccare senza richiesta

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Trattative reali Firebase.
- Modulo simulatore V255.
- Local actions V349.
- Target panel V362.
