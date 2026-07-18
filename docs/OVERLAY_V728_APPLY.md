# Overlay ioSudo V728

Applicare dalla radice del progetto:

```bash
cp -R overlay_iosudo_v728/static/* static/
cp -R overlay_iosudo_v728/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v728.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v728.mjs
```

Include dataset V728, app/CSS V728, service worker V728, audit V728 e documentazione.
