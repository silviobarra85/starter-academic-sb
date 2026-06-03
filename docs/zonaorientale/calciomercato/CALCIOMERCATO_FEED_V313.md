# V313 - Calciomercato feed RSS esteso

## Scopo

V313 migliora l'aggregatore Calciomercato senza trasformarlo in scraping browser. La raccolta resta server-side tramite Netlify Function.

## Modifiche

- La Netlify Function `netlify/functions/calciomercato-feed.js` passa a `version: V313`.
- Supporta piu' feed per fonte tramite `feedUrls`, `rssUrls` o `feeds`, oltre al singolo `feedUrl`.
- Deduplica gli articoli per URL anche quando arrivano da piu' feed.
- Aumenta il limite configurabile degli articoli:
  - `sourceLimit` / `limit` per fonte;
  - `maxArticles` globale in `assets/calciomercato/links.json`;
  - parametro query `?limit=N` per test server-side.
- Mantiene il fallback statico `articles` in `links.json`.

## Fonti correnti

Configurazione base:

- TuttoMercatoWeb.
- SOS Fanta.
- Gianluca Di Marzio.

## Funzionalita a rischio e preservazione

Funzionalita da non perdere:

- Sezione `Calciomercato` pubblica.
- Recupero automatico RSS V309.
- Fallback statico `links.json`.
- Layout orizzontale V310.
- Data/ora e fuso Europe/Rome V311/V312.
- Giocatori interessati V306.
- Squadre multiple e stato trattativa V308.
- Fantamercato interno, distinto dal Calciomercato notizie.
- Listone, Rose, Admin, Presidente.

Preservazione applicata:

- Nessuno scraping dal browser.
- Nessuna scrittura Firebase.
- Nessuna modifica al Fantamercato interno.
- La funzione restituisce sempre JSON anche in caso di errore fonte.

## Test Netlify

```bash
node --check netlify/functions/calciomercato-feed.js
npx netlify-cli dev \
  --command "python3 -m http.server 1314 --directory static --bind 0.0.0.0" \
  --target-port 1314 \
  --port 8888
```

Aprire:

```text
http://localhost:8888/.netlify/functions/calciomercato-feed
http://localhost:8888/.netlify/functions/calciomercato-feed?limit=80
http://localhost:8888/zonaorientale/#calciomercato
```
