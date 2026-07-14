# Applicazione overlay V644

## Con GitHub Actions da smartphone

Caricare lo zip in `incoming/overlays/` e fare commit. La workflow applica l'overlay automaticamente.

## Da Mac

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v644/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v644/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v644.mjs
node static/fanta-engine/tools/audit-iosudo-v644.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v644.js
node --check static/fanta-engine/js/sections/sudatori-section-v644.js
node --check static/iosudo/sw.js
```
