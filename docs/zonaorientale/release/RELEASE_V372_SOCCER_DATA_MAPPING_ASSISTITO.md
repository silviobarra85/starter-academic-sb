# Release V372 - Soccer Data mapping assistito

Data: 2026-06-05

## Obiettivo

Preparare il mapping controllato tra giocatori ZonaOrientale e profili FBref, mantenendo il vincolo principale: mostrare e lavorare solo sui giocatori presenti nel listone attivo.

## Cosa cambia

- La sezione Soccer Data resta read-only e additiva.
- Il manifest punta a `fbref-player-map.v372.json`.
- Ogni giocatore `IN_LISTONE` ha ora:
  - query FBref suggerita;
  - link di ricerca FBref;
  - batch di revisione;
  - priorita di revisione;
  - campi vuoti da compilare: `fbrefId`, `fbrefName`, `fbrefUrl`, `matchStatus`, `confidence`, `notes`.
- Aggiunto CSV ordinato per priorita: `fbref-review-batch.v372.csv`.
- Aggiunto tool locale: `tools/generate-soccer-data-mapping-v372.mjs`.
- Aggiunto audit: `tools/audit-soccer-data-mapping-v372.mjs`.

## Garanzie

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Gli asteriscati restano esclusi.

## Nota FBref

La ricerca FBref resta manuale e guidata. I dati storici verranno importati solo in una fase successiva tramite workflow offline/cache, rispettando rate-limit e condizioni dei siti sorgente.
