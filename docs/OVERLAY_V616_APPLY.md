# Applicazione overlay V616

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v616_mercato_fonti_extra/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v616_mercato_fonti_extra/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v616.mjs
node static/fanta-engine/tools/audit-iosudo-v616.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v616.js
node --check static/fanta-engine/js/apps/iosudo-app-v616.js
node --check static/iosudo/sw.js
```
