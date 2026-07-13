# Overlay V629 - Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v629_fonti_articoli_v9/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v629_fonti_articoli_v9/docs/* docs/
```

```bash
node static/fanta-engine/tools/audit-sudatori-section-v629.mjs
node static/fanta-engine/tools/audit-iosudo-v629.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v629.js
node --check static/fanta-engine/js/apps/iosudo-app-v629.js
node --check static/iosudo/sw.js
```
