# Release V330 - Fallback testuale TMW squadra

## Sintesi

V330 rifinisce la V329: quando un articolo proveniente da una fonte TMW squadra non ha una vera immagine di anteprima, la card mostra una tile generata con testo `TMW - <NomeSquadra>` invece dello scudetto/logo squadra.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `netlify/functions/calciomercato-feed.js`
- `docs/zonaorientale/CHANGELOG_CONSOLIDATO.md`
- `docs/zonaorientale/calciomercato/CALCIOMERCATO_TMW_TILE_TESTUALE_V330.md`
- `docs/zonaorientale/release/RELEASE_V330_TMW_TILE_TESTUALE.md`

## Controlli funzionali

- `node --check static/zonaorientale/assets/app.js`
- `node --check netlify/functions/calciomercato-feed.js`
- `python3 -m json.tool static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh`
- `static/zonaorientale/tools/audit-css-v300.sh`

## Funzionalita da non perdere

- Fonti TMW squadra V329.
- Download archivio Calciomercato con limiti V329.
- Parser RSS e HTML Calciomercato.
- Fallback favicon/tile per fonti non TMW.
- Card mobile V328.
- Toggle Solo Admin V327.
- Rifiniture UI V326.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
