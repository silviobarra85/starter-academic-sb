# Audit V385 - Soccer Data associazione FBref locale

## Controlli coperti

- Runtime allineato a V385.
- Mapping corrente ancora `fbref-player-map.v383.json`.
- Manifest invariato: no Firebase writes e no live scraping.
- Tabella Soccer Data senza colonna `Azione` separata.
- Mini flusso sui soli giocatori da associare/needs-review.
- Campi link FBref e nome FBref opzionale presenti.
- Azioni `Prepara mapping`, `Copia patch`, `Rimuovi patch`, `Copia patch FBref`, `Scarica patch FBref` presenti.
- Patch JSON esportabile con metadata di sicurezza.
- Nessun file mapping V385 creato automaticamente.

## Gate

```bash
node tools/audit-soccer-data-association-patch-v385.mjs
node tools/audit-soccer-data-fbref-batch-v383.mjs
node --check assets/app.js
```
