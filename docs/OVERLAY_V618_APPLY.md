# Applicazione overlay V618

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v618_live_rosters/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v618_live_rosters/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v618.mjs
node static/fanta-engine/tools/audit-iosudo-v618.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v618.js
node --check static/fanta-engine/js/apps/iosudo-app-v618.js
node --check static/iosudo/sw.js
```
