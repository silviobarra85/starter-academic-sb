# Overlay V619 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v619_mercato_fonti_extra_v3/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v619_mercato_fonti_extra_v3/docs/* docs/
```

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v619.mjs
node static/fanta-engine/tools/audit-iosudo-v619.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v619.js
node --check static/fanta-engine/js/apps/iosudo-app-v619.js
node --check static/iosudo/sw.js
```
