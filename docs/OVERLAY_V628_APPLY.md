# Overlay V628 - Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v628_fonti_articoli/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v628_fonti_articoli/docs/* docs/
```

```bash
node static/fanta-engine/tools/audit-sudatori-section-v628.mjs
node static/fanta-engine/tools/audit-iosudo-v628.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v628.js
node --check static/fanta-engine/js/apps/iosudo-app-v628.js
node --check static/iosudo/sw.js
```
