# Applicazione overlay V626

## Copia file

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v626_mercato_fonti_ufficialita/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v626_mercato_fonti_ufficialita/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v626.mjs
node static/fanta-engine/tools/audit-iosudo-v626.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v626.js
node --check static/fanta-engine/js/apps/iosudo-app-v626.js
node --check static/iosudo/sw.js
```
