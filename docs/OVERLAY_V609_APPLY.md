# Overlay V609 - ioSudo PWA

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v609_pwa/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v609_pwa/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v609.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v609.js
node --check static/iosudo/sw.js
```
