# Overlay V624 - Applicazione

## Copia file

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v624_players_unique_detail/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v624_players_unique_detail/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v624.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v624.js
node --check static/iosudo/sw.js
```
