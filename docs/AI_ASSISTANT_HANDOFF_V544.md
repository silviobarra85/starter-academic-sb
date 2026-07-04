# AI Assistant Handoff V544

## Stato

V544 corregge il Calciomercato dopo la rimozione dei fallback locali V543.

## Causa

`netlify/functions/calciomercato-feed.js` usava ancora il path legacy `zonaorientale/assets/calciomercato/links.json`; dopo il cleanup, quel percorso non esiste più. Il path canonico è ora `static/fanta-engine/data/shared-assets/current/assets/calciomercato/`.

## File principali

- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/fanta-engine/tools/audit-calciomercato-central-feed-v544.mjs`

## Verifica

Eseguire:

```bash
node static/fanta-engine/tools/audit-calciomercato-central-feed-v544.mjs
```

Poi test manuale Calciomercato su entrambe le leghe.

## Note operative

Non ripristinare `static/<lega>/assets/calciomercato/`. Da V543/V544 il caricamento corretto passa dal path centrale `fanta-engine`.
