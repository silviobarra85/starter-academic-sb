# Overlay V631 - Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v631_date_logiche_fonti/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v631_date_logiche_fonti/docs/* docs/
```

```bash
node static/fanta-engine/tools/audit-sudatori-section-v631.mjs
node static/fanta-engine/tools/audit-iosudo-v631.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v631.js
node --check static/fanta-engine/js/apps/iosudo-app-v631.js
node --check static/iosudo/sw.js
```
