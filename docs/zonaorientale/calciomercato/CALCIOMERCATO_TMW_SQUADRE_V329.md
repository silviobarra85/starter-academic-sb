# Calciomercato TMW squadre - V329

## Obiettivo

Integrare in `assets/calciomercato/links.json` i 20 link squadra `tuttomercatoweb.com` forniti, senza perdere le funzionalita' gia presenti della sezione Calciomercato.

## Modifiche applicate

- Il feed generico `tmw` non e' piu tra le fonti attive.
- Sono state aggiunte 20 fonti dedicate:
  - `tmw-atalanta`
  - `tmw-bologna`
  - `tmw-cagliari`
  - `tmw-como`
  - `tmw-fiorentina`
  - `tmw-frosinone`
  - `tmw-genoa`
  - `tmw-inter`
  - `tmw-juventus`
  - `tmw-lazio`
  - `tmw-lecce`
  - `tmw-milan`
  - `tmw-monza`
  - `tmw-napoli`
  - `tmw-parma`
  - `tmw-roma`
  - `tmw-sassuolo`
  - `tmw-torino`
  - `tmw-udinese`
  - `tmw-venezia`
- Ogni fonte TMW squadra usa `parseMode: "html"`, `sourceType: "tmw-team-html"`, `defaultTeams` e `fallbackImageMode: "team-crest"`.
- La Netlify Function `calciomercato-feed` mantiene il parsing RSS, ma aggiunge un parser HTML conservativo per le pagine squadra TMW.
- I limiti sono stati alzati a:
  - `maxArticles: 5000`
  - `sourceLimit: 500`
  - `maxSources: 30`
  - hard cap funzione: 5000 globali, 2000 per fonte.
- Il tool Admin per scaricare l'archivio giornaliero usa ora `limit=5000` e `maxArticles=5000`.
- Per le card TMW squadra senza immagine di anteprima viene generato uno scudetto fallback della squadra.

## Funzionalita preservate

- RSS automatici non TMW: SOS Fanta, Gianluca Di Marzio, Fantacalcio.it, CalcioMercato.it.
- Archivio statico `assets/calciomercato/archive/`.
- Merge e deduplica archivio/feed.
- Filtri Calciomercato per ricerca, squadra, topic, fonte e range temporale.
- Card mobile V328 senza anteprima lunga.
- Toggle Solo Admin V327.
- Menu mobile/Listone V326.
- Fantamercato interno, Listone, Rose, Dashboard Presidente, Admin generale, Firebase/Auth/EmailJS.

## Note operative

Dopo il deploy, un Admin puo entrare in Calciomercato, scegliere il range Da/A e usare il pannello Solo Admin per scaricare i JSON giornalieri e il manifest aggiornato. I file scaricati vanno copiati in:

```text
static/zonaorientale/assets/calciomercato/archive/
```

Poi vanno committati insieme al resto della release.
