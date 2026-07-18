# Overlay ioSudo V720 - istruzioni applicazione

Applicare dalla radice del progetto:

```bash
cp -R overlay_iosudo_v720/static/* static/
cp -R overlay_iosudo_v720/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v720.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v720.mjs
```

Base: V719. Fonte: Excel V75.
