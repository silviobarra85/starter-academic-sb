# Overlay ioSudo V721 - istruzioni applicazione

Applicare dalla radice del progetto:

```bash
cp -R overlay_iosudo_v721/static/* static/
cp -R overlay_iosudo_v721/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v721.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v721.mjs
```

Base: V720. Fonte: Excel V76.
