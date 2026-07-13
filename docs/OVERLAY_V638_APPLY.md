# Applicazione overlay V638

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v638_listone_giocatori_fantasy/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v638_listone_giocatori_fantasy/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v638.mjs
node static/fanta-engine/tools/audit-iosudo-v638.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v638.js
node --check static/iosudo/sw.js
```
