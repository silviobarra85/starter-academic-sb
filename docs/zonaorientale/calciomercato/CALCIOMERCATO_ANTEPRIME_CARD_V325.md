# Calciomercato V325 - Anteprime schede e immagine fonte archivio statico

## Obiettivo

V325 interviene solo sulle schede articolo della sezione Calciomercato.

Le modifiche richieste sono:

- anteprime descrittive non piu' troncate o nascoste nelle card;
- rimozione visuale della sottosezione `Giocatori/Allenatori` dalle schede articolo;
- immagine di fallback della fonte per gli articoli letti dall'archivio statico `assets/calciomercato/archive/` quando non hanno immagine propria.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `docs/zonaorientale/CHANGELOG_CONSOLIDATO.md`
- `docs/zonaorientale/calciomercato/CALCIOMERCATO_ANTEPRIME_CARD_V325.md`
- `docs/zonaorientale/release/RELEASE_V325_ANTEPRIME_CALCIOMERCATO.md`

## Dettagli tecnici

### Anteprime complete

Il CSS Calciomercato ora lascia le descrizioni libere di occupare tutta la larghezza disponibile della card:

- rimosso il limite `max-width: 72ch` sulle descrizioni;
- rimosso il clamp a 5 righe sotto i 460px;
- rimosso il `display: none` applicato alle descrizioni nel layout mobile compatto;
- mantenuto il layout card esistente e le stesse classi base V306/V319.

### Rimozione sottosezione `Giocatori/Allenatori`

La funzione `renderCalciomercatoArticleCardV306` non renderizza piu' il blocco:

- `calciomercato-players-v306`
- `calciomercato-players-label-v306`
- `calciomercato-player-chip-v306`

Le funzioni di estrazione giocatori restano in `app.js` per non rompere filtri, ricerca, diagnostica storica e controlli V306/V320.

### Immagine fonte per archivio statico

Aggiunte funzioni V325:

- `isCalciomercatoStaticArchiveArticleV325`
- `getCalciomercatoArticleImageInfoV325`
- `buildCalciomercatoSourceImageSvgV325`

Comportamento:

1. se l'articolo ha gia' `image`, `thumbnail`, `imageUrl` o `ogImage`, viene mantenuta l'immagine esistente;
2. se l'articolo e' statico da archivio e non ha immagine, viene generata una tile SVG locale con il nome della fonte;
3. se l'articolo arriva dal feed live e non ha immagine, resta il placeholder esistente.

Questo evita dipendenze da CDN esterni per il fallback fonte e non modifica i JSON archiviati.

## Funzionalita a rischio e preservazione

Funzionalita considerate a rischio:

- feed RSS automatico Calciomercato;
- archivio statico giornaliero V323/V324;
- deduplica live + statico;
- filtri Squadre/Topic/Fonti;
- ricerca libera;
- range Da/A;
- caricamento articoli piu' vecchi;
- diagnostica archivio solo Admin;
- Fantamercato interno;
- Listone, Rose, Dashboard Presidente, Admin, EmailJS, Firebase.

Preservazione:

- nessuna modifica a `netlify/functions/calciomercato-feed.js`;
- nessuna modifica ai JSON `assets/calciomercato/archive/*.json`;
- nessuna modifica a `assets/calciomercato/links.json`;
- nessuna scrittura Firebase nuova;
- nessuna modifica a EmailJS;
- le funzioni giocatori restano disponibili per ricerca e diagnostica;
- i CSS dei chip giocatori restano conservati per compatibilita, ma il blocco non viene piu' inserito nelle card.

## Test manuali richiesti

1. Aprire la home pubblica.
2. Entrare in Calciomercato.
3. Verificare che le descrizioni degli articoli siano visibili anche da mobile.
4. Verificare che le descrizioni non siano troncate a 5 righe.
5. Verificare che il blocco `Giocatori/Allenatori` non compaia piu' nelle schede.
6. Impostare un range che includa articoli statici da `assets/calciomercato/archive/`.
7. Verificare che gli articoli statici senza immagine mostrino una tile fonte, per esempio `SOS Fanta`, `CalcioMercato.it`, `Fantacalcio.it`.
8. Verificare che gli articoli con immagine propria continuino a mostrare la loro immagine.
9. Verificare filtri Squadre/Topic/Fonti, ricerca e range temporale.
10. Login Admin: verificare che la diagnostica archivio V324 resti visibile e funzionante.
