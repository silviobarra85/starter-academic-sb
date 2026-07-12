# Overlay V617 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v617_mercato_fonti_extra_v2/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v617_mercato_fonti_extra_v2/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v617.mjs
node static/fanta-engine/tools/audit-iosudo-v617.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v617.js
node --check static/fanta-engine/js/apps/iosudo-app-v617.js
node --check static/iosudo/sw.js
```
