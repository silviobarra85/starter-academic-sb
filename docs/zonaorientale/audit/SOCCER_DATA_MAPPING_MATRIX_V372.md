# Soccer Data mapping matrix V372

## Scope

| Area | Stato |
| --- | --- |
| Giocatori inclusi | Solo `statusCode: IN_LISTONE` |
| Asteriscati | Esclusi |
| Scraping live browser | No |
| Firebase writes | No |
| Sezioni esistenti | Preservate |
| FUNZIONALITA'.md | Non modificato |

## File runtime aggiunti

- `assets/soccer-data/fbref-player-map.v372.json`
- `assets/soccer-data/fbref-player-map.v372.csv`
- `assets/soccer-data/fbref-review-batch.v372.csv`
- `tools/generate-soccer-data-mapping-v372.mjs`
- `tools/audit-soccer-data-mapping-v372.mjs`

## Controlli V372

- mapping righe = giocatori attivi listone;
- nessun record non `IN_LISTONE`;
- playerKey univoci;
- query/link/batch/priorita presenti per ogni riga;
- marker runtime `window.ZonaOrientaleSoccerDataMappingAssistantV372`.
