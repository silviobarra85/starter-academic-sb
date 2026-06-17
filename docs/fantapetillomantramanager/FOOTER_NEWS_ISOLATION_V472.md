# V472 - Footer pulito e news FantaPetillo isolate

## Obiettivo

Correggere due contaminazioni emerse dopo il clone multi-lega:

- il footer veniva riscritto a runtime da `assets/js/core/league-config-v443.js` con testo hard-coded `vecchia etichetta tecnica del clone con data 15/06/2026`;
- `static/fantapetillomantramanager/news.html` conteneva ancora meta, titolo, descrizione e hash del comunicato playoff di ZonaOrientale.

## Modifica applicata

- Il loader `league-config-v443.js` non contiene piu' testo footer specifico del clone: legge `branding.footerTemplate` e `branding.footerLastUpdated` da `assets/league-config.json`.
- `currentVersion` e cache-buster attivi passano a `472`.
- Footer attesi:
  - `ZonaOrientale Salerno · V472 · Ultimo aggiornamento 17/06/2026`;
  - `FantaPetilloMantraManager · V472 · Ultimo aggiornamento 17/06/2026`.
- `news.html` di FantaPetillo diventa una landing comunicati dedicata e neutra finche' non esistono comunicati FantaPetillo reali.
- Il generator statico `tools/generate-news-share-pages.mjs` del clone FantaPetillo usa default FantaPetillo e gestisce anche il caso `news: []`, evitando di rigenerare contenuti ZonaOrientale.

## Funzionalita preservate

- Nessuna funzionalita pubblica, Admin, Firebase, snapshot, Bilanci, Area Squadra, regolamento, favicon o device badge V434 e' stata rimossa.
- Il redirect Netlify multi-lega V466 resta invariato.
- Le news FantaPetillo restano pronte per contenuti dedicati e non riusano piu' comunicati ZonaOrientale.

## Test introdotto

Aggiunto `tools/audit-footer-news-isolation-v472.mjs` in entrambe le leghe. Il test verifica:

- footer HTML puliti e separati per lega;
- loader senza stringhe `vecchia etichetta tecnica del clone` e senza data `15/06/2026`;
- `currentVersion = 472` nei JSON di config;
- `news.html` FantaPetillo senza riferimenti a ZonaOrientale e senza vecchio hash `news-ujE2CqJMjzkYhhjzZZHD`;
- generator FantaPetillo senza default ZonaOrientale e con fallback no-news.
