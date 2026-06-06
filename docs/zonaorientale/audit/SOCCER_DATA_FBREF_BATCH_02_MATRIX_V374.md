# Audit matrix V374 - Soccer Data FBref batch-02

| Controllo | Esito atteso |
|---|---|
| Manifest punta a `fbref-player-map.v374.json` | OK |
| Mapping contiene solo `IN_LISTONE` | OK |
| Mapping contiene 532 giocatori | OK |
| Asteriscati esclusi | OK |
| Confermati totali | 100 |
| Confermati batch-02 | 50 |
| Nessun mapping V374 fuori batch-02 | OK |
| Nessuna scrittura Firebase | OK |
| Nessuno scraping live browser | OK |
| Marker V371/V372/V373 preservati | OK |
| Marker V374 presente | OK |

Comando audit:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v374.mjs
```
