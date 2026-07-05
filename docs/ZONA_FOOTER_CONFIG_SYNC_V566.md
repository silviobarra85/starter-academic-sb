# V566 - Footer ZonaOrientale da config allineato

## Problema
Il footer visibile di ZonaOrientale veniva aggiornato da `league-config-v443.js`, non solo dal testo presente in `index.html`.

`applyBrandTextV445()` sovrascrive `[data-league-footer-v445]` costruendo il testo da:

- `currentVersion`;
- `branding.footerLastUpdated`;
- `branding.footerTemplate`.

Poiche' `assets/league-config.json` era ancora a `currentVersion: "563"`, il footer online poteva mostrare ancora `V563`.

## Correzione
V566 riallinea la sorgente runtime del footer:

- `static/zonaorientale/assets/league-config.json`;
- `static/zonaorientale/assets/js/core/league-config-v443.js`;
- `static/zonaorientale/assets/app.js`;
- `static/zonaorientale/index.html`;
- `static/zonaorientale/competition.html`;
- `static/zonaorientale/player.html`.

## Nota operativa
Per i prossimi overlay ZonaOrientale, aggiornare sempre anche `currentVersion` in `league-config.json` e il fallback in `league-config-v443.js`, altrimenti il footer HTML puo' essere sovrascritto da una versione precedente.
