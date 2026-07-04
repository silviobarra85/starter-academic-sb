# AI Assistant handoff - V517

Overlay whole-site per risolvere il residuo V512 su FantaPetilloMantraManager.

## Regole operative

Applicare con una sola copia delle radici:

```bash
cp -R ~/Downloads/overlay_v517_fantapetillo_runtime_cache_whole_site/static/* static/
cp -R ~/Downloads/overlay_v517_fantapetillo_runtime_cache_whole_site/docs/* docs/
```

Poi eseguire:

```bash
node static/fanta-engine/tools/audit-runtime-boot-whole-site-v517.mjs
grep -R "league-config-v443.js?v=512\|formValidatorsV506," -n static/fantapetillomantramanager static/zonaorientale static/fanta-engine
```

Il secondo comando non deve produrre output sui runtime principali delle leghe.
