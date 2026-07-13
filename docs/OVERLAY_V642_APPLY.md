# Overlay V642 apply

Da smartphone, caricare lo zip in `incoming/overlays/` e fare commit: la GitHub Action V641 lo applica automaticamente.

Da Mac:

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v642_players_view_fix/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v642_players_view_fix/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v642.mjs
node static/fanta-engine/tools/audit-iosudo-v642.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v642.js
node --check static/iosudo/sw.js
```
