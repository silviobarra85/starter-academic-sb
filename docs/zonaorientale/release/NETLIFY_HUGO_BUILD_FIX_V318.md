# V318 - Fix build Netlify Hugo 0.80

## Obiettivo

V318 corregge il deploy Netlify dopo il passaggio del build image a una versione Hugo recente (`0.161.x`), incompatibile con il vecchio stack Wowchemy del sito principale.

## Problema rilevato

Il deploy falliva prima della pubblicazione con errori su:

- front matter `_build` rimosso nelle versioni Hugo recenti;
- accesso bloccato a `getenv "WC_POST_CSS"` dalle policy di sicurezza Hugo moderne.

Il repository conteneva gia' `HUGO_VERSION = "0.80.0"`, ma il nuovo ambiente Netlify stava comunque eseguendo Hugo `0.161.x`.

## Soluzione

La build Netlify usa ora uno script dedicato:

```text
netlify/build-hugo-0.80.sh
```

Lo script scarica Hugo extended `0.80.0` in `/tmp` ed esegue quel binario esplicitamente, evitando il binario Hugo recente presente nel build image.

## File modificati

```text
netlify.toml
netlify/build-hugo-0.80.sh
```

## Funzionalita' preservate

La modifica riguarda solo la pipeline di build/deploy. Non cambia runtime, CSS, JS, Firebase, dati, Calciomercato, Listone, Rose, Admin, Presidente o News.

Funzionalita' da verificare dopo deploy riuscito:

- footer V317 online;
- Calciomercato RSS e Netlify Function `calciomercato-feed`;
- share news via `news-share`;
- Home, Listone, Rose, Dashboard Presidente, Admin.

## Test consigliati

```bash
bash -n netlify/build-hugo-0.80.sh
node --check netlify/functions/calciomercato-feed.js
node --check netlify/functions/news-share.js
```

Dopo deploy:

```bash
curl -sL "https://silviobarra.com/zonaorientale/?v=317-force" | grep -E "V317|V278|ZonaOrientale Salerno"
```
