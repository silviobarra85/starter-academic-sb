# AI Assistant Handoff V547

## Versione

V547 - Calciomercato archive visibility.

## Stato

V547 corregge la regressione post-cleanup per cui la pagina Calciomercato non mostrava articoli anche se l'errore di configurazione era scomparso.

La causa era il filtro data: gli articoli centrali dell'archivio venivano caricati, ma il range automatico corrente poteva escluderli tutti.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/fantapetillomantramanager/assets/js/core/league-config-v443.js`
- entrypoint HTML delle due leghe
- `assets/league-config.json` delle due leghe
- `static/fanta-engine/tools/audit-calciomercato-archive-visibility-v547.mjs`
- docs e handoff

## Guardrail

- Overlay whole-site.
- Nessun ripristino fallback locali Listoni/Calciomercato.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Nessuna modifica Firebase/EmailJS/Admin/Presidente.
- Docs e handoff aggiornati.

## Test

Eseguire:

```bash
node static/fanta-engine/tools/audit-calciomercato-archive-visibility-v547.mjs
```

Poi controllare Calciomercato su ZonaOrientale e FantaPetilloMantraManager.
