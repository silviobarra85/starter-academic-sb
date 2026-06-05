# FUNZIONALITA V339 - Filtri Calciomercato protetti

Versione: V339  
Data: 05/06/2026  
Ambito: refactor protetto della logica filtri Calciomercato.

## Obiettivo

Ridurre la complessita di `assets/app.js` estraendo in un modulo dedicato la gestione dei filtri Calciomercato, senza cambiare comportamento utente, dati, feed o stile delle card.

La V339 non introduce nuove funzionalita utente: e' un refactor protetto.

## Funzionalita V339

- Creato il modulo `assets/js/calciomercato/calciomercato-filters-v339.js`.
- Il modulo espone `createCalciomercatoFiltersV339`.
- Restano disponibili i nomi storici in `app.js`:
  - `getCalciomercatoFilteredArticlesV306()`;
  - `renderCalciomercatoSelectOptionsV306()`;
  - `renderCalciomercatoTeamSelectOptionsV314()`;
  - `renderCalciomercatoSourceSelectOptionsV314()`;
  - `setupCalciomercatoControlsV306()`.
- I wrapper storici ora delegano al modulo V339.
- La gestione eventi resta delegata sulla sezione `data-page="calciomercato"` e continua a usare il flag storico `data-calciomercato-bound-v306`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleCalciomercatoFiltersV339`.
- Aggiornato `check-zonaorientale.sh` per verificare modulo, delega e documentazione V339.

## Filtri preservati

- Ricerca testuale `Cerca`.
- Filtro squadra.
- Filtro topic.
- Filtro fonte.
- Range temporale `Da` / `A`.
- Bottone applica periodo.
- Bottone reset periodo.
- Bottone/caricamento articoli piu vecchi.
- Infinite scroll automatico per feed RSS quando il range non e' manuale.
- Meta conteggio articoli visibili/totali.
- Avviso nessun articolo corrispondente ai filtri.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale TMW - NomeSquadra V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Renderer card V338.
- Matching giocatore V337.
- Modal timeline giocatore V336.
- Tag giocatore V335.
- Archivio statico Calciomercato V323/V324.
- Pannello Solo Admin espandibile/riducibile V327.
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
- `static/zonaorientale/assets/js/calciomercato/calciomercato-filters-v339.js`
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
- `static/zonaorientale/assets/css/refactor/listone.css`

## Diagnostica

In console browser e' disponibile:

```js
window.ZonaOrientaleCalciomercatoFiltersV339
```

Campi utili:

```js
window.ZonaOrientaleCalciomercatoFiltersV339.getState()
window.ZonaOrientaleCalciomercatoFiltersV339.getFilteredCount()
```

## Rischi controllati

- Possibile perdita binding filtri: mitigata mantenendo il nome storico `setupCalciomercatoControlsV306()` e il flag storico di binding.
- Possibile cambio ordinamento option: mitigato copiando l'ordinamento precedente e la regola `Generale` prima delle altre squadre.
- Possibile cambio ricerca: mitigato mantenendo lo stesso haystack e lo stesso normalizzatore V306.
- Possibile cambio reload fonte/range: mitigato mantenendo la stessa chiamata a `reloadCalciomercatoDataV316()`.

## Prossimo passo consigliato

Procedere con V340: estrazione protetta del pannello `Solo Admin` / archivio Calciomercato, senza modificare Netlify Function, JSON archivio o `links.json`.
