# Handoff V518 - Runtime recovery whole-site

Overlay creato per risolvere il persistere del runtime V512 su FantaPetilloMantraManager.

## File runtime coinvolti

- `static/fantapetillomantramanager/index.html`
- `static/fantapetillomantramanager/assets/app.js`
- `static/fantapetillomantramanager/assets/js/core/league-config-v443.js`
- file runtime collegati con cache-buster V518
- equivalenti ZonaOrientale per mantenere overlay whole-site
- `static/fanta-engine/js/core/public-data-autoload-v512.js`
- `static/fanta-engine/tools/audit-runtime-boot-whole-site-v518.mjs`

## Controllo chiave

Dopo applicazione, questo comando deve produrre output con `v=518`:

```bash
grep -n "league-config-v443.js?v=" static/fantapetillomantramanager/index.html static/fantapetillomantramanager/assets/app.js
```
