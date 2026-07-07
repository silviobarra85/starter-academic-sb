# Handoff V588 - Rose GitHub fonte primaria + sync manuale rosterEntries

## Obiettivo
Rendere operativo il flusso in cui le rose modificate con l'editor Admin vengono caricate su GitHub in `assets/rose` e poi visualizzate dal sito senza dover modificare manualmente Firestore.

## Modifiche
- `assets/rose` diventa fonte primaria per la visualizzazione delle rose.
- `rosterEntries` diventa fallback quando non esiste una rosa statica per la stagione selezionata.
- La sincronizzazione di `rosterEntries` non avviene automaticamente all'apertura del sito.
- In Area Admin, l'Editor rose GitHub V588 aggiunge il pulsante esplicito `Sincronizza rosterEntries dalla rosa GitHub`.
- Il sync Admin marca `REMOVED` le entry attive della stagione e scrive le entry attive generate dalla rosa statica pubblicata.

## File principali
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/fanta-engine/js/ui/static-roster-editor-v588.js`
- `static/fanta-engine/css/static-roster-editor-v588.css`
- `static/fanta-engine/tools/audit-static-rosters-primary-v588.mjs`

## Guardrail
- Nessuna scrittura automatica su Firestore.
- Sync solo da Admin e solo con conferma esplicita.
- Link, Listone, Area Squadra, Rose e profili squadra leggono la rosa statica se presente.
- Calciomercato resta disattivato.
- `FUNZIONALITA'.md` non e' stato modificato.
