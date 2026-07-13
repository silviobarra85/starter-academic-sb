# Overlay V623 - Applicazione

## Copia file

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v623_players_market_detail/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v623_players_market_detail/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v623.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v623.js
node --check static/iosudo/sw.js
```
