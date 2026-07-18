# Overlay ioSudo V719

Applicare dalla root del progetto:

```bash
cp -R overlay_iosudo_v719/static/* static/
cp -R overlay_iosudo_v719/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v719.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v719.mjs
```
