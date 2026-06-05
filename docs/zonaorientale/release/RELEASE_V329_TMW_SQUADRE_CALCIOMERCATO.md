# Release V329 - TMW squadre Calciomercato

## Sintesi

V329 estende il Calciomercato con le pagine squadra TuttoMercatoWeb fornite, aumenta i limiti di recupero/download e aggiunge un fallback scudetto per gli articoli TMW senza immagine.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `netlify/functions/calciomercato-feed.js`
- `docs/zonaorientale/CHANGELOG_CONSOLIDATO.md`
- `docs/zonaorientale/calciomercato/CALCIOMERCATO_TMW_SQUADRE_V329.md`
- `docs/zonaorientale/release/RELEASE_V329_TMW_SQUADRE_CALCIOMERCATO.md`

## Controlli funzionali

- `node --check static/zonaorientale/assets/app.js`
- `node --check netlify/functions/calciomercato-feed.js`
- `python3 -m json.tool static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `tools/audit-assets-v298.sh`
- `tools/audit-css-v300.sh`

## Funzionalita da non perdere

- Calciomercato V328, compreso mobile con solo titolo/metadata.
- Toggle Solo Admin V327.
- Rifiniture UI V326.
- Archivio statico V323/V324.
- RSS automatici non TMW.
- Listone, export, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
