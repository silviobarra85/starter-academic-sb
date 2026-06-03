# V309 - Calciomercato automatico RSS

## Scopo

V309 trasforma la sezione `Calciomercato` da base statica/manuale a sezione con recupero automatico server-side degli articoli dalle fonti configurate.

La logica e' prudente:

- il browser non legge direttamente siti esterni;
- il recupero automatico passa da Netlify Function;
- `assets/calciomercato/links.json` resta il file di configurazione delle fonti;
- `articles` in `links.json` resta disponibile come fallback/manuale;
- se la funzione non risponde, il sito usa il JSON statico e non blocca la pagina.

## File principali

```text
netlify/functions/calciomercato-feed.js
static/zonaorientale/assets/calciomercato/links.json
static/zonaorientale/assets/app.js
static/zonaorientale/assets/css/refactor/calciomercato.css
```

## Fonti iniziali

Fonti attive iniziali:

```text
https://www.tuttomercatoweb.com
https://www.sosfanta.com
https://gianlucadimarzio.com
```

`Fantacalcio.it` e' annotato come fonte suggerita, ma non attivato automaticamente finche non viene verificato un feed/API stabile.

## Schema fonte

```json
{
  "id": "tmw",
  "name": "TuttoMercatoWeb",
  "url": "https://www.tuttomercatoweb.com",
  "feedUrl": "https://www.tuttomercatoweb.com/rss/",
  "enabled": true,
  "topic": "Mercato",
  "limit": 12
}
```

## Output funzione

La funzione restituisce JSON normalizzato:

```json
{
  "version": "V309",
  "sourceMode": "automatic-rss",
  "generatedAt": "2026-06-03T00:00:00.000Z",
  "sources": [],
  "warnings": [],
  "articles": []
}
```

Ogni articolo puo includere:

```text
title, url, sourceId, sourceName, description, image, publishedAt,
topic, marketStatus, teams, players, tags
```

## Funzionalita a rischio e preservazione

Funzionalita da non perdere:

```text
Fantamercato interno
Listone pubblico/Admin
Export CSV solo Admin
Colonna Modifica, filtro Modifiche, usciti storici
Rose e pagina squadra
Dashboard Presidente
Admin Diagnostica/Richieste/Converti listone
Firebase/Auth/EmailJS
Mobile bottom nav/menu Altro/pulsante Su
Dark mode unico, Light mode sospesa
competition.html e player.html
```

Preservazione in V309:

- nessuna scrittura Firebase;
- nessuna modifica al Fantamercato interno;
- nessuna modifica ai dati Listone/Rose/Competizioni;
- fallback statico se la Netlify Function non e' disponibile;
- funzione isolata sotto `netlify/functions/`;
- nessun scraping client-side dal browser.

## Test consigliati

```bash
static/zonaorientale/tools/check-zonaorientale.sh
node --check netlify/functions/calciomercato-feed.js
```

Test browser:

```text
Calciomercato su Netlify: articoli recuperati automaticamente
Calciomercato locale con http.server: fallback statico senza bloccare la pagina
Listone pubblico: export CSV non visibile
Listone Admin: export CSV visibile e funzionante
Fantamercato interno invariato
Admin -> Diagnostica dati invariata
```

Console:

```js
window.ZonaOrientaleCalciomercatoV309
window.ZonaOrientaleCalciomercatoV309.getState()
```
