# Overlay ioSudo V709 — istruzioni applicazione

Applicare dalla root del progetto:

```bash
cp -R overlay_iosudo_v709/static/* static/
cp -R overlay_iosudo_v709/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v709.js
node static/fanta-engine/tools/audit-iosudo-v709.mjs
```

L'overlay contiene solo file modificati/nuovi per V709.
