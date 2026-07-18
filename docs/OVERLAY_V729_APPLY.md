# Overlay ioSudo V729

Applicare dalla radice del progetto:

```bash
cp -R overlay_iosudo_v729/static/* static/
cp -R overlay_iosudo_v729/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v729.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v729.mjs
```
