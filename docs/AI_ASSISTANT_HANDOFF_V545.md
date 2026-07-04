# AI Assistant handoff V545

## Stato

V545 corregge la regressione della pagina Calciomercato dopo il cleanup dei fallback locali Listoni/Calciomercato.

## Problema risolto

Il messaggio "Calciomercato non configurato" poteva comparire anche con asset centrali presenti, perche il loader non provava abbastanza candidati path per `fanta-engine/data/shared-assets/current` nei diversi contesti di hosting.

## File chiave

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/assets/league-config.json`
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/fantapetillomantramanager/assets/js/core/league-config-v443.js`
- `netlify/functions/calciomercato-feed.js`
- `static/fanta-engine/tools/audit-calciomercato-central-path-candidates-v545.mjs`

## Guardrail

Non reintrodurre le cartelle locali:

```text
static/zonaorientale/assets/calciomercato/
static/fantapetillomantramanager/assets/calciomercato/
```

Il path operativo resta:

```text
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

## Prossimi overlay

Nessun overlay funzionale previsto. Eventuali step futuri dovrebbero essere bugfix mirati o una nuova roadmap esplicita.
