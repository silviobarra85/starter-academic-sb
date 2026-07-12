# Overlay V620 - Applicazione

## Copia file

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v620_global_buttons/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v620_global_buttons/docs/* docs/
```

## Verifiche

```bash
node static/fanta-engine/tools/audit-iosudo-v620.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v620.js
node --check static/iosudo/sw.js
```

## Git

```bash
git status

git add \
  static/iosudo/index.html \
  static/iosudo/sw.js \
  static/fanta-engine/css/iosudo-app-v620.css \
  static/fanta-engine/js/apps/iosudo-app-v620.js \
  static/fanta-engine/tools/audit-iosudo-v620.mjs \
  static/zonaorientale/assets/league-config.json \
  static/fantapetillomantramanager/assets/league-config.json \
  docs/AI_ASSISTANT_HANDOFF_CURRENT.md \
  docs/AI_ASSISTANT_HANDOFF_V620.md \
  docs/IOSUDO_APP_V620.md \
  docs/OVERLAY_V620_APPLY.md \
  docs/OVERLAY_ROADMAP.md \
  docs/zonaorientale/00_STATO_CORRENTE_E_INDICE.md \
  docs/fantapetillomantramanager/00_STATO_CORRENTE_E_INDICE.md

git commit -m "V620 aggiunge viste rapide globali a ioSudo"

git push origin HEAD:master
```
