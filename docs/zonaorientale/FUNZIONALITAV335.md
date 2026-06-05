# FUNZIONALITA V335 - Tag giocatore e timeline articoli Calciomercato

Data: 05/06/2026
Versione runtime: V335
Tipo intervento: refactor JS protetto + nuova funzionalita isolata nella sezione Calciomercato.

## Obiettivo V335

La V335 continua il refactor protetto del Calciomercato aggiungendo il modulo puro:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
```

Il modulo associa in modo conservativo un articolo a uno o piu giocatori presenti nell'ultimo listone della stagione selezionata.

La UI mostra il tag del giocatore accanto ai tag gia presenti sopra il titolo dell'articolo. Il tag e cliccabile e apre una pagina interna di timeline con gli articoli che parlano di quel giocatore.

## Regole di associazione articolo -> giocatore

La V335 usa solo dati gia presenti nel sito:

- articoli Calciomercato caricati da feed, HTML TMW o archivio statico;
- ultimo listone disponibile per la stagione selezionata;
- campi articolo gia normalizzati (`title`, `description`, `tags`, `players`, `detectedPlayers`, ecc.).

Matching conservativo:

- match forte su nome completo normalizzato;
- match secondario su cognome solo se il cognome e univoco nel listone e lungo almeno 5 caratteri;
- massimo 3 tag giocatore mostrati nella card;
- nessuna scrittura Firebase;
- nessuna modifica a JSON Listone, archivio o feed.

## Timeline giocatore

Il click sul tag apre una route hash interna:

```text
#calciomercato-player-<slug-giocatore>
```

La pagina timeline:

- usa il giocatore riconosciuto nell'ultimo listone della stagione selezionata;
- mostra gli articoli collegati ordinati per data decrescente;
- usa gli articoli gia caricati e, quando disponibile, legge anche l'archivio statico Calciomercato;
- non modifica la navigazione principale e non aggiunge link permanenti nel menu.

## Funzionalita preservate

La V335 preserva tutte le funzionalita gia presenti all'ultimo merge su master e documentate in V333/V334.

### Calciomercato

- Caricamento articoli da feed RSS automatici.
- Caricamento articoli da pagine HTML TMW squadra.
- Lettura archivio statico giornaliero da `assets/calciomercato/archive/`.
- Download Admin archivio statico con limiti V329.
- Fonti TMW squadra in `links.json`.
- Esclusione fonte generica TMW tramite `removedSourcesV316`.
- Filtri `Cerca`, `Fonte`, `Squadra`, `Da`, `A`.
- Range temporale, carica articoli piu vecchi e fusione archivio statico.
- Card compatte V332.
- Anteprima testo nascosta V331.
- Titolo e immagine cliccabili.
- Pulsante `Apri articolo` nascosto da mobile.
- Fallback immagini/favicon/TMW testuale V328-V330.
- Pannello `Solo Admin` espandibile/riducibile V327.

### Listone

- Visualizzazione Listone pubblico.
- Ultimo listone della stagione selezionata.
- Colonna `Modifica`.
- Filtro `Modifiche`.
- Usciti storici.
- Export CSV modifiche solo Admin.
- Manifest e JSON Listoni non modificati da V335.

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
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/assets/css/refactor/calciomercato.css
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
static/zonaorientale/assets/listoni/*.json
static/zonaorientale/assets/listoni/manifest.json
docs/zonaorientale/FUNZIONALITA'.md
```

## Diagnostica runtime

La V335 aggiunge:

```js
window.ZonaOrientaleCalciomercatoPlayersV335
```

Campi/funzioni principali:

- `version: "V335"`;
- `listoneScope: "ultimo listone della stagione selezionata"`;
- `matchingPolicy: "nome completo + cognome univoco conservativo"`;
- `getLatestListone()`;
- `getArticlePlayerMatches(article)`;
- `activateTimeline()`.

## Rischi controllati

| Area | Rischio | Mitigazione |
|---|---|---|
| Tag giocatore errato | falsi positivi da cognomi comuni | match cognome solo se univoco nel listone e lungo almeno 5 caratteri |
| Navigazione hash | conflitto con pagina squadra dinamica | `isKnownStaticHashV43` viene estesa per riconoscere `calciomercato-player-*` |
| Timeline vuota | archivio non ancora esteso o range limitato | messaggio esplicativo e uso dell'archivio statico quando disponibile |
| Performance timeline | molti JSON archivio | caricamento solo su click tag, cache sessione `playerTimelinePoolV335`, massimo 370 giorni |
| Regressioni altre sezioni | refactor troppo ampio | Netlify, Firebase, Listone JSON, rose e admin non modificati |

## Verifiche consigliate in browser

1. Aprire Calciomercato.
2. Verificare che le card restino compatte come V332.
3. Cercare articoli con nomi presenti nel listone e verificare la comparsa del tag giocatore.
4. Cliccare il tag e verificare apertura pagina `Timeline <Giocatore>`.
5. Tornare al Calciomercato con il pulsante dedicato.
6. Verificare filtri `Cerca`, `Squadra`, `Fonte`, `Da`, `A`.
7. Verificare pannello `Solo Admin`.
8. Verificare Listone e filtro `Modifiche`.
9. Verificare mobile menu `Altro`.
