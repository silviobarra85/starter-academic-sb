# AI Assistant handoff V561

## Versione

V561 - Calciomercato disattivato e feed articoli bloccato.

## Sintesi

La patch rimuove Calciomercato dalle due leghe e impedisce il recupero degli articoli. L'obiettivo e' alleggerire l'apertura, soprattutto di ZonaOrientale, senza reintrodurre layer runtime pesanti e senza toccare le funzioni core.

## File modificati principali

- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/zonaorientale/player.html`
- `static/zonaorientale/competition.html`
- `static/fantapetillomantramanager/player.html`
- `static/fantapetillomantramanager/competition.html`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/assets/league-config.json`
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/fantapetillomantramanager/assets/js/core/league-config-v443.js`
- `netlify/functions/calciomercato-feed.js`
- `static/fanta-engine/tools/audit-calciomercato-disabled-v561.mjs`
- `docs/CALCIOMERCATO_DISABLED_V561.md`

## Decisioni tecniche

- Non cancellati asset o archivi Calciomercato: la patch e' reversibile.
- Gli import statici Calciomercato sono sostituiti con stub locali V561 per evitare download moduli dedicati.
- Il DOM della sezione Calciomercato e i link visibili sono rimossi.
- Il feed serverless `calciomercato-feed` resta presente per compatibilita', ma risponde sempre con `sourceMode: disabled-v561` e `articles: []`.
- Gli hash legacy Calciomercato vengono ricondotti a Dashboard.

## Funzionalita' preservate

- Firebase, Auth e Firestore.
- EmailJS.
- Admin e Dashboard Presidente.
- News/comunicati interni e share news.
- Listone, Rose, Svincolati e Fantamercato.
- Bilanci, Competizioni, Regolamento, Archivio, Statistiche, Albo d'Oro.
- Preloader V560.
- Router nativo ripristinato in V558.

## Audit

Eseguire:

```bash
node static/fanta-engine/tools/audit-calciomercato-disabled-v561.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
node --check netlify/functions/calciomercato-feed.js
```

## Checklist regressioni

- ZonaOrientale: Calciomercato non presente in nav e Altro mobile.
- FantaMantraManager: Calciomercato non presente in nav e Altro mobile.
- Accesso diretto a `#calciomercato` torna a Dashboard.
- Nessuna chiamata Network a `/.netlify/functions/calciomercato-feed` durante apertura normale.
- News e comunicati interni continuano a funzionare.
- Listone/Fantamercato/Admin/Presidente funzionano dopo la scomparsa del preloader.
