# Overlay V621 - Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v621_players_all_detail/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v621_players_all_detail/docs/* docs/
```

## Audit

```bash
node static/fanta-engine/tools/audit-iosudo-v621.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v621.js
node --check static/iosudo/sw.js
```

## Push

```bash
git status

git add \
  static/iosudo/index.html \
  static/iosudo/sw.js \
  static/fanta-engine/css/iosudo-app-v621.css \
  static/fanta-engine/js/apps/iosudo-app-v621.js \
  static/fanta-engine/tools/audit-iosudo-v621.mjs \
  static/zonaorientale/assets/league-config.json \
  static/fantapetillomantramanager/assets/league-config.json \
  docs/AI_ASSISTANT_HANDOFF_CURRENT.md \
  docs/AI_ASSISTANT_HANDOFF_V621.md \
  docs/IOSUDO_APP_V621.md \
  docs/OVERLAY_V621_APPLY.md \
  docs/OVERLAY_ROADMAP.md \
  docs/zonaorientale/00_STATO_CORRENTE_E_INDICE.md \
  docs/fantapetillomantramanager/00_STATO_CORRENTE_E_INDICE.md

git commit -m "V621 mostra tutti i giocatori in ioSudo"

git push origin HEAD:master
```
