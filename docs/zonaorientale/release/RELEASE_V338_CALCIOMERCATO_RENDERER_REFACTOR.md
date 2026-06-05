# Release V338 - Renderer card Calciomercato protetto

## Sintesi

V338 estrae il rendering delle card articolo Calciomercato da `assets/app.js` nel nuovo modulo `assets/js/calciomercato/calciomercato-render-v338.js`.

La release non cambia comportamento utente intenzionale.

## Modifiche

- Nuovo modulo `calciomercato-render-v338.js`.
- Import del modulo in `assets/app.js`.
- `renderCalciomercatoArticleCardV306(article)` diventa wrapper verso il renderer V338.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoRendererV338`.
- Aggiornato `check-zonaorientale.sh`.
- Aggiornati footer/cache-buster a V338.
- Aggiunti documenti V338.

## Funzionalita preservate

- Calciomercato feed RSS/HTML e archivio statico.
- Fonti TMW squadra.
- Fallback favicon/fonte/TMW testuale.
- Matching giocatore e timeline modal.
- Card compatte.
- Filtri Calciomercato.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- Mobile navigation e share WhatsApp.

## File intenzionalmente non modificati

- `docs/zonaorientale/FUNZIONALITA'.md`
- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/assets/calciomercato/archive/*.json`
- `static/zonaorientale/assets/listoni/*.json`

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-render-v338.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```
