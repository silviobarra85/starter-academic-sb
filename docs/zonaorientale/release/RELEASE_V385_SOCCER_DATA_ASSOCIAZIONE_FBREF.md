# Release V385 - Soccer Data associazione FBref locale

## Sintesi

V385 rende operativo il collegamento dei nuovi giocatori non mappati: il sito consente di incollare un link FBref e generare una patch JSON esportabile, senza scritture Firebase e senza scraping live.

## File principali

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-soccer-data-association-patch-v385.mjs`
- `docs/zonaorientale/FUNZIONALITAV385.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V385.md`
- `docs/zonaorientale/audit/SOCCER_DATA_ASSOCIAZIONE_FBREF_V385.md`

## Invarianti

- `assets/soccer-data/manifest.json` resta su `fbref-player-map.v383.json`.
- Nessun file `fbref-player-map.v385.json` viene creato.
- `FUNZIONALITA'.md` non viene modificato.
- Firebase/Auth/EmailJS/Netlify Functions non vengono toccati.
