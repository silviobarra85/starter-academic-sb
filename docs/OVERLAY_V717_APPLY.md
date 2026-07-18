# Overlay ioSudo V717 - applicazione

Applicare dalla root del progetto:

```bash
cp -R overlay_iosudo_v717/static/* static/
cp -R overlay_iosudo_v717/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v717.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v717.mjs
```

L'overlay contiene solo i file modificati per V717.
