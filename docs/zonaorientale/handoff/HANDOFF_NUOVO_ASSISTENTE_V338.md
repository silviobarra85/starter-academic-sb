# Handoff nuovo assistente AI - ZonaOrientale V338

## Stato corrente

La versione corrente e' V338. Il sito mantiene i refactor protetti V333-V337 e aggiunge l'estrazione del renderer delle card articolo Calciomercato in un modulo dedicato.

La V338 e' un refactor senza cambio comportamento intenzionale. Non modifica feed, dati, JSON, Netlify Functions, CSS card, filtri o archivi.

## Regola fondamentale

Non cancellare o scollegare funzionalita esistenti. Ogni modifica deve essere mirata e testata con:

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

`docs/zonaorientale/FUNZIONALITA'.md` non deve essere modificato se l'utente non lo chiede esplicitamente.

## File principali V338

- `assets/app.js`
  - importa `createCalciomercatoArticleRendererV338`.
  - mantiene `renderCalciomercatoArticleCardV306(article)` come wrapper storico.
  - espone `window.ZonaOrientaleCalciomercatoRendererV338`.

- `assets/js/calciomercato/calciomercato-render-v338.js`
  - modulo puro di rendering HTML.
  - non usa DOM diretto, fetch, Firebase o stato globale.
  - riceve le dipendenze da `app.js`.
  - renderizza card, thumbnail, chip squadra e chip status.

## Cosa preservare nei prossimi refactor

- `renderCalciomercatoArticleCardV306` deve restare disponibile finche tutte le chiamate storiche non vengono migrate.
- La timeline giocatore V336 usa ancora `renderCalciomercatoArticleCardV306` per gli articoli nel modal.
- Il matching giocatore V337 deve continuare a funzionare con punteggiatura normalizzata.
- Il refactor immagini V334 deve restare collegato al renderer V338 tramite `getCalciomercatoArticleImageInfoV325`.
- La card deve mantenere i fallback TMW/fonte/favicon e la struttura CSS V332/V331.

## Funzionalita da preservare obbligatoriamente

- Calciomercato V338/V337/V336/V335/V334/V332/V330/V329/V328/V327.
- Listone V333/V331, filtro Modifiche, colonna Modifica ed export CSV solo Admin.
- Rose, pagina squadra, Fantamercato interno.
- Dashboard Presidente e Admin.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- Archivio statico Calciomercato e download Admin.
- Mobile navigation, menu Altro, share WhatsApp News.
- `competition.html` e `player.html`.

## Test minimi consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-render-v338.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Prossima direzione consigliata

Dopo V338 si puo' procedere con l'estrazione protetta dei filtri Calciomercato:

- stato filtri;
- popolamento select Squadra/Topic/Fonte;
- applicazione range Da/A;
- reset ultime 12 ore;
- mantenendo invariati gli ID DOM e `calciomercatoStateV306`.
