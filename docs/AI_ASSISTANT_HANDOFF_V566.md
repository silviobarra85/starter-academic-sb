# AI Assistant Handoff V566 - Footer ZonaOrientale da config allineato

## Obiettivo
Correggere il footer ZonaOrientale che mostrava `V563` online anche dopo patch successive.

## Diagnosi
Il testo statico in `static/zonaorientale/index.html` era gia' avanzato, ma a runtime `static/zonaorientale/assets/js/core/league-config-v443.js` applica `applyBrandTextV445()` e sovrascrive ogni elemento `[data-league-footer-v445]` usando:

- `assets/league-config.json.currentVersion`;
- `assets/league-config.json.branding.footerLastUpdated`;
- `assets/league-config.json.branding.footerTemplate`.

La config ZonaOrientale era rimasta a `currentVersion: "563"`, quindi il footer visibile diventava `ZonaOrientale Salerno · V563 · Ultimo aggiornamento 04/07/2026` anche se l'HTML statico era stato aggiornato.

## Modifiche
- `league-config.json` portato a `currentVersion: "566"`.
- `league-config-v443.js` allineato a fallback/config URL `v=566`.
- `index.html`, `competition.html` e `player.html` riallineati su footer/cache-buster V566.
- `assets/app.js` riallineato su import config V566 e `DEPLOY_EXPECTED_VERSION_V181 = "566"`.

## Preservato
- Calciomercato disattivato V561.
- Svincola Giocatori ZonaOrientale V563.
- Layout header Svincola V564.
- Logo account presidente coerente con stagione V565.
- Nessuna modifica a FantaPetilloMantraManager.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Audit
```bash
node static/fanta-engine/tools/audit-zona-footer-config-v566.mjs
```
