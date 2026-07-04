# V520 - Runtime cache sweep whole-site

## Problema

Dopo V519 ZonaOrientale avviava correttamente, ma FantaPetilloMantraManager continuava a mostrare `league-config-v443.js?v=512` e quindi il vecchio `ReferenceError: formValidatorsV506 is not defined`.

La causa era un riallineamento incompleto degli entrypoint: `index.html` e `app.js` erano stati aggiornati, ma alcune pagine standalone e `static-files-service.js` conservavano ancora riferimenti `?v=512`.

## Correzione

- Entrambe le leghe sono portate a cache-buster runtime `?v=520`.
- `competition.html`, `player.html`, `bilanci.html`, `news.html`, `index.html`, `app.js`, `static-files-service.js`, `league-config-v443.js` e `league-config.json` sono riallineati dove presenti.
- `formValidatorsV506: true` resta definito in `league-config-v443.js`.
- `public-data-autoload-v512.js` mantiene gli alias precedenti e aggiunge alias V520.
- Aggiunto audit `static/fanta-engine/tools/audit-runtime-cache-sweep-whole-site-v520.mjs`.

## Guardrail

- Overlay whole-site con radici `static/` e `docs/`.
- Solo file effettivamente modificati.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna rimozione di funzionalita esistenti.
