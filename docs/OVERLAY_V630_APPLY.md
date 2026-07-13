# Overlay V630 - Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v630_date_logiche_fonti/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v630_date_logiche_fonti/docs/* docs/
```

```bash
node static/fanta-engine/tools/audit-sudatori-section-v630.mjs
node static/fanta-engine/tools/audit-iosudo-v630.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v630.js
node --check static/fanta-engine/js/apps/iosudo-app-v630.js
node --check static/iosudo/sw.js
```
