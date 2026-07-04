# AI Assistant handoff - V537

## Overlay

`overlay_v537_multiseason_path_resolver_whole_site.zip`

## Scopo

Attivare il multi-season path resolver senza spostare dati. V526 aveva introdotto l'adapter metadata-first; V537 lo usa come runtime comune per risolvere percorsi statici, distinguendo dati condivisi e dati per-stagione.

## File principali

- `static/fanta-engine/js/core/season-path-resolver-v537.js`
- `static/fanta-engine/tools/audit-multiseason-path-resolver-v537.mjs`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/assets/js/data/static-files-service.js`
- `static/fantapetillomantramanager/assets/js/data/static-files-service.js`
- `docs/MULTISEASON_PATH_RESOLVER_V537.md`

## Guardrail

- Overlay unico whole-site.
- Solo file modificati nello zip.
- Docs e handoff aggiornati.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna modifica a Firebase, EmailJS, Admin o Presidente.
- Nessuna cancellazione dei fallback locali.
- Nessuna migrazione fisica di snapshot/rose/competizioni/bilanci.

## Verifica

```bash
node static/fanta-engine/tools/audit-multiseason-path-resolver-v537.mjs
```

## Roadmap dopo V537

Restano 2 overlay consigliati:

- V538 Shared assets fallback cleanup readiness;
- V539 Merge readiness / release candidate.
