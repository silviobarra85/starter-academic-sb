# Calciomercato - Tile testuale TMW squadra V330

## Obiettivo

Sostituire il fallback a scudetto introdotto in V329 con una immagine generata contenente la scritta `TMW - <NomeSquadra>` per gli articoli delle fonti TuttoMercatoWeb squadra che non espongono una vera immagine di anteprima.

## Modifiche

- `assets/app.js`
  - aggiunge `buildCalciomercatoTmwTeamTextSvgV330(teamName)`;
  - usa la tile testuale per le fonti TMW squadra senza immagine;
  - riconosce anche gli archivi gia generati in cui `image` coincide con `teamLogoUrl`, evitando di trattare il logo/scudetto come immagine articolo reale;
  - espone diagnostica `window.ZonaOrientaleCalciomercatoV330`.
- `assets/css/refactor/calciomercato.css`
  - aggiunge stile dedicato `.calciomercato-thumb-tmw-team-v330`.
- `assets/calciomercato/links.json`
  - aggiorna le 20 fonti TMW squadra a `fallbackImageMode: tmw-team-text`.
- `netlify/functions/calciomercato-feed.js`
  - conserva `teamLogoUrl` come metadato;
  - non inserisce piu il logo/scudetto squadra nel campo `image` quando l'articolo non contiene una vera immagine.

## Funzionalita preservate

- Fonti TMW squadra V329 e supporto HTML TMW.
- Limiti di recupero/download archivio V329.
- RSS automatici non TMW.
- Fallback favicon/tile per fonti non TMW.
- Card mobile V328.
- Toggle Solo Admin V327.
- Menu mobile e Listone V326.
- Archivio statico V323/V324.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## Test consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check netlify/functions/calciomercato-feed.js
python3 -m json.tool static/zonaorientale/assets/calciomercato/links.json
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```
