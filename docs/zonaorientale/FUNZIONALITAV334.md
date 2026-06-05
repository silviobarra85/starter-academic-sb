# FUNZIONALITA V334 - Refactor immagini Calciomercato protetto

Data: 05/06/2026
Versione runtime: V334
Tipo intervento: refactor JS protetto, senza cambio comportamento intenzionale.

## Obiettivo V334

La V334 estrae da `assets/app.js` le funzioni di supporto per immagini e testi degli articoli Calciomercato, spostandole nel nuovo modulo:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
```

Il rendering delle card resta gestito da `app.js`; il nuovo modulo fornisce solo helper puri per:

- decodifica entita HTML dei testi articolo;
- riconoscimento immagine diretta articolo;
- fallback favicon fonte;
- fallback tile SVG fonte;
- tile testuale `TMW - <NomeSquadra>` per fonti TMW squadra;
- riconoscimento del vecchio fallback logo squadra V329.

## Funzionalita preservate

La V334 deve preservare tutte le funzionalita gia presenti all'ultimo merge su master e documentate nella V333. In particolare:

### Calciomercato

- Caricamento articoli da feed RSS automatici.
- Caricamento articoli da pagine HTML TMW squadra.
- Lettura archivio statico giornaliero da `assets/calciomercato/archive/`.
- Download Admin archivio statico con limiti aumentati V329.
- Fonti TMW squadra in `links.json`.
- Esclusione fonte generica TMW tramite `removedSourcesV316`.
- Filtri `Cerca`, `Fonte`, `Squadra`, `Da`, `A`.
- Range temporale e pulsante carica articoli/archivio.
- Card compatte V332.
- Nessuna anteprima/testo descrittivo nelle card V331.
- Titolo e immagine cliccabili.
- Pulsante `Apri articolo` nascosto da mobile.
- Fallback immagini V328/V330.
- Pannello `Solo Admin` espandibile/riducibile V327.

### Listone

- Visualizzazione Listone pubblico.
- Colonna `Modifica`.
- Filtro `Modifiche`.
- Stile filtro `Modifiche` separato in `assets/css/refactor/listone.css` V333.
- Usciti storici.
- Export CSV modifiche solo Admin.
- Manifest e JSON Listoni non modificati da V334.

### Altre sezioni

- Home/Dashboard pubblica.
- News e share WhatsApp.
- Rose e pagina squadra.
- Fantamercato interno.
- Competizioni e pagina `competition.html`.
- Pagina giocatore `player.html`.
- Archivio, statistiche e confronta.
- Dashboard Presidente.
- Admin, richieste presidenti e diagnostica dati.
- Firebase/Auth/EmailJS.
- Mobile bottom navigation e menu `Altro`.
- Dark mode unico.

## File runtime modificati

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
static/zonaorientale/tools/check-zonaorientale.sh
```

## File non modificati intenzionalmente

```text
netlify/functions/calciomercato-feed.js
static/zonaorientale/assets/calciomercato/links.json
static/zonaorientale/assets/calciomercato/archive/*.json
static/zonaorientale/assets/calciomercato/archive/manifest.json
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/assets/css/refactor/listone.css
static/zonaorientale/assets/css/refactor/mobile-controls.css
static/zonaorientale/assets/listoni/*.json
static/zonaorientale/assets/listoni/manifest.json
docs/zonaorientale/FUNZIONALITA'.md
```

## Diagnostica runtime

La V334 aggiunge:

```js
window.ZonaOrientaleCalciomercatoImagesV334
```

Campi principali:

- `behaviorChange: false`;
- `module: "assets/js/calciomercato/calciomercato-images-v334.js"`;
- `getArticleImageInfo`;
- `decodeText`.

## Rischi controllati

| Area | Rischio | Mitigazione |
|---|---|---|
| Immagini articoli Calciomercato | fallback non mostrato | wrapper in `app.js` mantiene i nomi storici V325/V328/V330 |
| TMW squadra | tile testuale non riconosciuta | funzione `isTmwTeamSource` resta nel modulo e viene richiamata dai wrapper |
| Favicon fonte | errore immagine | resta `fallbackSrc` verso SVG fonte |
| Testi codificati | ricomparsa entita HTML | `decodeText` resta esposto e usato nel rendering card |
| Import modulo | asset mancante | `check-zonaorientale.sh` verifica modulo e marker V334 |

## Verifiche consigliate in browser

1. Aprire Calciomercato.
2. Verificare card con immagine reale articolo.
3. Verificare card senza immagine di fonte non TMW: favicon o tile fonte.
4. Verificare card TMW squadra senza immagine: tile `TMW - <NomeSquadra>`.
5. Provare filtri `Cerca`, `Squadra`, `Fonte`, `Da`, `A`.
6. Aprire/ridurre `Solo Admin`.
7. Verificare Listone e filtro `Modifiche`.
8. Verificare menu mobile `Altro`.

