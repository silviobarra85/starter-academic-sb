# Overlay V625 - Applicazione

## Copia file

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v625_players_click_detail/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v625_players_click_detail/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v625.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v625.js
node --check static/iosudo/sw.js
```
