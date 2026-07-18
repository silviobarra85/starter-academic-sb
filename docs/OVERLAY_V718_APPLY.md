# Overlay ioSudo V718

Applicare dalla root del progetto:

```bash
cp -R overlay_iosudo_v718/static/* static/
cp -R overlay_iosudo_v718/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v718.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v718.mjs
```
