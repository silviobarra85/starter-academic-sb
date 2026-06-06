# Audit matrix V371 - Soccer Data protetto

## Controlli obbligatori

| Controllo | Esito atteso |
|---|---|
| `assets/app.js` sintassi valida | OK |
| `DEPLOY_EXPECTED_VERSION_V181` | `371` |
| Cache-buster HTML | `v=371` |
| Footer HTML | `V371 Soccer Data protetto` |
| Nav desktop Soccer Data | presente |
| Nav mobile Soccer Data | presente |
| Sezione `data-page="soccerdata"` | presente |
| Marker `window.ZonaOrientaleSoccerDataV371` | presente |
| Mapping base | presente |
| Manifest Soccer Data | presente |
| CSV mapping | presente |
| Mapping solo `IN_LISTONE` | OK |
| Asteriscati esclusi | OK |
| Firebase writes | assenti |
| Scraping live browser | assente |
| V368/V369/V370 ancora presenti | OK |

## Tool

```bash
node static/zonaorientale/tools/audit-soccer-data-v371.mjs
```
