# Soccer Data FBref batch-01 matrix V373

## Vincoli

| Controllo | Esito |
|---|---|
| Solo `IN_LISTONE` | OK |
| Asteriscati esclusi | OK |
| 532 giocatori nel mapping | OK |
| 50 mapping confermati batch-01 | OK |
| Nessuno scraping live | OK |
| Nessuna scrittura Firebase | OK |
| Funzionalita esistenti preservate | OK |

## Gate automatico

Script:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v373.mjs
```

Il gate fallisce se:

- il manifest non punta a `fbref-player-map.v373.json`;
- il mapping non contiene 532 record;
- entra un giocatore non `IN_LISTONE`;
- i confermati V373 non sono esattamente 50;
- un confermato non ha `fbrefId`, `fbrefName`, `fbrefUrl` coerenti;
- manca il marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV373`.
