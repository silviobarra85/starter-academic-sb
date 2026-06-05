# FUNZIONALITA V338 - Renderer card Calciomercato protetto

Versione: V338  
Data: 05/06/2026  
Ambito: refactor protetto del rendering delle schede articolo Calciomercato.

## Obiettivo

Ridurre ulteriormente la complessita di `assets/app.js` senza cambiare comportamento runtime, estraendo il rendering HTML delle card articolo Calciomercato in un modulo dedicato.

La V338 non introduce nuove funzionalita utente: e' un refactor protetto.

## Funzionalita V338

- Creato il modulo `assets/js/calciomercato/calciomercato-render-v338.js`.
- Il modulo espone `createCalciomercatoArticleRendererV338`.
- `renderCalciomercatoArticleCardV306(article)` resta disponibile in `app.js` come nome storico, ma ora delega a `CalciomercatoArticleRendererV338.renderArticleCard(article)`.
- Il rendering mantiene:
  - card compatte V332;
  - titolo cliccabile;
  - immagine/thumbnail cliccabile;
  - fonte e data;
  - bottone `Apri articolo` su desktop;
  - bottone nascosto da mobile via CSS V331;
  - tag squadra/topic/status;
  - tag giocatore V335-V337;
  - fallback immagini V334/V328/V330.
- Aggiunta diagnostica runtime `window.ZonaOrientaleCalciomercatoRendererV338`.
- Aggiornato `check-zonaorientale.sh` per verificare la presenza del modulo e della delega.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale TMW - NomeSquadra V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Matching giocatore V337.
- Modal timeline giocatore V336.
- Tag giocatore V335.
- Archivio statico Calciomercato V323/V324.
- Pannello Solo Admin espandibile/riducibile V327.
- Filtri Calciomercato Cerca, Squadra, Topic, Fonte, Da, A.
- Download archivio statico giornaliero dal pannello Admin Calciomercato.
- Listone e filtro Modifiche.
- Export CSV Listone solo Admin.
- Rose e pagina squadra.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale, diagnostica dati, convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- News/share WhatsApp.
- Navigazione mobile e menu Altro.
- Pagine standalone `competition.html` e `player.html`.

## File principali coinvolti

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/calciomercato/calciomercato-render-v338.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## File non modificati intenzionalmente

- `docs/zonaorientale/FUNZIONALITA'.md`
- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/assets/calciomercato/archive/*.json`
- `static/zonaorientale/assets/listoni/*.json`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`

## Diagnostica

In console browser e' disponibile:

```js
window.ZonaOrientaleCalciomercatoRendererV338
```

La diagnostica espone il renderer attivo e conferma che la card e' renderizzata dal modulo V338.
