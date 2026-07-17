# Overlay ioSudo V708 — istruzioni applicazione

Applicare dalla root del progetto:

```bash
cp -R overlay_iosudo_v708/static/* static/
cp -R overlay_iosudo_v708/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v708.js
node static/fanta-engine/tools/audit-iosudo-v708.mjs
```

L'overlay contiene solo file modificati/nuovi per V708.
